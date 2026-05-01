# Phase 94 Plan 02 — Deletion Audit

**Date:** 2026-05-01
**Target:** `next/src/components/sections/contacts/{ContactsHero,ContactMethodGrid,CoordinatorCard,TrustBadges}.tsx`

## Pre-deletion grep evidence

### 1. Symbol grep across `next/src/`

```
$ grep -rnE '\b(ContactsHero|ContactMethodGrid|CoordinatorCard|TrustBadges)\b' next/src/
next/src/components/sections/contacts/ContactsHero.tsx:3:export function ContactsHero() {
next/src/components/sections/contacts/TrustBadges.tsx:8:export function TrustBadges() {
next/src/components/sections/contacts/CoordinatorCard.tsx:3:export function CoordinatorCard() {
next/src/components/sections/contacts/ContactMethodGrid.tsx:5:export function ContactMethodGrid() {
```

Only matches are the `export function` declarations inside the doomed files themselves. **0 external references.**

### 2. Path-import grep

```
$ grep -rnE "from ['\"](@/components/sections/contacts|\.\./components/sections/contacts)" next/src/
(no output)
```

**0 imports of `@/components/sections/contacts` or `../components/sections/contacts` anywhere in `next/src/`.**

### 3. Files about to be deleted

```
$ ls -la next/src/components/sections/contacts/
total 32
drwxr-xr-x   6 mikhail  staff   192 May  1 09:03 .
drwxr-xr-x  22 mikhail  staff   704 May  1 09:03 ..
-rw-r--r--   1 mikhail  staff  1919 May  1 09:03 ContactMethodGrid.tsx
-rw-r--r--   1 mikhail  staff  1115 May  1 09:03 ContactsHero.tsx
-rw-r--r--   1 mikhail  staff   953 May  1 09:03 CoordinatorCard.tsx
-rw-r--r--   1 mikhail  staff   998 May  1 09:03 TrustBadges.tsx
```

## Disposition table

| File | Disposition | References found (outside file itself) |
|------|-------------|------------------------------------------|
| `next/src/components/sections/contacts/ContactsHero.tsx` | DELETE | References found: 0 |
| `next/src/components/sections/contacts/ContactMethodGrid.tsx` | DELETE | References found: 0 |
| `next/src/components/sections/contacts/CoordinatorCard.tsx` | DELETE | References found: 0 |
| `next/src/components/sections/contacts/TrustBadges.tsx` | DELETE | References found: 0 |

## Build status (pre-deletion baseline)

```
Route (app)                                 Size  First Load JS
┌ ○ /                                     4.8 kB         131 kB
├ ○ /_not-found                            995 B         103 kB
├ ƒ /admin                               4.04 kB         114 kB
├ ƒ /api/health                            121 B         102 kB
├ ○ /checkup                               130 B         126 kB
├ ○ /consultations                         131 B         126 kB
├ ○ /contacts                            2.98 kB         121 kB
├ ○ /test-glass                            662 B         103 kB
└ ○ /treatment-abroad                      131 B         126 kB
+ First Load JS shared by all             102 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

Build passes pre-deletion. No errors. The 4 doomed files are excluded from the build graph already (they're unreferenced) — so the post-deletion build size should be unchanged.

## Conclusion

Audit confirms 0 external references to all 4 component symbols. Proceed to Task 2 (deletion).
