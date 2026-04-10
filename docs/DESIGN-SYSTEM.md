# Liquid Design System v4.0

## 1. Overview

Liquid Design System v4.0 -- визуальный язык лендинга MedicusUnion KZ (medicusunion.kz). Система объединяет squircle-формы (суперэллиптические скругления), liquid glass-материалы (стеклянные поверхности с backdrop-filter) и&nbsp;токенизированную тему с&nbsp;автоматическим тёмным режимом. Целевая аудитория -- жители Казахстана 45+, поэтому приоритет отдаётся контрасту, читабельности и&nbsp;минимальному движению. Сайт состоит из&nbsp;5 страниц (index, online-consultations, treatment-abroad, checkup, contacts) плюс 404.

Стек: HTML + Tailwind CSS v4 (CLI standalone) + Vanilla JS. Без фреймворков, без Node.js в&nbsp;рантайме.

---

## 2. Token Scale

### 2.1 Grid Tokens

| Токен | Значение | Назначение |
|-------|----------|------------|
| `--container-content` | `1200px` | Максимальная ширина контента (Tailwind: `max-w-content`) |
| `--grid-gutter-mobile` | `16px` | Боковые отступы на мобильных (`gutter-mobile`) |
| `--grid-gutter-tablet` | `24px` | Боковые отступы на планшетах (`gutter-tablet`) |
| `--grid-gutter-desktop` | `32px` | Боковые отступы на десктопе (`gutter-desktop`) |

### 2.2 Squircle Tokens

| Токен | Назначение |
|-------|------------|
| `--squircle-mask-md` | SVG-маска суперэллипса (n=5) для `border-radius: 16px` |
| `--squircle-mask-lg` | SVG-маска суперэллипса (n=5) для `border-radius: 24px` |
| `--squircle-mask-xl` | SVG-маска суперэллипса (n=5) для `border-radius: 40px` |
| `--squircle-mask-full` | `none` -- при `border-radius: 9999px` маска не&nbsp;нужна (круг = squircle) |

Токены объявлены в `src/styles/theme.css` `:root {}`.

### 2.3 Liquid Glass Tokens (Light)

Светлый режим -- значения из `:root {}` в `src/styles/theme.css`:

| Токен | Значение | Назначение |
|-------|----------|------------|
| `--liquid-bg` | `rgba(255, 255, 255, 0.18)` | Полупрозрачный фон стекла |
| `--liquid-blur-sm` | `16px` | Малый blur для мелких элементов |
| `--liquid-blur-md` | `24px` | Базовый blur (карточки, кнопки) |
| `--liquid-blur-lg` | `40px` | Увеличенный blur (stats-glass) |
| `--liquid-blur-xl` | `60px` | Максимальный blur |
| `--liquid-saturate` | `180%` | Насыщенность за стеклом |
| `--liquid-brightness` | `108%` | Яркость за стеклом |
| `--liquid-border-top` | `rgba(255, 255, 255, 0.9)` | Верхняя грань-блик (rim light) |
| `--liquid-border-bottom` | `rgba(255, 255, 255, 0.35)` | Нижняя грань-тень |
| `--liquid-shadow-outer` | `0 16px 40px rgba(20, 30, 60, 0.12)` | Внешняя тень (для shadow-wrap) |
| `--liquid-shadow-inset-top` | `inset 0 1px 0 rgba(255, 255, 255, 0.8)` | Внутренний блик сверху |
| `--liquid-shadow-inset-bottom` | `inset 0 -1px 0 rgba(255, 255, 255, 0.15)` | Внутренняя тень снизу |

### 2.4 Liquid Glass Tokens (Dark)

Тёмный режим -- значения из `.dark {}` в `src/styles/theme.css`:

| Токен | Значение | Назначение |
|-------|----------|------------|
| `--liquid-bg` | `rgba(30, 40, 60, 0.45)` | Полупрозрачный тёмный фон |
| `--liquid-blur-sm` | `18px` | Малый blur (чуть больше, чем в light) |
| `--liquid-blur-md` | `28px` | Базовый blur |
| `--liquid-blur-lg` | `44px` | Увеличенный blur |
| `--liquid-blur-xl` | `64px` | Максимальный blur |
| `--liquid-saturate` | `160%` | Насыщенность (снижена для тёмного фона) |
| `--liquid-brightness` | `115%` | Яркость (увеличена для компенсации) |
| `--liquid-border-top` | `rgba(255, 255, 255, 0.25)` | Верхняя грань (приглушена) |
| `--liquid-border-bottom` | `rgba(0, 0, 0, 0.4)` | Нижняя грань (чёрная тень) |
| `--liquid-shadow-outer` | `0 16px 40px rgba(0, 0, 0, 0.45)` | Внешняя тень (глубже) |
| `--liquid-shadow-inset-top` | `inset 0 1px 0 rgba(255, 255, 255, 0.15)` | Внутренний блик (тусклый) |
| `--liquid-shadow-inset-bottom` | `inset 0 -1px 0 rgba(0, 0, 0, 0.3)` | Внутренняя тень (глубже) |

> Тёмный рецепт активируется автоматически через каскад `.dark {}` -- явных `.dark`-селекторов в компонентных CSS-файлах нет. Все классы наследуют тёмные значения через `var()`.

### 2.5 Motion Tokens

| Токен | Значение | Назначение |
|-------|----------|------------|
| `--ease-liquid` | `cubic-bezier(0.2, 0, 0, 1)` | Основной easing (Apple-like spring) |
| `--ease-liquid-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Easing для выхода анимации |
| `--dur-press` | `120ms` | Длительность нажатия (:active scale) |
| `--dur-hover` | `280ms` | Длительность hover-перехода |
| `--dur-sheet` | `400ms` | Длительность появления sheet/modal |
| `--dur-reveal` | `600ms` | Длительность scroll-reveal анимации |

---

## 3. Class Inventory

### 3.1 Squircle Classes

Объявлены в `src/styles/squircles.css`.

| Класс | border-radius | Маска | Применение |
|-------|--------------|-------|------------|
| `.squircle-md` | `16px` | `var(--squircle-mask-md)` | Кнопки, бейджи, чипы |
| `.squircle-lg` | `24px` | `var(--squircle-mask-lg)` | Карточки, формы |
| `.squircle-xl` | `40px` | `var(--squircle-mask-xl)` | Контейнеры секций, hero-блоки |
| `.squircle-full` | `9999px` | нет (маска не&nbsp;нужна) | Аватары, круглые иконки |

**Трёхуровневая прогрессивная деградация:**

1. **Tier 1** (Chrome 139+): `corner-shape: superellipse(2)` -- нативная GPU-ускоренная суперэллиптическая форма. Маска автоматически отключается через `@supports`.
2. **Tier 2** (Safari 17+, Firefox 120+, Chrome <139): `mask-image` с&nbsp;inline SVG data-URI -- продакшн-дефолт.
3. **Tier 3** (старые браузеры): обычный `border-radius` как фоллбэк.

**Печать:** маски снимаются (`mask-image: none !important`) через `@media print`, чтобы контент не&nbsp;обрезался.

### 3.2 Liquid Glass Classes

Объявлены в `src/styles/liquid-glass.css`.

| Класс | Назначение | Комбинировать с |
|-------|------------|-----------------|
| `.liquid-regular` | Базовый стеклянный материал | `.squircle-lg` или `.squircle-xl` |
| `.liquid-card` | Стекло + padding для карточных поверхностей | `.squircle-lg` или `.squircle-xl` |
| `.liquid-btn-primary` | Градиентная CTA-кнопка (НЕ стекло -- непрозрачная для ЦА 45+) | `.squircle-md` + `.shimmer-sweep` (для hero) |
| `.liquid-btn-secondary` | Стеклянная кнопка для вторичных действий | `.squircle-md` |
| `.stats-glass` | Стеклянный фон для группы статистик (blur-lg: 40px) | `.squircle-xl` |
| `.shimmer-sweep` | Shimmer-эффект при hover на hero CTA (максимум 1 на viewport) | `.liquid-btn-primary` |
| `.scroll-fade-top` | CSS mask-gradient fade сверху (80px) | Контейнеры с&nbsp;прокруткой |
| `.scroll-fade-bottom` | CSS mask-gradient fade снизу (80px) | Контейнеры с&nbsp;прокруткой |

**Refraction progressive enhancement:** Chrome 139+ получает дополнительный SVG-фильтр преломления через `html[data-refract="true"]` (JS probe устанавливает атрибут).

**Печать:** все стеклянные поверхности рендерятся как непрозрачный белый фон с&nbsp;`1px solid #ccc` рамкой. `backdrop-filter: none`, shimmer скрыт, fade-маски убраны.

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` -- blur снижается до&nbsp;8px, shimmer скрыт.

---

## 4. Card Pattern

`box-shadow` на glass-элементе обрезается `mask-image` по контуру squircle -- визуально приемлемо. Chrome 139+ с `corner-shape: squircle` убирает необходимость в mask-image полностью.

### Карточка

```html
<article class="squircle-lg liquid-card">
  <!-- card content -->
</article>
```

### Кнопка

```html
<div class="btn-shadow-wrap">
  <button class="squircle-md px-6 py-3 text-white">
    Submit
  </button>
</div>
```

### Когда обёртка не нужна

**Inset-тени безопасны внутри маски** (обёртка не&nbsp;нужна):

```html
<form class="squircle-xl">
  <!-- form fields -- inset shadows render inside the mask -->
</form>
```

**Элементы без тени** -- бейджи, чипы, пилюли:

```html
<span class="squircle-md bg-mu-green-50 px-3 py-1 text-sm">Badge</span>
```

---

## 5. Anti-Patterns

1. **NEVER** применять `box-shadow` И `mask-image` к&nbsp;одному элементу. Тень обрежется по&nbsp;контуру маски и&nbsp;будет выглядеть как две тонкие дуги вместо цельной тени. Используйте shadow-wrap.

2. **NEVER** применять `border` к&nbsp;squircle-элементу. Рамка обрезается маской. Используйте `box-shadow: inset 0 0 0 1px <color>` вместо border.

3. **NEVER** применять squircle к&nbsp;вращающимся элементам. `mask-image` искажается при `transform: rotate()`. Используйте обычный `border-radius`.

4. **NEVER** использовать `will-change: backdrop-filter` на статичных карточках. Расходует GPU-память без измеримой пользы для неанимированных элементов.

5. **NEVER** вкладывать glass внутрь glass. Двойной `backdrop-filter` удваивает blur и&nbsp;убивает читабельность.

6. **NEVER** использовать shimmer на не-hero элементах. Максимум 1 shimmer на viewport -- большее количество = визуальный шум для ЦА 45+.

7. **NEVER** использовать `border` на masked glass (squircle обрежет рамку). Используйте `inset box-shadow` (rim lighting токены уже это делают).

---

## 6. Russian Typography Rules

### 6.1 nbsp Binding

Все предлоги и&nbsp;союзы привязываются к&nbsp;следующему слову через `&nbsp;`, чтобы не&nbsp;оставаться одинокими в&nbsp;конце строки:

**Список предлогов для привязки:** в, на, с, к, у, о, за, по, из, до, от, при, для, без, про, не, ни, и, а, но.

Кроме того, пара "подлежащее + глагол" связывается через `&nbsp;`:

```html
<!-- Правильно -->
<p>Врач&nbsp;проведёт консультацию в&nbsp;удобное для&nbsp;вас время.</p>

<!-- Неправильно -->
<p>Врач проведёт консультацию в удобное для вас время.</p>
```

### 6.2 Orphan Prevention

Правило: первая строка перед переносом должна содержать минимум 2 слова И 10+ символов. Если условие не&nbsp;выполняется -- цепочкой `&nbsp;` сдвигаем перенос дальше.

```html
<!-- Плохо: "Мы" одно слово, 2 символа -->
<h2>Мы
помогаем пациентам</h2>

<!-- Хорошо: связали подлежащее с глаголом -->
<h2>Мы&nbsp;помогаем пациентам</h2>
```

### 6.3 whitespace-nowrap

Для составных единиц, которые не&nbsp;должны разрываться, используйте `<span class="whitespace-nowrap">`:

```html
<p>Результат готов <span class="whitespace-nowrap">за 1-2 дня</span></p>
<p>Стоимость <span class="whitespace-nowrap">от 450 EUR</span></p>
```

### 6.4 text-wrap: balance

**NEVER** использовать `text-wrap: balance`. Количество вхождений должно оставаться нулевым на всех страницах (миграционный гейт это проверяет).

---

## 7. Build Pipeline

### 7.1 Splicer (build-pages.sh)

`scripts/build-pages.sh` -- POSIX sh-скрипт, заменяющий содержимое маркерных блоков в HTML-страницах на подготовленные partials с&nbsp;подстановкой токенов.

**Блок `BUILD:vars`** (обязателен, ровно 1 на страницу):

```html
<!-- BUILD:vars CTA_HREF=#contact CTA_LABEL="Оставить заявку" CURRENT_PAGE=index -->
```

Определяет три обязательных переменных:
- `CTA_HREF` -- href для CTA-кнопки
- `CTA_LABEL` -- текст CTA-кнопки
- `CURRENT_PAGE` -- идентификатор текущей страницы

**5 маркеров для партиалов:**

| Маркер | Партиал | Содержит токены |
|--------|---------|-----------------|
| `<!-- BUILD:header -->` | `partials/header.html` | Да (`{{CTA_HREF}}`, `{{CTA_LABEL}}`, `{{LOGO_ARIA_CURRENT}}`, `{{NAV_HEADER_*}}`) |
| `<!-- BUILD:footer -->` | `partials/footer.html` | Нет |
| `<!-- BUILD:sticky-bar -->` | `partials/sticky-bar.html` | Да (`{{CTA_HREF}}`, `{{CTA_LABEL}}`) |
| `<!-- BUILD:mobile-menu -->` | `partials/mobile-menu.html` | Да (`{{CTA_HREF}}`, `{{CTA_LABEL}}`, `{{NAV_MOBILE_*}}`) |
| `<!-- BUILD:svg-defs -->` | `partials/svg-defs.html` | Нет |

**Подстановка токенов** (11 переменных):

| Токен | Источник |
|-------|----------|
| `{{CTA_HREF}}` | BUILD:vars |
| `{{CTA_LABEL}}` | BUILD:vars |
| `{{LOGO_ARIA_CURRENT}}` | Вычисляется: `aria-current="page"` если `CURRENT_PAGE=index`, иначе пусто |
| `{{NAV_HEADER_online}}` | Active/inactive классы для навигации |
| `{{NAV_HEADER_treatment}}` | Active/inactive классы для навигации |
| `{{NAV_HEADER_checkup}}` | Active/inactive классы для навигации |
| `{{NAV_HEADER_contacts}}` | Active/inactive классы для навигации |
| `{{NAV_MOBILE_online}}` | Active/inactive классы для мобильного меню |
| `{{NAV_MOBILE_treatment}}` | Active/inactive классы для мобильного меню |
| `{{NAV_MOBILE_checkup}}` | Active/inactive классы для мобильного меню |
| `{{NAV_MOBILE_contacts}}` | Active/inactive классы для мобильного меню |

**Допустимые значения `CURRENT_PAGE`:** `index`, `online`, `treatment`, `checkup`, `contacts`, `404`.

### 7.2 Adding a New Page

Чек-лист для добавления новой HTML-страницы:

1. Создать HTML-файл в&nbsp;корне проекта (например, `new-page.html`)
2. Добавить блок `BUILD:vars` с&nbsp;`CTA_HREF`, `CTA_LABEL`, `CURRENT_PAGE`
3. Добавить все 5 пар маркеров партиалов:
   - `<!-- BUILD:header -->` ... `<!-- /BUILD:header -->`
   - `<!-- BUILD:footer -->` ... `<!-- /BUILD:footer -->`
   - `<!-- BUILD:sticky-bar -->` ... `<!-- /BUILD:sticky-bar -->`
   - `<!-- BUILD:mobile-menu -->` ... `<!-- /BUILD:mobile-menu -->`
   - `<!-- BUILD:svg-defs -->` ... `<!-- /BUILD:svg-defs -->`
4. Добавить страницу в `Makefile` (переменная `PAGES`)
5. Добавить страницу в `scripts/build-pages.sh` (переменная `DEFAULT_PAGES`)
6. Если новый пункт навигации -- добавить `case` для `CURRENT_PAGE` в `build-pages.sh`
7. Запустить `make build` для сплайсинга партиалов

### 7.3 Tailwind Build

Команда `make build` запускает Tailwind CSS CLI (standalone binary, без Node.js) и&nbsp;затем сплайсер.

- Входной файл: `src/styles/tailwind.css`
- Сканирование классов: `@source '../../*.html'` (все HTML-файлы в&nbsp;корне)
- Выходной файл: `css/styles.css`

---

## 8. Protected Files

Файлы, которые **нельзя модифицировать** без явного ревью -- изменение ломает все страницы или всю визуальную систему:

| Файл | Причина защиты |
|------|---------------|
| `scripts/build-pages.sh` | Сплайсер -- сломает сборку всех страниц |
| `partials/*.html` | Chrome-партиалы -- распространяются на все страницы |
| `src/styles/theme.css` | Фундамент токенов -- сломает все поверхности |
| `src/styles/squircles.css` | Shape-примитивы -- сломает все формы элементов |
| `src/styles/liquid-glass.css` | Glass-материалы -- сломает все стеклянные поверхности |
| `Makefile` | Точка входа в build pipeline |

---

## 9. Scope Creep Guards

Что **не входит** в дизайн-систему v4.0:

- Нет JavaScript-фреймворков (React, Vue, Alpine.js)
- Нет CSS-in-JS
- Нет Sass/SCSS
- Нет дополнительных шрифтов помимо системного стека SF Pro
- Нет CSS container queries (не нужны для 5-страничного лейаута)
- Нет тёмного режима для styleguide.html (только dev-справочник)
- Нет поисковой функциональности
- Нет дополнительных языков помимо русского
