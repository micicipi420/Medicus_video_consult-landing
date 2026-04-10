# Makefile
# Phase 39 / LAYOUT-04
# Canonical entry point for the build pipeline.
# `make build` is the source of truth; build.sh is a thin delegator.
# POSIX make + POSIX sh + tailwindcss standalone binary. No Node.js.

.PHONY: build check install-hooks install-tailwind clean help

# Tailwind version pinned to current local binary
TAILWIND_VERSION := v4.2.2

# Detect platform/arch for the tailwindcss download
UNAME_S := $(shell uname -s)
UNAME_M := $(shell uname -m)

ifeq ($(UNAME_S),Darwin)
	TW_PLATFORM := macos
else ifeq ($(UNAME_S),Linux)
	TW_PLATFORM := linux
else
	TW_PLATFORM := unknown
endif

ifeq ($(UNAME_M),arm64)
	TW_ARCH := arm64
else ifeq ($(UNAME_M),aarch64)
	TW_ARCH := arm64
else ifeq ($(UNAME_M),x86_64)
	TW_ARCH := x64
else
	TW_ARCH := unknown
endif

TW_URL := https://github.com/tailwindlabs/tailwindcss/releases/download/$(TAILWIND_VERSION)/tailwindcss-$(TW_PLATFORM)-$(TW_ARCH)

# The 6 production HTML pages -- canonical source of truth for the page list.
# Passed to ./scripts/build-pages.sh on every build: the splicer's internal
# DEFAULT_PAGES fallback is only consulted when the splicer is invoked directly
# without args (ad-hoc debugging). `make build` always uses $(PAGES).
PAGES := index.html online-consultations.html treatment-abroad.html checkup.html contacts.html 404.html styleguide.html

help:
	@echo "Targets:"
	@echo "  make build            - Compile Tailwind CSS and splice chrome partials into HTML pages"
	@echo "  make check            - Run build then verify no chrome drift (used by pre-commit hook)"
	@echo "  make install-hooks    - Install the pre-commit hook into .git/hooks/"
	@echo "  make install-tailwind - Download the tailwindcss standalone binary if missing"
	@echo "  make clean            - No-op (no build artifacts beyond css/styles.css, which is committed)"

install-tailwind:
	@if [ ! -f ./tailwindcss ]; then \
		echo "[install-tailwind] downloading $(TAILWIND_VERSION) for $(TW_PLATFORM)-$(TW_ARCH)..."; \
		if [ "$(TW_PLATFORM)" = "unknown" ] || [ "$(TW_ARCH)" = "unknown" ]; then \
			echo "[install-tailwind] FATAL: unsupported platform $(UNAME_S)/$(UNAME_M)" >&2; \
			exit 1; \
		fi; \
		curl -fL "$(TW_URL)" -o ./tailwindcss && chmod +x ./tailwindcss; \
		echo "[install-tailwind] installed: $$(./tailwindcss --help 2>&1 | head -1)"; \
	else \
		echo "[install-tailwind] already present (skipping)"; \
	fi

build: install-tailwind
	@echo "[build] compiling Tailwind CSS..."
	@./tailwindcss -i src/styles/tailwind.css -o css/styles.css
	@echo "[build] splicing chrome partials..."
	@./scripts/build-pages.sh $(PAGES)
	@echo "[build] done"

check: build
	@echo "[check] verifying byte-identity gate..."
	@if ! git diff --quiet -- '*.html'; then \
		echo "[check] FAIL: chrome drift detected -- the following pages were modified by build:" >&2; \
		git diff --name-only -- '*.html' >&2; \
		echo "" >&2; \
		echo "Run 'make build' and commit the regenerated pages." >&2; \
		exit 1; \
	fi
	@echo "[check] OK: no chrome drift"

install-hooks:
	@if [ ! -f scripts/hooks/pre-commit ]; then \
		echo "[install-hooks] FATAL: scripts/hooks/pre-commit does not exist" >&2; \
		exit 1; \
	fi
	@chmod +x scripts/hooks/pre-commit
	@# Regular clone: .git is a directory, install a relative-path symlink at
	@#   .git/hooks/pre-commit -> ../../scripts/hooks/pre-commit
	@# Worktree: .git is a file pointing at .git/worktrees/<name>. `git rev-parse
	@# --git-common-dir` resolves to the shared .git directory, and hooks installed
	@# there apply to all worktrees. Use absolute-path symlink in that case because
	@# the relative form would not resolve correctly from the nested worktrees dir.
	@if [ -d .git ]; then \
		mkdir -p .git/hooks; \
		ln -sf ../../scripts/hooks/pre-commit .git/hooks/pre-commit; \
		echo "[install-hooks] installed: .git/hooks/pre-commit -> ../../scripts/hooks/pre-commit"; \
	else \
		GIT_COMMON_DIR=$$(git rev-parse --git-common-dir); \
		REPO_ROOT=$$(git rev-parse --show-toplevel); \
		HOOK_SRC="$$REPO_ROOT/scripts/hooks/pre-commit"; \
		HOOK_DST="$$GIT_COMMON_DIR/hooks/pre-commit"; \
		mkdir -p "$$GIT_COMMON_DIR/hooks"; \
		ln -sf "$$HOOK_SRC" "$$HOOK_DST"; \
		echo "[install-hooks] installed (worktree mode): $$HOOK_DST -> $$HOOK_SRC"; \
	fi

clean:
	@echo "[clean] no-op (no transient build artifacts; css/styles.css is committed)"
