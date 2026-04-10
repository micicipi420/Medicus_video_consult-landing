# v5.0 Full Liquid Glass Rework — Requirements

**Milestone:** v5.0
**Created:** 2026-04-10
**Status:** Active

## Cross-Browser & Fixes

- [ ] **XBRO-01**: Safari получает рабочий backdrop-filter через hardcoded fallback values перед var()-based декларациями
- [ ] **XBRO-02**: Firefox корректно отображает glass элементы с opacity-fallback вместо backdrop-filter при отсутствии поддержки SVG filters
- [ ] **XBRO-03**: Shadow-wrap pattern (.liquid-card-wrap) имеет единую документированную стратегию — deprecated comments согласованы с фактическим использованием

## Glass Material Variants

- [ ] **GLAS-01**: Clear glass variant (.liquid-clear) с повышенной прозрачностью и dimming layer для overlay-контекстов
- [ ] **GLAS-02**: Fluted glass variant (.liquid-fluted) с вертикальными streak-полосами через repeating-linear-gradient
- [ ] **GLAS-03**: Glass hierarchy формализована в 3 уровня: navigation (.liquid-nav), regular (.liquid-regular), clear (.liquid-clear) с различными blur/opacity/shadow параметрами

## Visual Effects

- [ ] **VFEX-01**: Adaptive tinting — glass элементы наследуют --liquid-tint-* цвет из parent section через CSS cascade (background-gradient composite, не mix-blend-mode)
- [ ] **VFEX-02**: Desktop parallax specular — курсор за пределами карточки создаёт мягкий shift specular highlight через CSS custom properties
- [ ] **VFEX-03**: Interaction states на glass — hover brightens, press darkens, focus показывает ring на всех glass-элементах с плавными transitions

## Performance

- [ ] **PERF-01**: Composite layer audit — не более 6 glass элементов с backdrop-filter одновременно в одном viewport
- [ ] **PERF-02**: will-change используется только на анимируемых glass элементах, убран со статических
- [ ] **PERF-03**: SVG refraction filter калиброван per-element (scale, baseFrequency) для баланса visual fidelity и GPU load

## Cleanup

- [ ] **CLEN-01**: Удалены все неиспользуемые CSS tokens (shadcn/React legacy: popover, chart, sidebar families — ~80 строк)
- [ ] **CLEN-02**: .liquid-card-wrap wrapper divs удалены из HTML (70+ элементов), CSS no-op класс удалён
- [ ] **CLEN-03**: Dead файлы удалены: src/styles/index.css, unused green ramp tokens (--mu-green-200, -400, -900)

## Documentation

- [ ] **DOCS-01**: Styleguide page обновлён со всеми glass variants, usage guidelines, do/don't примерами
- [ ] **DOCS-02**: Print stylesheet покрывает все новые glass variants (fluted, clear, nav) с opaque fallback

## Future Requirements

_None deferred — all features scoped to v5.0._

## Out of Scope

- WebGL/Three.js refraction — violates vanilla JS constraint, too heavy for medical landing
- Gyroscope specular on mobile — iOS permission dialog hostile for 45+ audience
- Spring physics animations — contradicts calm medical tone
- Real-time adaptive tinting via canvas capture — too heavy, mix-blend-mode sufficient approximation
- npm runtime dependencies — keep zero-dependency vanilla stack

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| XBRO-01 | Phase 51 | Pending |
| XBRO-02 | Phase 51 | Pending |
| XBRO-03 | Phase 51 | Pending |
| CLEN-01 | Phase 52 | Pending |
| CLEN-02 | Phase 52 | Pending |
| CLEN-03 | Phase 52 | Pending |
| PERF-03 | Phase 53 | Pending |
| VFEX-01 | Phase 54 | Pending |
| GLAS-01 | Phase 55 | Pending |
| GLAS-02 | Phase 55 | Pending |
| GLAS-03 | Phase 55 | Pending |
| VFEX-02 | Phase 56 | Pending |
| VFEX-03 | Phase 56 | Pending |
| PERF-01 | Phase 57 | Pending |
| PERF-02 | Phase 57 | Pending |
| DOCS-01 | Phase 58 | Pending |
| DOCS-02 | Phase 58 | Pending |
