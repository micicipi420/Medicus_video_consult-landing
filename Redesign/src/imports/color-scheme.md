# Color scheme

---

## Primary colors

| Color | Hex | Usage |
|-------|-----|-------|
| Blue | `#38C6F4` | Primary brand accent, CTA buttons, links |
| White | `#FFFFFF` | Backgrounds, card surfaces |
| Black | `#010101` | Headings, primary text on light backgrounds |

---

## Secondary colors — green ramp

| Stop | Hex | Usage |
|------|-----|-------|
| 900 | `#35B678` | Active states, icons on light bg |
| 700 | `#4BCA8C` | Hover states, secondary buttons |
| 500 | `#6FDEA9` | Illustrations, decorative accents |
| 400 | `#79E9B3` | Tags, badges |
| 300 | `#A6EECB` | Light fills, progress bars |
| 100 | `#D3F8E4` | Card backgrounds, subtle highlights |
| 50 | `#E4FAEF` | Section backgrounds, success alerts bg |

---

## Text colors — neutral ramp

| Stop | Hex | Usage |
|------|-----|-------|
| 900 | `#1B212C` | Headings, primary body text |
| 700 | `#63687A` | Secondary text, captions |
| 500 | `#A4A8B5` | Placeholder text, icons |
| 300 | `#C6C9D1` | Disabled text |
| 200 | `#D8DDE2` | Borders, dividers |
| 100 | `#F5F6F8` | Input backgrounds, subtle surfaces |
| 50 | `#FBFBFB` | Page background, disabled fills |

---

## Element / UI colors

| Name | Hex | Pair bg | Usage |
|------|-----|---------|-------|
| Info | `#4F84E8` | — | Links, informational badges, focus rings |
| Danger | `#F50057` | `#FFF0F5` | Errors, destructive actions, validation |
| Warning | `#FFA25C` | `#FFF5ED` | Warnings, pending states |
| Teal | `#78C3BF` | `#EBFAF9` | Success, confirmations, positive states |

---

## Contrast pairings

| Foreground | Background | Ratio | Use case |
|------------|------------|-------|----------|
| `#FFFFFF` | `#010101` | 21:1 | Inverted / dark sections |
| `#010101` | `#38C6F4` | ~11:1 | Primary CTA buttons, banners |
| `#1B212C` | `#E4FAEF` | ~14:1 | Success cards, green alerts |
| `#1B212C` | `#F5F6F8` | ~15:1 | Neutral surfaces, secondary cards |
| `#F50057` | `#FFF0F5` | ~6:1 | Error badges, danger alerts |
| `#63687A` | `#FFFFFF` | ~5.5:1 | Secondary body text |

---

## Accessibility notes

- `#38C6F4` on `#FFFFFF` has a contrast ratio of ~2.8:1 — fails WCAG AA for small text. Use `#4F84E8` for text links on white or darken to ~`#1A9FD4`.
- All text-ramp stops 900–500 pass AA on white backgrounds.
- Danger `#F50057` on white passes AA for large text (3.1:1) but not for small — pair with `#FFF0F5` background or use on dark surfaces.
- Warning `#FFA25C` on white fails AA — use only for icons/decorative elements or pair with dark text on `#FFF5ED`.
