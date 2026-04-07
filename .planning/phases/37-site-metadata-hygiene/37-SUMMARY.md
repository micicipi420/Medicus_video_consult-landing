---
phase: 37
plan: 1
subsystem: seo-hygiene
tags: [sitemap, robots, canonical, meta-description, circle-flags, 404]
dependency_graph:
  requires: []
  provides: [sitemap.xml, robots.txt, img/flags/]
  affects: [index.html, online-consultations.html, treatment-abroad.html, checkup.html, 404.html]
tech_stack:
  added: [circle-flags (MIT, vendored SVGs)]
  patterns: [git-derived lastmod, extension-less canonical URLs]
key_files:
  created: [sitemap.xml, robots.txt, img/flags/at.svg, img/flags/de.svg, img/flags/fr.svg, img/flags/ch.svg, img/flags/it.svg, img/flags/es.svg, img/flags/il.svg, img/flags/ae.svg, img/flags/kr.svg, img/flags/tr.svg, .planning/phases/37-site-metadata-hygiene/37-SUMMARY.md]
  modified: [404.html, index.html, online-consultations.html, treatment-abroad.html, checkup.html]
decisions:
  - Vendored 10 circle-flags instead of plan's 7 — page has ae/kr/tr not in plan spec; all three fetched while curl was already running
  - contacts.html meta (118 chars) left unchanged — under 150 is acceptable, no SEO risk for a contacts page with a phone CTA
  - 404.html meta (69 chars) left unchanged — page is noindex/nofollow; short description has no SERP impact
metrics:
  duration: ~25min
  completed: 2026-04-07
  tasks_completed: 7
  files_changed: 16
---

# Phase 37: Site Metadata & Hygiene — Summary

One-liner: sitemap.xml + robots.txt created, canonical audit clean, 404.html upgraded, 4 over-length meta descriptions trimmed to 150-158 chars, circle-flags circle SVGs vendored for 10 countries replacing hand-drawn rectangular approximations.

---

## Tasks Completed

| # | REQ-ID | Description | Commit | Status |
|---|--------|-------------|--------|--------|
| 1 | META-01 | sitemap.xml — 5 production URLs, git lastmod | 6c0b9ea | done |
| 2 | META-02 | robots.txt — Yandex-safe, sitemap reference | 0793b8b | done |
| 3 | META-03 | Canonical URL audit — 0 drift found | (verify only) | done |
| 4 | META-04 | 404.html H1 text-3xl → text-5xl md:text-6xl lg:text-7xl | 7d18618 | done |
| 5 | META-05 | 404.html body copy rewritten | 7d18618 | done |
| 6 | META-06 | Meta description audit across 6 pages | f024101 | done |
| 7 | META-07 | circle-flags vendored, country cards updated | 42c6747 | done |

---

## sitemap.xml

5 production URLs, extension-less format matching existing canonical tags:

```
https://medicusunion.kz/                  lastmod: 2026-04-07
https://medicusunion.kz/online-consultations  lastmod: 2026-04-07
https://medicusunion.kz/treatment-abroad   lastmod: 2026-04-07
https://medicusunion.kz/checkup            lastmod: 2026-04-07
https://medicusunion.kz/contacts           lastmod: 2026-04-07
```

No `<changefreq>`, no `<priority>` (per plan — Google ignores both).
404.html excluded.

---

## robots.txt

```
User-agent: *
Allow: /
Disallow: /.planning/
Disallow: /Redesign/
Disallow: /scripts/
Disallow: /src/
Sitemap: https://medicusunion.kz/sitemap.xml
```

Yandex-safe verification: `grep -E 'Disallow:.*(css|js|img)' robots.txt` → 0 matches.

---

## META-03: Canonical Audit

`grep -h 'rel="canonical"' *.html | grep -o 'href="[^"]*"' | sort -u` output:

```
href="https://medicusunion.kz"
href="https://medicusunion.kz/checkup"
href="https://medicusunion.kz/contacts"
href="https://medicusunion.kz/online-consultations"
href="https://medicusunion.kz/treatment-abroad"
```

5 unique extension-less URLs. Zero drift. No changes needed.

---

## META-06: Meta Description Before/After

| Page | Before | After | Notes |
|------|--------|-------|-------|
| index.html | 211 chars | 153 chars | Trimmed Samsung/Istanbul detail, kept "43 клиники, 11 стран" |
| online-consultations.html | 167 chars | 158 chars | Added specialty keywords (Онкология, кардиология, ЭКО) |
| treatment-abroad.html | 247 chars | 154 chars | Major trim; kept 15+ лет, 10 000+ пациентов social proof |
| checkup.html | 177 chars | 150 chars | Tightened; kept price anchor $350 and app result mention |
| contacts.html | 118 chars | 118 chars | Acceptable — no change |
| 404.html | 69 chars | 69 chars | noindex/nofollow — no SERP impact; no change |

All modified pages: 150-158 chars, unique, keyword-inclusive.

---

## META-07: circle-flags

Downloaded from `HatScripts/circle-flags` (MIT license) via `curl`:

| File | Size | Country | Used on page |
|------|------|---------|-------------|
| img/flags/de.svg | 334B | Германия | yes |
| img/flags/il.svg | 708B | Израиль | yes |
| img/flags/ch.svg | 301B | Швейцария | yes |
| img/flags/at.svg | 306B | Австрия | yes |
| img/flags/ae.svg | 404B | ОАЭ | yes |
| img/flags/kr.svg | 933B | Южная Корея | yes |
| img/flags/tr.svg | 390B | Турция | yes |
| img/flags/fr.svg | 340B | Франция | vendored, not on page yet |
| img/flags/it.svg | 340B | Италия | vendored, not on page yet |
| img/flags/es.svg | 2000B | Испания | vendored, not on page yet |

Total: 6,056 bytes (well under 14KB budget).

All flags rendered as `<img width="40" height="40" class="rounded-full">` — 40px satisfies the ≥32px mobile minimum. Replaced hand-crafted rectangular 48x32 SVG approximations.

---

## Deviations from Plan

**1. [Rule 2 - Extension] Fetched ae/kr/tr beyond plan's 7-country spec**
- Found during: Task 6
- Issue: Page has ОАЭ, Южная Корея, Турция — not in plan's `at, de, fr, ch, it, es, il` list
- Fix: Fetched 3 additional flags in the same curl loop; total 10 SVGs, still 6KB total
- Files modified: img/flags/ae.svg, img/flags/kr.svg, img/flags/tr.svg

**2. contacts.html meta description (118 chars) — left unchanged**
- Under 150 but acceptable; contacts page goal is CTA conversion not SERP ranking
- No keyword gap; phone number in description aids click-through

**3. 404.html meta description (69 chars) — left unchanged**
- Page is `noindex, nofollow`; description has no SERP exposure; extending would be dead weight

---

## Known Stubs

None. All deliverables are wired and functional.

---

## Threat Flags

None. No new network endpoints, auth paths, or trust boundary changes.

---

## Self-Check

- [x] sitemap.xml exists at repo root
- [x] robots.txt exists at repo root
- [x] img/flags/ contains 10 SVGs
- [x] 404.html H1 class updated
- [x] 4 meta descriptions trimmed
- [x] All 5 commits exist in git log
