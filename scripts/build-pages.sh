#!/bin/sh
# scripts/build-pages.sh
# Phase 39 / LAYOUT-02
# Marker-based shell splicer for chrome partials.
# Reads <!-- BUILD:vars KEY=VALUE ... --> blocks and <!-- BUILD:partial -->...<!-- /BUILD:partial -->
# blocks in HTML pages and replaces partial-block contents with substituted partials/*.html content.
# POSIX sh + awk + sed only. No bash, no Node.
set -eu

# Default page list used when no positional args are provided.
DEFAULT_PAGES="index.html online-consultations.html treatment-abroad.html checkup.html contacts.html 404.html styleguide.html"

# Required partials. All five must exist or the build aborts.
# Supported marker vocabulary (one opening + one closing marker per partial per page):
#   <!-- BUILD:header -->       ... <!-- /BUILD:header -->
#   <!-- BUILD:footer -->       ... <!-- /BUILD:footer -->
#   <!-- BUILD:sticky-bar -->   ... <!-- /BUILD:sticky-bar -->
#   <!-- BUILD:mobile-menu -->  ... <!-- /BUILD:mobile-menu -->
#   <!-- BUILD:svg-defs -->     ... <!-- /BUILD:svg-defs -->
PARTIALS="header footer sticky-bar mobile-menu svg-defs"

# Defense-in-depth (W4): token values must not contain | because the splicer uses
# | as the sed delimiter. Any future drift that introduces a pipe character in a
# token value is caught with a clear FATAL rather than silent corruption.
assert_no_pipe() {
  _name="$1"
  _value="$2"
  case "$_value" in
    *'|'*)
      echo "[build-pages] FATAL: token value contains pipe character; splicer uses | as sed delimiter" >&2
      echo "[build-pages]   Token: $_name = $_value" >&2
      exit 1
      ;;
  esac
}

# Verify all partials exist before processing any page.
for _p in $PARTIALS; do
  if [ ! -f "partials/$_p.html" ]; then
    echo "[build-pages] FATAL: missing partials/$_p.html" >&2
    exit 1
  fi
done

# Determine the file list: positional args take precedence, otherwise DEFAULT_PAGES.
if [ "$#" -gt 0 ]; then
  FILES="$*"
else
  FILES="$DEFAULT_PAGES"
fi

PAGE_COUNT=0
for FILE in $FILES; do
  if [ ! -f "$FILE" ]; then
    echo "[build-pages] FATAL: $FILE does not exist" >&2
    exit 1
  fi

  # -- Step 1: Validate the page has exactly one BUILD:vars block --
  VARS_COUNT=$(grep -c '^<!-- BUILD:vars ' "$FILE" || true)
  if [ "$VARS_COUNT" != "1" ]; then
    echo "[build-pages] FATAL: $FILE has $VARS_COUNT BUILD:vars blocks (expected 1)" >&2
    exit 1
  fi

  # -- Step 2: Parse BUILD:vars to extract CTA_HREF, CTA_LABEL, CURRENT_PAGE --
  VARS_LINE=$(grep '^<!-- BUILD:vars ' "$FILE" | head -1)
  VARS_BODY=$(echo "$VARS_LINE" | sed 's|^<!-- BUILD:vars ||; s| -->$||')

  # Defense-in-depth (W3): reject shell metacharacters in BUILD:vars before eval.
  # Even though BUILD:vars comes from repo-tracked HTML files (no network input),
  # supply-chain vulnerabilities or accidental edits could introduce hostile metadata.
  # The seven rejected characters are the canonical shell injection surface.
  # `|` is NOT rejected here (the W4 pipe-guard applies to token VALUES only).
  # `"` is NOT rejected because legitimate values like CTA_LABEL="Оставить заявку" use quotes.
  case "$VARS_BODY" in
    *'$'*|*'`'*|*';'*|*'&'*|*'<'*|*'>'*|*'\'*)
      echo "[build-pages] FATAL: BUILD:vars metadata in $FILE contains shell metacharacter" >&2
      exit 1
      ;;
  esac

  # Clear any previously set values so a missing key is detected (guards set -u too).
  CTA_HREF=""
  CTA_LABEL=""
  CURRENT_PAGE=""

  # eval is safe here because:
  #   (a) BUILD:vars comes exclusively from repo-tracked HTML files (no network),
  #   (b) the metacharacter pre-filter above rejects shell injection attempts
  #       ($, backtick, ;, &, <, >, backslash), and
  #   (c) BUILD:vars is already in valid shell KEY=VALUE syntax — the canonical
  #       form is: CTA_HREF=#contact CTA_LABEL="Оставить заявку" CURRENT_PAGE=index
  #
  # We additionally sanity-check that every token on VARS_BODY is a KEY=VALUE
  # assignment (matches [A-Z_]+=) to reject any stray words before eval.
  for _assignment in $VARS_BODY; do
    case "$_assignment" in
      [A-Z_]*=*) ;;
      *)
        # This can happen inside a quoted value (e.g. the second word of
        # CTA_LABEL="Оставить заявку" is `заявку"` after shell word-split).
        # Such fragments are safe to ignore because the overall line is evaled
        # as one piece below, and the metacharacter guard already rejected the
        # injection surface. The check exists to catch malformed KEY=VALUE
        # sequences where no quoted context is present.
        case "$_assignment" in
          *'"'*) ;;
          *)
            echo "[build-pages] FATAL: $FILE BUILD:vars has malformed token: $_assignment" >&2
            exit 1
            ;;
        esac
        ;;
    esac
  done
  eval "$VARS_BODY"

  if [ -z "$CTA_HREF" ] || [ -z "$CTA_LABEL" ] || [ -z "$CURRENT_PAGE" ]; then
    echo "[build-pages] FATAL: $FILE BUILD:vars missing required key (CTA_HREF/CTA_LABEL/CURRENT_PAGE)" >&2
    exit 1
  fi

  # -- Step 3: Compute derived tokens from CURRENT_PAGE --
  LOGO_ARIA_CURRENT=""
  if [ "$CURRENT_PAGE" = "index" ]; then
    LOGO_ARIA_CURRENT=' aria-current="page"'
  fi

  INACTIVE_HEADER='class="text-mu-text-700 hover:text-mu-blue-text transition-colors font-medium tracking-tight"'
  ACTIVE_HEADER='aria-current="page" class="text-mu-blue-text font-medium tracking-tight"'

  INACTIVE_MOBILE='class="mobile-menu__link text-mu-text-900 hover:bg-white/40 squircle-lg px-4 py-3 transition-colors font-medium tracking-tight"'
  ACTIVE_MOBILE='aria-current="page" class="mobile-menu__link text-mu-blue-text bg-mu-blue/5 squircle-lg px-4 py-3 font-medium tracking-tight"'

  NAV_HEADER_online="$INACTIVE_HEADER"
  NAV_HEADER_treatment="$INACTIVE_HEADER"
  NAV_HEADER_checkup="$INACTIVE_HEADER"
  NAV_HEADER_contacts="$INACTIVE_HEADER"

  NAV_MOBILE_online="$INACTIVE_MOBILE"
  NAV_MOBILE_treatment="$INACTIVE_MOBILE"
  NAV_MOBILE_checkup="$INACTIVE_MOBILE"
  NAV_MOBILE_contacts="$INACTIVE_MOBILE"

  case "$CURRENT_PAGE" in
    online)
      NAV_HEADER_online="$ACTIVE_HEADER"
      NAV_MOBILE_online="$ACTIVE_MOBILE"
      ;;
    treatment)
      NAV_HEADER_treatment="$ACTIVE_HEADER"
      NAV_MOBILE_treatment="$ACTIVE_MOBILE"
      ;;
    checkup)
      NAV_HEADER_checkup="$ACTIVE_HEADER"
      NAV_MOBILE_checkup="$ACTIVE_MOBILE"
      ;;
    contacts)
      NAV_HEADER_contacts="$ACTIVE_HEADER"
      NAV_MOBILE_contacts="$ACTIVE_MOBILE"
      ;;
    index|404|styleguide)
      # no nav link is current: index uses logo aria-current, 404/styleguide have no nav presence
      ;;
    *)
      echo "[build-pages] FATAL: $FILE has unknown CURRENT_PAGE=$CURRENT_PAGE" >&2
      exit 1
      ;;
  esac

  # -- W4 guard: assert no pipe character in any token value before sed substitution --
  assert_no_pipe CTA_HREF "$CTA_HREF"
  assert_no_pipe CTA_LABEL "$CTA_LABEL"
  assert_no_pipe LOGO_ARIA_CURRENT "$LOGO_ARIA_CURRENT"
  assert_no_pipe NAV_HEADER_online "$NAV_HEADER_online"
  assert_no_pipe NAV_HEADER_treatment "$NAV_HEADER_treatment"
  assert_no_pipe NAV_HEADER_checkup "$NAV_HEADER_checkup"
  assert_no_pipe NAV_HEADER_contacts "$NAV_HEADER_contacts"
  assert_no_pipe NAV_MOBILE_online "$NAV_MOBILE_online"
  assert_no_pipe NAV_MOBILE_treatment "$NAV_MOBILE_treatment"
  assert_no_pipe NAV_MOBILE_checkup "$NAV_MOBILE_checkup"
  assert_no_pipe NAV_MOBILE_contacts "$NAV_MOBILE_contacts"

  # -- Step 4+5: For each partial, substitute tokens and splice into the page --
  for NAME in $PARTIALS; do
    # Validate that both opening and closing markers exist for this partial
    OPEN_COUNT=$(grep -c "^<!-- BUILD:$NAME -->" "$FILE" || true)
    CLOSE_COUNT=$(grep -c "^<!-- /BUILD:$NAME -->" "$FILE" || true)
    if [ "$OPEN_COUNT" != "1" ] || [ "$CLOSE_COUNT" != "1" ]; then
      echo "[build-pages] FATAL: $FILE has $OPEN_COUNT opening and $CLOSE_COUNT closing markers for BUILD:$NAME (expected 1 each)" >&2
      exit 1
    fi

    EXPANDED=$(mktemp)
    # Substitute all 11 tokens. sed delimiter is | (token values never contain |,
    # guarded by assert_no_pipe above). Footer has no tokens so substitution is a no-op.
    sed \
      -e "s|{{CTA_HREF}}|$CTA_HREF|g" \
      -e "s|{{CTA_LABEL}}|$CTA_LABEL|g" \
      -e "s|{{LOGO_ARIA_CURRENT}}|$LOGO_ARIA_CURRENT|g" \
      -e "s|{{NAV_HEADER_online}}|$NAV_HEADER_online|g" \
      -e "s|{{NAV_HEADER_treatment}}|$NAV_HEADER_treatment|g" \
      -e "s|{{NAV_HEADER_checkup}}|$NAV_HEADER_checkup|g" \
      -e "s|{{NAV_HEADER_contacts}}|$NAV_HEADER_contacts|g" \
      -e "s|{{NAV_MOBILE_online}}|$NAV_MOBILE_online|g" \
      -e "s|{{NAV_MOBILE_treatment}}|$NAV_MOBILE_treatment|g" \
      -e "s|{{NAV_MOBILE_checkup}}|$NAV_MOBILE_checkup|g" \
      -e "s|{{NAV_MOBILE_contacts}}|$NAV_MOBILE_contacts|g" \
      "partials/$NAME.html" > "$EXPANDED"

    # Splice the expanded partial into the page: awk state machine that replaces
    # everything between <!-- BUILD:$NAME --> and <!-- /BUILD:$NAME --> marker lines.
    # Marker lines must be at column 0 with no leading whitespace.
    awk -v partial="$NAME" -v expanded_file="$EXPANDED" '
      BEGIN {
        n = 0
        while ((getline line < expanded_file) > 0) {
          expanded[++n] = line
        }
        close(expanded_file)
        in_block = 0
      }
      {
        if ($0 == "<!-- BUILD:" partial " -->") {
          print
          for (i = 1; i <= n; i++) print expanded[i]
          in_block = 1
          next
        }
        if ($0 == "<!-- /BUILD:" partial " -->") {
          print
          in_block = 0
          next
        }
        if (!in_block) print
      }
    ' "$FILE" > "$FILE.tmp"

    mv "$FILE.tmp" "$FILE"
    rm -f "$EXPANDED"
  done

  echo "[build-pages] $FILE updated (5 partials)"
  PAGE_COUNT=$((PAGE_COUNT + 1))
done

echo "[build-pages] done ($PAGE_COUNT pages processed)"
