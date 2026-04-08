# Build Pipeline

Reference documentation for the MedicusUnion landing build pipeline. Audience: contributors who need to regenerate HTML pages after editing shared chrome, add a new page, or install the pre-commit hook that enforces the chrome-drift invariant.

Source of truth: `Makefile` at repo root. All targets documented here are defined there.

## Quick start (one-time setup per clone)

```sh
# Clone the repo
git clone <repo> && cd Medicus_video_consult-landing

# Install the pre-commit hook (one-time per clone)
make install-hooks

# Download the Tailwind CSS standalone binary if you don't have it yet
make install-tailwind

# Build everything
make build
```

`make install-hooks` is the LAYOUT-13 install step and must be run once per clone. Without it, the byte-identity gate is not enforced locally — the hook is contributor-local (git doesn't track `.git/hooks/` by default), so every new clone needs one `make install-hooks` invocation. The symlink created by `install-hooks` points to the repo-tracked `scripts/hooks/pre-commit`, so updates to that file propagate to every contributor automatically on the next commit.

## `make build` — what it does

`make build` is the canonical entry point for the build pipeline. It runs two steps:

1. **Compile Tailwind CSS** — `./tailwindcss -i src/styles/tailwind.css -o css/styles.css --minify`. Uses the standalone `tailwindcss` binary (v4.2.2) pinned by the Makefile. If the binary is missing, `make install-tailwind` downloads it first.
2. **Splice chrome partials** — `./scripts/build-pages.sh $(PAGES)` reads the 4 partial files (`partials/header.html`, `partials/footer.html`, `partials/sticky-bar.html`, `partials/mobile-menu.html`), substitutes per-page tokens, and splices the expanded content into the `<!-- BUILD:partial -->` marker blocks on each of the 6 production HTML pages.

`./build.sh` is a thin shell delegator that `exec`s `make build "$@"` — typing `./build.sh` is equivalent to typing `make build`. Both entry points exist because some contributors expect `./build.sh` at repo root and others expect `make build`.

### Byte-identity invariant

On a clean checkout, running `make build` produces **zero** changes to tracked HTML files. If `make build` leaves the working tree with modified pages, either:

- A partial was edited but the pages were not regenerated yet (run `make build` and commit both),
- The splicer has a bug,
- Or a contributor edited a chrome region of a page directly instead of editing the partial (revert the page and edit the partial instead).

The `make check` target verifies this invariant: it runs `make build` then `git diff --quiet -- '*.html'` and exits non-zero on drift.

## Chrome partials — single source of truth

The four partial files in `partials/` are the canonical source of truth for the shared chrome on every page:

| Partial | File | Contents |
|---------|------|----------|
| Header | `partials/header.html` | Logo + desktop nav + mobile-menu button |
| Footer | `partials/footer.html` | Footer columns, social links, copyright line |
| Sticky CTA bar | `partials/sticky-bar.html` | Mobile-only sticky "Оставить заявку" button row |
| Mobile menu | `partials/mobile-menu.html` | Slide-down mobile navigation drawer |

**Do not edit the chrome regions of `index.html`, `online-consultations.html`, `treatment-abroad.html`, `checkup.html`, `contacts.html`, or `404.html` directly.** Any change will be overwritten by the next `make build` run. Edit the partial, run `make build`, and commit both the partial change and the regenerated pages in the same commit.

## Per-page variation via BUILD:vars

Each page has exactly one `BUILD:vars` comment block at column 0 immediately after `<body>`. Example from `index.html`:

```html
<!-- BUILD:vars CTA_HREF=#contact CTA_LABEL="Оставить заявку" CURRENT_PAGE=index -->
```

`BUILD:vars` declares three required keys per page. The splicer derives the other 8 tokens from `CURRENT_PAGE`, producing a total of 11 tokens that the splicer substitutes into the partial content:

| Token | Source | What it expands to |
|-------|--------|---------------------|
| `CTA_HREF` | declared | CTA button target (anchor fragment or page URL) |
| `CTA_LABEL` | declared | CTA button label text |
| `CURRENT_PAGE` | declared | Page identifier: `index`, `online`, `treatment`, `checkup`, `contacts`, or `404` |
| `LOGO_ARIA_CURRENT` | derived | ` aria-current="page"` on index, empty elsewhere |
| `NAV_HEADER_online` | derived | active-link class+aria OR inactive-link class on the desktop nav |
| `NAV_HEADER_treatment` | derived | same, for Treatment link |
| `NAV_HEADER_checkup` | derived | same, for Checkup link |
| `NAV_HEADER_contacts` | derived | same, for Contacts link |
| `NAV_MOBILE_online` | derived | mobile-drawer variant of the same active/inactive class |
| `NAV_MOBILE_treatment` | derived | same, for Treatment link |
| `NAV_MOBILE_checkup` | derived | same, for Checkup link |
| `NAV_MOBILE_contacts` | derived | same, for Contacts link |

The current per-page values:

| Page | CTA_HREF | CTA_LABEL | CURRENT_PAGE | Active nav link |
|------|----------|-----------|--------------|-----------------|
| index.html | `#contact` | Оставить заявку | index | logo only |
| online-consultations.html | `#consultation-form` | Оставить заявку | online | header + mobile: Консультации |
| treatment-abroad.html | `#form-abroad` | Оставить заявку | treatment | header + mobile: Лечение за рубежом |
| checkup.html | `#form-checkup` | Подобрать программу | checkup | header + mobile: Чек-ап |
| contacts.html | `#contact-section` | Оставить заявку | contacts | header + mobile: Контакты |
| 404.html | `contacts.html` | Оставить заявку | 404 | none |

### Adding a new token

To add a new token:

1. Extend the splicer's `BUILD:vars` parser (or the derivation block) in `scripts/build-pages.sh`.
2. Add a new `sed` substitution line to the per-partial expansion loop.
3. Update this table and the per-page `BUILD:vars` blocks as needed.

**Constraint — token values must not contain `|`.** The splicer uses `|` as its `sed` delimiter. The `assert_no_pipe` guard in `scripts/build-pages.sh` rejects any token value that contains a literal pipe character with:

```
[build-pages] FATAL: token value contains pipe character; splicer uses | as sed delimiter
```

If a Tailwind arbitrary-value class needs a `|` (e.g. `grid-cols-[1fr|2fr]`), either update the splicer to use a different delimiter or escape the value before substitution.

**Constraint — BUILD:vars metadata must not contain shell metacharacters.** The splicer uses `eval` to assign token values from the `BUILD:vars` line; a defense-in-depth pre-filter rejects `$`, backtick, `;`, `&`, `<`, `>`, and `\` with:

```
[build-pages] FATAL: BUILD:vars metadata in {FILE} contains shell metacharacter
```

This guards against supply-chain injection even though `BUILD:vars` is repo-tracked content.

## Adding a 7th page (the 0-edit invariant — LAYOUT-11)

A new page that participates in the partials system requires only body content + BUILD markers. Zero chrome HTML is copy-pasted.

**Step 1** — Create the new page skeleton (e.g. `about.html`):

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About — MedicusUnion</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-mu-bg text-mu-text-900">
<!-- BUILD:vars CTA_HREF=#contact-section CTA_LABEL="Оставить заявку" CURRENT_PAGE=contacts -->

<!-- BUILD:header -->
<!-- /BUILD:header -->

<!-- BUILD:mobile-menu -->
<!-- /BUILD:mobile-menu -->

<main>
  <h1>About</h1>
  <!-- ...your page-specific content... -->
</main>

<!-- BUILD:footer -->
<!-- /BUILD:footer -->

<!-- BUILD:sticky-bar -->
<!-- /BUILD:sticky-bar -->

<script defer src="js/main.js"></script>
</body>
</html>
```

Note: the marker blocks are empty. `make build` fills them in.

**Step 2** — Append the new page to the canonical `PAGES` list in the `Makefile`:

```make
PAGES := index.html online-consultations.html treatment-abroad.html checkup.html contacts.html 404.html about.html
```

**Step 3** — Run `make build`. The splicer inserts the chrome into every marker block.

**Step 4** — Commit the new page. The pre-commit hook will run `make build` again and verify byte-identity before letting the commit through.

If the new page needs a unique `CURRENT_PAGE` value (e.g. `about` for a dedicated "About" nav slot), extend the splicer's `case "$CURRENT_PAGE"` block in `scripts/build-pages.sh` to map the new value to its corresponding active nav slot.

### Page-list fallback hierarchy

Two mechanisms define the list of HTML pages the splicer processes, and they serve two different invocation paths:

1. **`$(PAGES)` in the Makefile** — the canonical source of truth. `make build` passes `$(PAGES)` as positional arguments to `./scripts/build-pages.sh`, so every `make build` run explicitly enumerates the 6 pages.
2. **`DEFAULT_PAGES` in `scripts/build-pages.sh`** — a fallback used only when the splicer is invoked directly with no arguments (e.g. `./scripts/build-pages.sh` during ad-hoc debugging).

When you add a new page, update `$(PAGES)` in the Makefile first. Updating `DEFAULT_PAGES` in the splicer is optional but recommended for direct-invocation parity.

## Pre-commit hook behavior

Once `make install-hooks` has been run, every `git commit` in the repo triggers the following sequence:

1. The hook runs `make build`.
2. If the build fails (syntax error, missing partial, malformed `BUILD:vars`), the hook exits non-zero and the commit is blocked. Fix the build error and re-commit.
3. If the build succeeds, the hook runs `git diff --quiet -- '*.html'`.
4. If the diff is empty, the hook exits 0 and the commit proceeds normally.
5. If the diff is non-empty, the hook prints a `BLOCKED` message listing the regenerated pages with instructions on how to stage them, then exits 1. The commit is blocked.

**The hook does not auto-stage regenerated files.** This is deliberate. Auto-staging would hide chrome drift from the contributor — you would not notice that your partial edit actually required propagation to the pages. Explicit re-staging forces the contributor to see the change footprint before it lands.

To unblock a commit that was blocked by drift: run `git add` on the listed HTML files and re-run your commit command.

**Bypass (escape hatch):** `git commit --no-verify` skips all hooks, including this one. Use it only for known-safe doc-only commits or when you understand what you are bypassing.

## Troubleshooting

- **`tailwindcss: command not found`** — run `make install-tailwind`. The binary is gitignored (~73MB), so it is not tracked in the repo.
- **Byte-identity gate fails after a fresh `make build`** — investigate why the splicer is producing different output than what is committed. Check `partials/*.html` and each page's `BUILD:vars` line. Run `./scripts/build-pages.sh` directly for more verbose output.
- **Pre-commit hook is not firing** — run `make install-hooks`. The symlink in `.git/hooks/` is contributor-local and not tracked in git; every new clone needs its own `make install-hooks` invocation. You can confirm the symlink with `ls -la "$(git rev-parse --git-common-dir)/hooks/pre-commit"`.
- **`unknown CURRENT_PAGE` error** — the splicer's `case "$CURRENT_PAGE"` block only recognizes `index`, `online`, `treatment`, `checkup`, `contacts`, and `404`. If you need a new value, extend the case statement in `scripts/build-pages.sh`.
- **`install-tailwind: unsupported platform`** — the Makefile supports Darwin and Linux on `arm64`, `aarch64`, and `x86_64`. Windows and other platforms require manually placing the `tailwindcss` binary at repo root.

## Follow-ups

- **SHA256 verification of the tailwindcss download** — Tailwind publishes SHA256 checksums with every release. A follow-up can extend `install-tailwind` to verify the downloaded binary against the published checksum. Tracked as a v3.3+ enhancement, not required for v3.2.
- **CI byte-identity gate** — `make check` is suitable for CI. When CI is added in a later milestone, a single `make check` call in the pipeline enforces the same invariant that the pre-commit hook enforces locally.
