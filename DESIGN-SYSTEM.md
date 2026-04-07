# MedicusUnion Design System

> Дизайн-система для medicusunion.kz — медицинский сервис онлайн-консультаций, лечения за рубежом и чек-апов.
> Стиль: **iOS 26 Liquid Glass** — glassmorphism, прозрачности, blur, мягкие тени, скруглённые формы.
> ЦА: жители Казахстана 45+ — крупный шрифт, высокий контраст, понятная навигация.

### Критические правила

1. **Контраст:** Все текстовые цвета MUST проходить WCAG 2.1 AA (4.5:1 normal, 3:1 large bold). См. секцию "Accessible Text Colors".
2. **Focus states:** Все интерактивные элементы MUST иметь `focus-visible` ring.
3. **Токены:** Запрещены hardcoded rgba/hex в компонентах — только CSS-переменные из theme.css.

---

## 1. Цветовая палитра

### Бренд

| Токен | HEX | Роль |
|-------|-----|------|
| `--mu-blue` | `#38C6F4` | Основной бренд-цвет. Ссылки, акценты, иконки, градиенты |
| `--mu-accent-blue` | `#4F84E8` | Вторичный синий. Конечная точка градиентов, бейджи |
| `--mu-black` | `#010101` | Абсолютный чёрный (используется минимально) |
| `--mu-white` | `#FFFFFF` | Абсолютный белый |

### Зелёные (Green ramp)

| Токен | HEX | Роль |
|-------|-----|------|
| `--mu-green-50` | `#E4FAEF` | Фон иконок чек-апа |
| `--mu-green-100` | `#D3F8E4` | Лёгкий фон |
| `--mu-green-200` | `#A6EECB` | — |
| `--mu-green-300` | `#A6EECB` | — |
| `--mu-green-400` | `#79E9B3` | — |
| `--mu-green-500` | `#6FDEA9` | Hover-фон статов, градиенты |
| `--mu-green-600` | `#35B678` | Чекмарки, иконки успеха, статы |
| `--mu-green-700` | `#4BCA8C` | Бейджи чек-апа |
| `--mu-green-900` | `#35B678` | — |

### Нейтральные (Text ramp)

| Токен | HEX | Роль |
|-------|-----|------|
| `--mu-text-50` | `#FBFBFB` | Фон светлых секций |
| `--mu-text-100` | `#F5F6F8` | Альтернативный фон |
| `--mu-text-200` | `#D8DDE2` | Границы, разделители |
| `--mu-text-300` | `#C6C9D1` | Лёгкие границы, точки |
| `--mu-text-500` | `#A4A8B5` | Placeholder текст |
| `--mu-text-700` | `#63687A` | Вторичный текст, описания, навигация |
| `--mu-text-900` | `#1B212C` | Основной текст, заголовки |

### Акцентные (UI Elements)

| Токен | HEX | Роль |
|-------|-----|------|
| `--mu-accent-red` | `#F50057` | Ошибки, предупреждения |
| `--mu-accent-red-bg` | `#FFF0F5` | Фон для ошибок |
| `--mu-accent-orange` | `#FFA25C` | ТОЛЬКО для иконок и фонов (не для текста!) |
| `--mu-accent-orange-bg` | `#FFF5ED` | Фон для оранжевого |
| `--mu-accent-teal` | `#78C3BF` | ТОЛЬКО для иконок и фонов (не для текста!) |
| `--mu-accent-teal-bg` | `#EBFAF9` | Фон для teal |

### Accessible Text Colors (WCAG 2.1 AA)

Оригинальные акцентные цвета НЕ проходят WCAG AA на белом фоне (#FBFBFB). Для текста используются затемнённые варианты:

| Токен | HEX | Ratio vs #FBFBFB | WCAG AA | Заменяет (для текста) |
|-------|-----|:-:|:-:|---|
| `--mu-blue-text` | `#0E8FB5` | 4.51:1 | PASS | `--mu-blue` (#38C6F4, ratio 1.92 FAIL) |
| `--mu-accent-blue-text` | `#3B6DD0` | 4.58:1 | PASS | `--mu-accent-blue` (#4F84E8, ratio 3.50 FAIL) |
| `--mu-accent-teal-text` | `#3D7E7A` | 4.52:1 | PASS | `--mu-accent-teal` (#78C3BF, ratio 1.96 FAIL) |
| `--mu-accent-orange-text` | `#B5621D` | 4.53:1 | PASS | `--mu-accent-orange` (#FFA25C, ratio 1.92 FAIL) |
| `--mu-green-text` | `#1F7A4F` | 4.60:1 | PASS | `--mu-green-600` (#35B678, ratio 2.50 FAIL) |
| `--mu-text-700` | `#4A4E5C` | 5.89:1 | PASS | Старое #63687A (ratio 3.75 FAIL для normal) |
| `--mu-text-500` | `#6B6F80` | 4.50:1 | PASS | Старое #A4A8B5 (ratio 2.29 FAIL — placeholders) |

**Правило:** Оригинальные яркие цвета (`--mu-blue`, `--mu-accent-teal` и т.д.) используются ТОЛЬКО для:
- Иконок (не текстовых)
- Фонов и градиентов
- Декоративных элементов (borders, glows)
- `bg-clip-text` gradient (допустимо при extrabold 48px+, ratio large text)

Для любого **читаемого текста** — только `*-text` варианты.

### CTA Gradient (accessible)

Оригинальный gradient `#38C6F4 → #4F84E8` не проходит для белого текста (ratio 1.92–3.22:1).

```
/* Accessible CTA gradient */
--mu-cta-from: #0E8FB5;    /* ratio white-on: 4.51:1 PASS */
--mu-cta-to:   #3B6DD0;    /* ratio white-on: 4.58:1 PASS */

/* Tailwind: bg-gradient-to-r from-[#0E8FB5] to-[#3B6DD0] */
```

Визуально сохраняет голубой→синий переход, но затемнён на ~30% для читаемости белого текста.

### Системные

| Токен | Значение | Роль |
|-------|----------|------|
| `--background` | `#FFFFFF` | Фон body |
| `--foreground` | `oklch(0.145 0 0)` | Цвет текста по умолчанию |
| `--border` | `rgba(0, 0, 0, 0.1)` | Системная граница |
| `--input-background` | `#F3F3F5` | Фон инпутов (базовый) |
| `--radius` | `0.625rem` (10px) | Базовый радиус |

---

## 2. Типографика

### Шрифтовые семейства

```css
--font-family-heading: 'SF Pro Rounded', 'SF Pro Display', -apple-system,
  BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

--font-family-body: 'SF Pro Display', -apple-system, BlinkMacSystemFont,
  'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

- **Заголовки** — SF Pro Rounded (мягкие, дружелюбные формы)
- **Тело текста** — SF Pro Display (чёткие, профессиональные формы)
- Оба — системные Apple шрифты, нулевая загрузка на macOS/iOS
- `font-display: swap` для обоих
- Variable weight: `100 900`

### @font-face (fonts.css)

```css
@font-face {
  font-family: 'SF Pro Display';
  src: local('SF Pro Display'), local('SFProDisplay-Regular'),
       local('.SFNSDisplay'), local('-apple-system');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'SF Pro Rounded';
  src: local('SF Pro Rounded'), local('SFProRounded-Regular'),
       local('.SFNSRounded');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

### Типографическая шкала

| Уровень | Размер (desktop) | Вес | Line-height | Letter-spacing | Применение |
|---------|-----------------|-----|-------------|----------------|------------|
| Hero H1 | `96px` (6rem) | `800` (extrabold) | `105.6px` (1.1) | `-2.4px` | Главный заголовок hero |
| H1 responsive | `80px / 72px / 60px / 48px` | `800` | `1.1` | `-2.4px` | xl / lg / md / sm breakpoints |
| Section H2 | `60px` (3.75rem) | `800` | `60px` (1.0) | `normal` | Заголовки секций |
| H2 responsive | `48px` | `800` | `1.0` | `normal` | md и ниже |
| Card H3 | `24px` (1.5rem) | `700` (bold) | `32px` (1.33) | `normal` | Заголовки карточек |
| Stat number | `60px / 48px` | `800` | `1` | `normal` | Счётчики статов |
| Stat label | `18px` (1.125rem) | `700` | `28px` | `wider` | Подписи статов, uppercase |
| Body large | `20px` (1.25rem) | `500` | `28px` (1.4) | `normal` | Hero подзаголовок |
| Body | `18px` (1.125rem) | `500` | `28px` (1.56) | `normal` | Описания секций |
| Body default | `16px` (1rem) | `500` | `24px` (1.5) | `normal` | Основной текст |
| Label | `14px` (0.875rem) | `700` (bold) | `20px` | `normal` | Подписи форм |
| Badge / small | `14px` | `600-700` | `20px` | `wider` | Бейджи, uppercase labels |
| Caption | `14px` | `500` | `20px` | `normal` | Подписи, мета-текст |
| Micro | `12px` (0.75rem) | `500` | `16px` | `normal` | ISO метки, мелкие подписи |

### Текстовые стили

- **Gradient text** (заголовки секций): `bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent`
- **Drop shadow** на заголовках: `drop-shadow-sm`
- **Tracking**: `-2.4px` для hero, `tight` для навигации/кнопок, `wider` для uppercase labels

---

## 3. Glassmorphism System

### Уровни прозрачности

| Уровень | Background | Blur | Saturate | Применение |
|---------|-----------|------|----------|------------|
| **Glass-1** (лёгкий) | `white/30` | `40px` | `150%` | Header (не скролл) |
| **Glass-2** (средний) | `white/40` | `20-24px` | `180%` | Бейджи, chips |
| **Glass-3** (стандарт) | `white/50` | `60px` | `180%` | Header (скролл), кнопки secondary |
| **Glass-4** (плотный) | `white/60` | `48px` (2xl) | — | Карточки услуг, координатор, footer |
| **Glass-5** (тяжёлый) | `white/70` | `72px` (3xl) | — | Форма контакта |
| **Glass-mobile** | `white/60` | `80px` | `200%` | Мобильное меню |

### Тени (Glass Shadows)

```css
--shadow-glass-sm:    0 4px 16px rgba(1,1,1,0.04),
                      inset 0 1px 1px rgba(255,255,255,0.8);

--shadow-glass:       0 8px 32px rgba(1,1,1,0.08),
                      inset 0 1px 1px rgba(255,255,255,0.9);

--shadow-glass-lg:    0 16px 48px rgba(1,1,1,0.12),
                      inset 0 1px 1px rgba(255,255,255,0.95);

--shadow-glass-inner: inset 0 1px 1px rgba(255,255,255,0.9);

--shadow-glass-inner-strong: inset 0 1px 1px rgba(255,255,255,1);

--shadow-glass-header: inset 0 1px 1px rgba(255,255,255,0.8),
                       inset 0 -1px 1px rgba(0,0,0,0.05),
                       0 8px 32px rgba(0,0,0,0.05);
```

### Границы (Glass Borders)

```css
--border-glass:        1px solid rgba(255, 255, 255, 0.6);
--border-glass-strong: 1px solid rgba(255, 255, 255, 0.8);
```

- Header: `0.5px solid white/50`
- Карточки: `1px solid rgba(255,255,255,0.6)`, hover: `rgba(255,255,255,0.8)`
- Форма: `1px solid rgba(255,255,255,0.6)`
- Инпуты: `1px solid white/40`

---

## 4. Border Radius

| Токен / Применение | Значение | Где |
|-------------------|----------|-----|
| Header | `40px` (`rounded-[2.5rem]`) | Навигационный бар |
| Карточки услуг | `48px` (`rounded-[3rem]`) | Service cards, form container |
| Внутренние изображения | `32px` (`rounded-[2rem]`) | Изображения внутри карточек |
| Стат-карточки | `40px` (`rounded-[2.5rem]`) | Блоки счётчиков |
| Координатор-карточка | `40px` (`rounded-[2.5rem]`) | Карточка с фото |
| Footer | `48px` (`rounded-[3rem]`) | Футер-контейнер |
| CTA кнопки | `24px` (`rounded-3xl`) | Primary, secondary buttons |
| Header CTA | `9999px` (`rounded-full`) | Кнопка "Оставить заявку" в header |
| Бейджи/Chips | `9999px` (`rounded-full`) | Все бейджи, статус-теги |
| Инпуты | `16px` (`rounded-2xl`) | Поля формы |
| Иконки маленькие | `16px` (`rounded-2xl`) | Floating icon badges |
| Иконки в контактах | `12px` (`rounded-xl`) | Phone/mail icons |
| Мобильное меню | `24px` (`rounded-3xl`) | Mobile nav dropdown |

---

## 5. Кнопки

### Общие states (применяются ко ВСЕМ кнопкам)

```css
/* Focus — ОБЯЗАТЕЛЕН для accessibility */
focus-visible:ring-2 focus-visible:ring-mu-blue-text focus-visible:ring-offset-2 focus-visible:outline-none

/* Disabled */
disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none

/* Стандартный hover scale (единый для всех) */
whileHover: { scale: 1.02 }
whileTap:   { scale: 0.98 }
```

### Primary CTA

```
bg-gradient-to-r from-[var(--mu-cta-from)] to-[var(--mu-cta-to)]
text-white
font-bold
shadow-lg shadow-mu-blue/25
hover: shadow-xl shadow-mu-blue/30
transition-all

/* Размеры */
Hero/Page CTA:   px-8 py-4  rounded-3xl (24px)  text-lg
Header CTA:      px-6 py-2.5 rounded-full        text-base font-semibold tracking-tight
Form submit:     w-full py-4 rounded-2xl (16px)   text-lg
CTA banner:      px-10 py-5  rounded-3xl          text-lg

/* Loading state */
disabled:opacity-50
Spinner: w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin
Text: "Отправка..."
```

### Secondary (Ghost glass)

```
bg-white/50
backdrop-blur-xl
border border-glass-border
text-mu-text-900
font-bold
shadow-glass-sm
hover: bg-white/70, shadow-glass
transition-all

/* Размеры */
Hero/Page:    px-8 py-4  rounded-3xl
Card CTA:     w-full py-4 rounded-2xl
```

### Nav Link

```
text-[var(--mu-text-700)]   /* accessible #4A4E5C */
font-medium
tracking-tight
hover: text-mu-blue-text
transition-colors
active: text-mu-blue-text
focus-visible:ring-2 focus-visible:ring-mu-blue-text focus-visible:ring-offset-2 focus-visible:outline-none
```

### Icon Button (Mobile menu)

```
p-2
bg-white/50
rounded-full
backdrop-blur-xl backdrop-saturate-[180%]
border border-white/50
text-mu-text-700
focus-visible:ring-2 focus-visible:ring-mu-blue-text
```

---

## 6. Карточки

### Service Card (Карточка услуги)

```
bg-white/60
backdrop-blur-2xl
rounded-[3rem] (48px)
border: 1px solid rgba(255,255,255,0.6)
shadow-glass
hover:
  border rgba(255,255,255,0.8)
  shadow-glass-lg
  translateY(-8px)
  transition 500ms
overflow: hidden
```

Внутренняя структура:
- Image area: `h-56, p-3`, inner `rounded-[2rem]`, gradient overlay `from-black/40 via-transparent to-transparent`
- Floating icon: `w-12 h-12`, glass background, `rounded-2xl`, hover: `scale(1.1) rotate(3deg)`
- Badge: glass chip `bg-white/50 backdrop-blur-md rounded-full px-4 py-1.5`
- Features: checkmark icon `w-6 h-6 bg-white/60 rounded-full` с `text-mu-green-600`
- CTA: glass button `bg-white/50 backdrop-blur-xl rounded-2xl py-4`

### Stat Card (Счётчик)

```
bg-white/60
backdrop-blur-2xl
rounded-[2.5rem] (40px)
border: border-glass-border
shadow-glass
hover: shadow-glass-lg, bg-white/70, border-glass-border-strong
p-8
text-center
```

- Number: `text-5xl md:text-6xl font-extrabold` + **accessible** цвет акцента (`*-text` вариант)
- Label: `text-lg font-bold uppercase tracking-wider text-[var(--mu-text-700)]`
- Hover glow: `absolute -inset-10 opacity-0 group-hover:opacity-20 blur-2xl` с цветом акцента

### Coordinator Card

```
bg-white/60
backdrop-blur-2xl
rounded-[2.5rem] (40px)
p-6
border: 1px solid white/60
shadow-glass
```

- Аватар: `w-32 h-32 rounded-full border-4 border-white/60 shadow-glass-sm`
- Icon buttons: `w-8 h-8 rounded-full bg-white/60 backdrop-blur-md border border-white/60 shadow-glass-inner-strong`

### Footer Card

```
bg-white/60
backdrop-blur-3xl
rounded-[3rem] (48px)
p-12
border: 1px solid white/60
shadow-glass-lg
```

---

## 7. Форма

### Контейнер формы

```
bg-white/60
backdrop-blur-3xl
rounded-[3rem] (48px)
p-8
border: 1px solid white/60
shadow-glass-lg
overflow: hidden
```

### Инпуты (text, tel, textarea)

```
w-full
px-5 py-4
rounded-2xl (16px)
border: 1px solid white/40
bg-white/50
backdrop-blur-md
shadow-glass-inner
placeholder: text-[var(--mu-text-500)]   /* accessible #6B6F80 */
font-medium
text-mu-text-900

focus:
  bg-white/70
  border-[var(--mu-blue-text)]
  ring-4 ring-[var(--mu-blue-text)]/20
  outline: none

/* Error state */
error:
  border-mu-accent-red
  ring-4 ring-mu-accent-red/20
  + error message below:
    text-sm font-medium text-mu-accent-red mt-1
    aria-live="polite"

/* Disabled state */
disabled:
  opacity-50
  cursor-not-allowed
  bg-white/30
```

### Select

```
/* Идентично инпутам + */
appearance: none
/* Кастомная стрелка через background-image SVG chevron */
bg-[url("data:image/svg+xml,...chevron...")] bg-no-repeat bg-[right_1.25rem_center] bg-[length:1rem]
```

### Label

```
text-sm (14px)
font-bold
text-mu-text-900
mb-2
block
```

### Error Message

```
text-sm
font-medium
text-mu-accent-red
mt-1
role="alert"
aria-live="polite"
```

### Submit button — см. Primary CTA (секция 5)

### Trust text

```
text-sm
text-[var(--mu-text-700)]   /* accessible #4A4E5C */
font-medium
text-center
mt-4
```

---

## 8. Бейджи и Chips

### Section Badge (над заголовком секции)

```
inline-flex items-center gap-2
bg-white/40
backdrop-blur-xl
border: border-glass-border
px-5 py-2.5
rounded-full
shadow-sm shadow-glass-inner
text: text-sm font-bold uppercase tracking-wider
color: text-mu-accent-blue
```

### Price Badge (на карточке)

```
inline-flex items-center gap-2
bg-white/50
backdrop-blur-md
border: border-glass-border
px-4 py-1.5
rounded-full
shadow-sm
text: text-sm font-bold
color: text-mu-accent-blue / text-mu-accent-teal / text-mu-green-700
```

### Trust Chip (ISO 27001, 24/7)

```
inline-flex items-center gap-2
bg-white/40
backdrop-blur-xl
border: 1px solid white/60
px-5 py-2.5
rounded-full
text: text-sm font-bold text-mu-text-900
icon: CheckCircle2 w-4 h-4 text-mu-green-600
shadow-sm shadow-glass-inner
```

### Hero floating badge (4.9/5, 500+)

```
bg-white/70 or bg-white/60
backdrop-blur-3xl or 2xl
rounded-[2.5rem] (40px)
p-4
shadow-glass
border: 1px solid white/60
```

---

## 9. Градиенты

### Текстовый градиент (бренд)

```css
background: linear-gradient(to right, #38C6F4, #4F84E8, #35B678);
/* Tailwind: bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 */
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

Применяется к: H2 заголовкам секций, логотипу, H3 футера.

### CTA градиент

```css
background: linear-gradient(to right, #38C6F4, #4F84E8);
/* Tailwind: bg-gradient-to-r from-mu-blue to-mu-accent-blue */
```

### Overlay градиент (на изображениях)

```css
background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
/* Tailwind: bg-gradient-to-t from-black/40 via-transparent to-transparent */
```

### Stat glow градиент

```css
/* Radial glow на hover, per-stat цвет */
background: linear-gradient(to bottom-right, var(--stat-color), transparent);
/* Tailwind: bg-gradient-to-br from-{color} to-transparent */
opacity: 0 → 0.2 on hover
filter: blur(24px)
```

---

## 10. Анимации (Motion)

### Библиотека: Motion (standalone CDN / motion/react)

### Стандартизированные значения

> Аудит выявил разброс в duration (0.6-0.8), y-offset (20-50), stagger delay (0.08-0.2).
> Ниже — **канонические** значения. Все компоненты должны использовать только их.

### Паттерны появления

| Паттерн | Значения | Применение |
|---------|----------|------------|
| Fade up | `y: 30→0, opacity: 0→1, duration: 0.8` | Заголовки секций, одиночные блоки |
| Fade up stagger | `y: 30→0, opacity: 0→1, duration: 0.8, delay: i * 0.15` | Карточки в grid |
| Slide left | `x: -50→0, opacity: 0→1, duration: 0.8` | Левая колонка в 2-col layouts |
| Slide right | `x: 50→0, opacity: 0→1, duration: 0.8, delay: 0.2` | Правая колонка |
| Spring bounce | `y: -100→0, spring, bounce: 0.4` | Header entrance |
| Scale pop | `scale: 0→1, spring, stiffness: 200` | Success checkmark, модалки |
| Counter | `0→target за 2s, 60 steps` | Stat numbers |

### Интерактивные (стандарт)

| Паттерн | Значения | Применение |
|---------|----------|------------|
| **Button hover** | `scale: 1.02` | ВСЕ кнопки (primary, secondary, card CTA) |
| **Button tap** | `scale: 0.98` | ВСЕ кнопки |
| **Logo hover** | `scale: 1.05` | Только логотип |
| **Logo tap** | `scale: 0.95` | Только логотип |
| Card hover lift | `translateY(-8px), duration: 500ms` | Service, Guide, Pricing cards |
| Country card hover | `translateY(-4px)` | Маленькие карточки (country) |
| Icon hover | `scale(1.1) rotate(3deg), duration: 500ms` | Floating icons на карточках |
| Image hover | `scale(1.05), duration: 700ms` | Фото внутри карточек |
| Floating badge hover | `y: -5` | Hero badges (4.9/5, 500+) |

### Trigger: `useInView({ once: true, amount: 0.3 })`

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Отключить все Motion анимации */
  /* Mesh background blobs — статичны */
  /* Counters — сразу показывать конечное число */
}
```

---

## 11. Навигация (Header)

### Desktop

```
position: fixed
z-index: 50
top: 16px (top-4)
left/right: 16px
max-width: 1280px (max-w-7xl)
mx-auto
rounded-[2.5rem] (40px)
px-8 (md), px-4 (mobile)
transition: all 500ms

Не скролл:
  bg-white/30, backdrop-blur-[40px], saturate-[150%], py-5

Скролл (scrollY > 20):
  bg-white/50, backdrop-blur-[60px], saturate-[180%], py-3

border: 0.5px solid white/50
shadow: shadow-glass-header
```

### Логотип

```
text-2xl font-bold tracking-tight
bg-gradient-to-r from-mu-blue to-mu-accent-blue bg-clip-text text-transparent
```

### Mobile menu

```
position: absolute top-24 left-4 right-4
bg-white/60
backdrop-blur-[80px] saturate-[200%]
rounded-3xl (24px)
border: 0.5px solid white/50
shadow-glass-lg
overflow: hidden

animation: spring, damping: 25, stiffness: 200
  enter: y: -20→0, opacity: 0→1, scale: 0.95→1
  exit: reverse

nav items: p-6, gap-2
  item: px-4 py-3, rounded-2xl, hover: bg-white/40
  divider: h-[0.5px] bg-white/40

mobile CTA: full-width, rounded-2xl, gradient, py-4
```

---

## 12. Фоновый слой (Page Background)

Страница использует мягкий градиентный фон с пастельными пятнами:

```
background: #ffffff
```

Сверху накладываются декоративные blur-пятна (реализованы через `absolute` div-ы или CSS gradients):
- Светло-голубой / мятный / бледно-зелёный
- Создают мягкий, «медицинский» ambiance без жёсткого цвета

---

## 13. Иконки

### Библиотека: Lucide React

Используемые иконки:
- `Video` — онлайн-консультации
- `Globe2` — лечение за рубежом
- `ClipboardCheck` — чек-ап
- `ArrowRight` — CTA стрелки
- `Sparkles` — hero badge
- `Star` — рейтинг
- `Users` — количество пациентов
- `CheckCircle2` — trust chips, success state
- `Send` — form submit
- `Phone` — телефон
- `Mail` — email
- `Shield` — ISO сертификат
- `Menu` / `X` — мобильное меню

### Размеры

| Контекст | Размер |
|----------|--------|
| Inline (nav, contact) | `w-4 h-4` |
| Badge, trust chip | `w-4 h-4` |
| Mobile menu | `w-5 h-5` |
| Card CTA arrow | `w-5 h-5` |
| Floating card icon | `w-6 h-6` |
| Success state | `w-12 h-12` |

---

## 14. Layout & Grid

### Container

```
max-width: 1280px (max-w-7xl)
mx-auto
px-4 lg:px-6
```

### Grid системы

| Секция | Desktop | Tablet | Mobile |
|--------|---------|--------|--------|
| Services | 3 cols | 2 cols | 1 col |
| Stats | 4 cols | 2 cols | 2 cols |
| Contact | 2 cols | 1 col | 1 col |
| Footer | 4 cols | 2 cols | 1 col |

```
gap: 24px (gap-6) — stats
gap: 32px (gap-8) — services
gap: 48px (gap-12) — contact, footer
```

### Section spacing

```
py-16 (64px) — стандартные секции
py-12 (48px) — stats
pt-32 pb-16 (128/64px) — hero (с учётом fixed header)
lg:pt-40 — hero desktop (160px)
```

---

## 15. Breakpoints

| Токен | Размер | Применение |
|-------|--------|------------|
| `sm` | `640px` | Начало адаптивных кнопок |
| `md` | `768px` | Grid переходы, footer, h2 responsive |
| `lg` | `1024px` | Desktop nav, 3-col grid, contact 2-col |
| `xl` | `1280px` | Hero text maximum |

---

## 16. Цветовое кодирование услуг

| Услуга | Иконка/фон (оригинал) | Текст (accessible) | Фон иконки | Step color |
|--------|---|---|---|---|
| Онлайн-консультации | `--mu-accent-blue` #4F84E8 | `--mu-accent-blue-text` #3B6DD0 | `bg-mu-blue/10` | `text-mu-accent-blue-text` |
| Лечение за рубежом | `--mu-accent-teal` #78C3BF | `--mu-accent-teal-text` #3D7E7A | `bg-mu-accent-teal-bg` | `text-mu-accent-teal-text` |
| Чек-ап | `--mu-green-600` #35B678 | `--mu-green-text` #1F7A4F | `bg-mu-green-50` | `text-mu-green-text` |

**Правило:** Оригинальные яркие цвета — для иконок и фонов. Для текста — всегда `*-text` вариант.

---

## 17. Tailwind v4 @theme Configuration

Полная карта кастомных токенов для `@theme inline`:

```css
@theme inline {
  /* Brand colors */
  --color-mu-blue: var(--mu-blue);            /* #38C6F4 */
  --color-mu-black: var(--mu-black);          /* #010101 */
  --color-mu-white: var(--mu-white);          /* #FFFFFF */

  /* Green ramp */
  --color-mu-green-50: var(--mu-green-50);    /* #E4FAEF */
  --color-mu-green-100: var(--mu-green-100);  /* #D3F8E4 */
  --color-mu-green-200: var(--mu-green-200);  /* #A6EECB */
  --color-mu-green-300: var(--mu-green-300);  /* #A6EECB */
  --color-mu-green-400: var(--mu-green-400);  /* #79E9B3 */
  --color-mu-green-500: var(--mu-green-500);  /* #6FDEA9 */
  --color-mu-green-600: var(--mu-green-600);  /* #35B678 */
  --color-mu-green-700: var(--mu-green-700);  /* #4BCA8C */
  --color-mu-green-900: var(--mu-green-900);  /* #35B678 */

  /* Text / Neutral ramp */
  --color-mu-text-50: var(--mu-text-50);      /* #FBFBFB */
  --color-mu-text-100: var(--mu-text-100);    /* #F5F6F8 */
  --color-mu-text-200: var(--mu-text-200);    /* #D8DDE2 */
  --color-mu-text-300: var(--mu-text-300);    /* #C6C9D1 */
  --color-mu-text-500: var(--mu-text-500);    /* #A4A8B5 */
  --color-mu-text-700: var(--mu-text-700);    /* #63687A */
  --color-mu-text-900: var(--mu-text-900);    /* #1B212C */

  /* Accent colors */
  --color-mu-accent-blue: var(--mu-accent-blue);          /* #4F84E8 */
  --color-mu-accent-red: var(--mu-accent-red);            /* #F50057 */
  --color-mu-accent-red-bg: var(--mu-accent-red-bg);      /* #FFF0F5 */
  --color-mu-accent-orange: var(--mu-accent-orange);      /* #FFA25C */
  --color-mu-accent-orange-bg: var(--mu-accent-orange-bg);/* #FFF5ED */
  --color-mu-accent-teal: var(--mu-accent-teal);          /* #78C3BF */
  --color-mu-accent-teal-bg: var(--mu-accent-teal-bg);    /* #EBFAF9 */

  /* Glass shadows */
  --shadow-glass-sm: 0 4px 16px rgba(1,1,1,0.04),
                     inset 0 1px 1px rgba(255,255,255,0.8);
  --shadow-glass: 0 8px 32px rgba(1,1,1,0.08),
                  inset 0 1px 1px rgba(255,255,255,0.9);
  --shadow-glass-lg: 0 16px 48px rgba(1,1,1,0.12),
                     inset 0 1px 1px rgba(255,255,255,0.95);
  --shadow-glass-inner: inset 0 1px 1px rgba(255,255,255,0.9);
  --shadow-glass-inner-strong: inset 0 1px 1px rgba(255,255,255,1);
  --shadow-glass-header: inset 0 1px 1px rgba(255,255,255,0.8),
                         inset 0 -1px 1px rgba(0,0,0,0.05),
                         0 8px 32px rgba(0,0,0,0.05);

  /* Glass borders */
  --color-glass-border: rgba(255, 255, 255, 0.6);
  --color-glass-border-strong: rgba(255, 255, 255, 0.8);

  /* Accessible text color variants (WCAG AA) */
  --color-mu-blue-text: var(--mu-blue-text);                    /* #0E8FB5 */
  --color-mu-accent-blue-text: var(--mu-accent-blue-text);      /* #3B6DD0 */
  --color-mu-accent-teal-text: var(--mu-accent-teal-text);      /* #3D7E7A */
  --color-mu-accent-orange-text: var(--mu-accent-orange-text);   /* #B5621D */
  --color-mu-green-text: var(--mu-green-text);                   /* #1F7A4F */

  /* Accessible CTA gradient */
  --color-mu-cta-from: var(--mu-cta-from);   /* #0E8FB5 */
  --color-mu-cta-to: var(--mu-cta-to);       /* #3B6DD0 */

  /* Form input shadow (standardized — replaces hardcoded rgba) */
  --shadow-form-inset: inset 0 2px 4px rgba(0, 0, 0, 0.05);

  /* Fonts */
  --font-heading: var(--font-family-heading);
  --font-body: var(--font-family-body);
}
```

---

## 18. Глобальный фон (Liquid Mesh Background)

Все страницы обёрнуты в Layout с animated mesh-фоном поверх `bg-mu-text-50` (#FBFBFB):

```
/* Базовый фон */
bg-mu-text-50 (#FBFBFB)

/* 3 анимированных blur-пятна (fixed, pointer-events-none) */
1. top-left:  w-[60vw] h-[60vw] bg-mu-blue/30    blur-[120px] mix-blend-multiply
   animate: x 0→80→0, y 0→40→0, scale 1→1.1→1, duration 15s, infinite

2. top-right: w-[50vw] h-[50vw] bg-mu-green-300/20 blur-[120px] mix-blend-multiply
   animate: x 0→-80→0, y 0→80→0, scale 1→1.2→1, duration 18s, infinite

3. bottom-left: w-[70vw] h-[70vw] bg-mu-accent-blue/15 blur-[120px] mix-blend-multiply
   animate: x 0→40→0, y 0→-40→0, scale 1→1.1→1, duration 22s, infinite

/* Frosted overlay поверх пятен */
bg-white/40 backdrop-blur-[40px] backdrop-saturate-[180%]
```

Секция CTA-блоки на подстраницах имеют собственные внутренние blur-пятна:
```
/* Внутри CTA контейнера, -z-10 */
w-96 h-96 rounded-full blur-[100px]
animate: scale 1→1.3→1, duration 8-10s, infinite
Цвета: bg-mu-accent-teal-bg, bg-mu-accent-orange-bg, bg-mu-green-300/20, bg-mu-blue/30
```

### Text selection

```
selection:bg-mu-blue/30 selection:text-mu-text-900
```

---

## 19. Страницы и специфичные компоненты

### 19.1 Общий шаблон страницы услуги

Все 3 страницы услуг (`online-consultations`, `treatment-abroad`, `checkups`) следуют единому шаблону:

```
<div className="pt-32 pb-16">
  <section>  Hero (2 колонки: текст + изображение)
  <section>  Features Grid (2-3 колонки)
  <section>  How it works / Programs / Countries (специфичный блок)
  <section>  Specializations / Included (опционально)
  <section>  CTA Banner (на всю ширину)
</div>
```

### 19.2 Hero изображение (страницы услуг)

```
rounded-[3rem] (48px)
overflow: hidden
border: 8px solid white/40
bg-white/20
shadow-glass-lg или shadow-2xl
img: h-[400px] lg:h-[500px] object-cover
```

### 19.3 Feature Card (универсальная)

Используется на всех подстраницах для перечисления преимуществ:

```
bg-white/60
backdrop-blur-2xl
rounded-[2.5rem] (40px)
p-8
border: 1px solid white/60
shadow-glass
hover: border-white/80, shadow-glass-lg
transition: all 500ms

Icon container:
  w-14 h-14
  bg-{service-color}/10 или bg-{service}-bg
  backdrop-blur-xl
  rounded-2xl (16px)
  border: 1px solid white/60
  shadow-glass-sm
  mb-5
  hover: scale(1.1) rotate(3deg)

Title: text-xl font-extrabold text-mu-text-900 mb-2
Desc: text-mu-text-700 font-medium
```

### 19.4 Step Card (Как это работает)

```
bg-white/60
backdrop-blur-2xl
rounded-[2.5rem] (40px)
p-8
border: 1px solid white/60
shadow-glass
hover: bg-white/80, border-white/80, shadow-glass-lg

Step number:
  text-6xl (60px)
  font-extrabold
  color: per-step accent (opacity 20%)
  hover: opacity 40%, translateY(-8px), scale(1.05), origin-left
  mb-4

Title: text-xl font-extrabold text-mu-text-900 mb-3
Desc: text-mu-text-700 font-medium

Grid: sm:grid-cols-2 lg:grid-cols-4 gap-6
```

Step color sequence:
1. `text-mu-accent-blue`
2. `text-mu-green-500`
3. `text-mu-accent-teal`
4. `text-mu-accent-orange`

### 19.5 Country Card (Лечение за рубежом)

```
bg-white/60
backdrop-blur-2xl
rounded-[2rem] (32px)
p-6
border: 1px solid white/60
shadow-glass
text-center
hover: translateY(-4px)

Flag: text-4xl, mb-3
Name: text-lg font-extrabold text-mu-text-900 mb-1
Clinics: text-sm text-mu-blue font-bold

Grid: grid-cols-2 md:grid-cols-4 gap-4
```

### 19.6 Pricing Card (Чек-ап программы)

```
bg-white/60
backdrop-blur-2xl
rounded-[3rem] (48px)
p-8
border: 1px solid white/60  (обычная)
border: 1px solid mu-blue/40 (популярная)
shadow-glass (обычная)
shadow: 0 16px 48px color-mix(in oklch, mu-blue 15%, transparent) (популярная)
flex flex-col
hover: translateY(-8px)

Popular badge (абсолютно позиционирован):
  absolute -top-3 left-1/2 -translate-x-1/2
  bg-gradient-to-r from-mu-blue to-mu-accent-blue
  text-white
  px-6 py-1.5
  rounded-full
  text-sm font-bold
  shadow-lg

Price: text-3xl font-extrabold gradient text (from-mu-blue to-mu-accent-blue)
Meta: text-sm text-mu-text-700 font-bold + text-mu-blue для локации

Features list:
  CheckCircle2 w-5 h-5 text-mu-green-600
  text-mu-text-900 font-medium

CTA (популярная): gradient primary button
CTA (обычная): ghost glass secondary button
```

### 19.7 Specialization Chip

```
bg-white/50
backdrop-blur-md
border: 1px solid white/60
px-6 py-3
rounded-full
font-bold
text-mu-text-900
shadow-glass-inner
hover: bg-mu-green-50 text-mu-green-700
cursor: default
flex-wrap gap-3 justify-center
```

### 19.8 CTA Banner (финальный блок на подстраницах)

```
bg-white/60
backdrop-blur-3xl
rounded-[3.5rem] (56px)
p-12 lg:p-20
text-center
border: 1px solid white/60
shadow-glass-lg
relative overflow-hidden

H2: text-4xl md:text-5xl font-extrabold text-mu-text-900 mb-6
P: text-xl text-mu-text-700 font-medium mb-10 max-w-2xl mx-auto

CTA: gradient primary, px-10 py-5 rounded-3xl font-bold text-lg
     hover: scale(1.05), tap: scale(0.95)
     shadow-lg shadow-mu-blue/30
     mx-auto (центрирован)

Internal blur decorations: 2 animated circles (scale pulsing, blur-[100px])
```

### 19.9 CTA Section (главная — с изображением)

```
bg-white/60
backdrop-blur-3xl
rounded-[3.5rem] (56px)
shadow-glass-lg
border: border-glass-border-strong (rgba(255,255,255,0.8))
overflow: hidden

Grid: lg:grid-cols-2
Left: p-12 lg:p-20, text + buttons
  Animated bg: mu-blue/30 blur-[100px] mix-blend-multiply, scale pulsing

Right: image with edge gradient
  gradient overlay: bg-gradient-to-r from-white/60 to-transparent w-1/3
```

### 19.10 Contact Method Card (страница /contacts)

```
bg-white/60
backdrop-blur-2xl
rounded-[2rem] (32px)
p-6
border: 1px solid white/60
shadow-glass

Icon container:
  w-10 h-10
  bg-white/50 backdrop-blur-md
  rounded-xl (12px)
  border: 1px solid white/60
  text-mu-blue
  mb-3

Label: text-sm text-mu-text-500 font-bold mb-1
Value: text-mu-text-900 font-bold

Grid: sm:grid-cols-2 gap-4
```

### 19.11 Advantage Card (WhyUs section)

Горизонтальная карточка (icon + text), без фона контейнера:

```
flex gap-5

Icon:
  w-16 h-16
  bg-{color}-bg backdrop-blur-xl
  rounded-[1.5rem] (24px)
  shadow-glass-sm
  border: border-glass-border
  text-{service-color}
  hover: scale(1.1) rotate(3deg)

Title: text-xl font-extrabold text-mu-text-900
  с inline colored numbers через dangerouslySetInnerHTML
  hover: text-mu-blue
Desc: text-mu-text-700 font-medium text-sm md:text-base

Spacing: space-y-12 между карточками
```

### 19.12 Guide Card (Не знаете, с чего начать?)

Карточка-навигатор с изображением и ссылкой на услугу:

```
bg-white/60 backdrop-blur-2xl
rounded-[3rem] (48px)
border: border-glass-border → hover: border-glass-border-strong
shadow-glass → hover: shadow-glass-lg
overflow: hidden
p-3 (padding для внутреннего изображения)
hover: translateY(-8px)
cursor: pointer (вся карточка кликабельна)

Image area: h-48, inner rounded-[2rem], border white/40
  gradient overlay: from-black/40 via-transparent to-transparent
  hover: scale(1.1) на img

Floating icon (перекрывает границу image/content):
  absolute bottom-0 left-8 translate-y-1/2
  w-14 h-14
  bg-{color}/10 backdrop-blur-xl rounded-2xl
  shadow-glass-sm, border-glass-border
  hover: -translate-y-2 scale(1.1) rotate(6deg)

Content: p-8 pt-12 (отступ под floating icon)
Title: text-2xl font-bold → hover: text-{color}
Desc: text-mu-text-700 font-medium
Link button: bg-white/50 border-glass-border shadow-glass-inner p-4 rounded-2xl
  text-{service-color} font-bold, centered
  hover: gap-3 (стрелка отъезжает)
```

### 19.13 Image Collage (WhyUs section)

```
Grid: grid-cols-2 gap-6, h-[600px]
Column 1: pt-12 (offset), space-y-6
Column 2: space-y-6

Image containers:
  rounded-[3rem] (48px)
  overflow: hidden
  border: 6px solid white/50
  backdrop-blur-2xl
  bg-white/20
  shadow-glass-lg
  img: hover scale(1.05), transition 700ms

Info card (нижний правый):
  rounded-[3rem]
  bg-white/40 backdrop-blur-2xl
  border: 1px solid white/60
  p-8
  shadow-glass-inner
  Big number: text-4xl font-extrabold text-mu-text-900
  Label: text-mu-text-700 font-bold
```

---

## 20. Дополнительные иконки (со всех страниц)

### Lucide Icons — полный список

| Иконка | Страница / Компонент |
|--------|---------------------|
| `Video` | Онлайн-консультации hero badge, service card |
| `Globe2` | Лечение за рубежом hero badge, service card |
| `ClipboardCheck` | Чек-ап hero badge, service card |
| `ArrowRight` | Все CTA кнопки |
| `Sparkles` | Hero badge на главной |
| `Star` | Рейтинг, second opinion feature |
| `Users` | Корпоративные чек-апы, stat |
| `CheckCircle2` | Trust chips, success state, feature lists |
| `Send` | Form submit button |
| `Phone` | Телефон (nav, contacts, footer) |
| `Mail` | Email (contacts, footer) |
| `Shield` | ISO 27001, security feature, WhyUs |
| `Menu` / `X` | Mobile menu toggle |
| `Clock` | Feature "За 5 дней", график |
| `Globe` | Feature "Врачи из 7 стран", WhyUs |
| `FileText` | Feature "Перевод документов", GuideCard |
| `MessageSquare` | Feature "На вашем языке" |
| `MessageCircle` | Contacts page hero badge |
| `HelpCircle` | GuideCard "Есть диагноз" |
| `Heart` | GuideCard "Хочу проверить здоровье" |
| `Plane` | Визовая поддержка |
| `Building2` | Подбор клиники |
| `HeartPulse` | Лечение |
| `FileCheck` | Документация |
| `Languages` | Переводчик |
| `MapPin` | Офис (контакты) |
| `Smartphone` | WhyUs "Всё в приложении" |
| `Award` | WhyUs "15+ лет опыта" |
| `Stethoscope` | Передовое оборудование (чек-ап) |

---

## 21. Паттерны повторного использования

### Единый паттерн Section Badge

Используется над каждым заголовком секции. Одинаковый стиль, меняется только текст/цвет/иконка:

```
inline-flex items-center gap-2
bg-white/40 backdrop-blur-xl
border border-white/60
px-5 py-2.5
rounded-full
shadow-sm shadow-glass-inner
mb-6
```

Текст: `text-sm font-bold uppercase tracking-wider`
Цвет текста: `text-mu-blue` или `text-mu-accent-blue` или `text-mu-green-600` или `text-mu-text-900`
Иконка: `w-4 h-4`, цвет соответствует услуге

### Единый Section Title (gradient)

```html
<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
  <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
    {title}
  </span>
</h2>
```

Или mixed (часть текста обычная, часть gradient):
```html
<h2 className="text-5xl md:text-6xl font-extrabold mb-6">
  <span className="text-mu-text-900">Обычный текст </span>
  <span className="bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600 bg-clip-text text-transparent">
    gradient текст
  </span>
</h2>
```

### Единый паттерн Page Hero (подстраницы)

```
pt-32 pb-16 (вся страница)
section: container mx-auto px-4 lg:px-6 mb-16
grid lg:grid-cols-2 gap-12 items-center

Left:
  Badge → H1 (mixed plain + gradient) → P description → CTA button(s)

Right:
  Image в glass-frame (rounded-[3rem], border-[8px] white/40, shadow)
```

### Hover interaction patterns

Все карточки используют консистентные hover-эффекты:
- **Lift**: `translateY(-4px)` до `translateY(-8px)`
- **Glass intensify**: `bg-white/60` → `bg-white/70-80`, `border-white/60` → `border-white/80`
- **Shadow grow**: `shadow-glass` → `shadow-glass-lg`
- **Icon animate**: `scale(1.1) rotate(3deg)`, transition 500ms
- **Text color**: → `text-mu-blue`

### Transition defaults

```
transition-all duration-500  — карточки, иконки
transition-colors            — текст, ссылки
transition-transform         — стрелки в кнопках
transition-shadow            — тени кнопок
duration-700                 — масштабирование изображений
```

---

## 22. Hero Photo Composition (главная)

Многослойная композиция из 2 фотографий и 2 floating badges. Container: `relative lg:h-[600px]`.

### Main image (верхний правый)

```
absolute right-0 top-0
w-[85%] h-[85%]
rounded-[3rem] (48px)
overflow: hidden
border: 8px solid white/40
backdrop-blur-3xl
bg-white/20
shadow-glass-lg
z-10
img: object-cover object-center
gradient overlay: from-black/10 to-transparent (to top)
```

### Secondary image (нижний левый, перекрывает main)

```
absolute left-0 bottom-4
w-3/5 h-[45%]
rounded-[2.5rem] (40px)
overflow: hidden
border: 6px solid white/50
backdrop-blur-2xl
bg-white/30
shadow-glass-lg
z-20

animation: y 50→0, opacity 0→1, duration 0.8s, delay 0.7s
```

### Floating Badge — "500+ Врачей" (правый)

```
absolute -right-6 top-1/4
bg-white/70
backdrop-blur-[40px]
p-4
rounded-[2rem] (32px)
shadow-glass
border: border-glass-border-strong
z-30
flex items-center gap-4
hover: y -5px

Icon container:
  w-14 h-14
  bg-gradient-to-br from-mu-green-500 to-mu-green-600
  rounded-2xl (16px)
  text-white
  shadow-inner
  icon: Users w-7 h-7

Text:
  Number: text-2xl font-bold text-mu-text-900 tracking-tight
  Label: text-sm text-mu-text-700 font-semibold

animation: x 20→0, opacity 0→1, delay 0.9s
```

### Floating Badge — "4.9/5" Rating (левый верхний)

```
absolute left-8 top-12
bg-white/70
backdrop-blur-[40px]
px-6 py-4
rounded-[2rem] (32px)
shadow-glass
border: border-glass-border-strong
z-30
flex items-center gap-3
hover: y -5px

Stars: 5x Star w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-sm
Rating: font-extrabold text-mu-text-900 text-lg

animation: y -20→0, opacity 0→1, delay 1.1s
```

---

## 23. Hero Trust Indicators (главная)

```
flex items-center gap-8
text-base text-mu-text-700 font-semibold

Each:
  flex items-center gap-2
  CheckCircle2 w-5 h-5 text-mu-green-600
  <span>текст</span>

Values: "10 000+ пациентов", "Офис в Казахстане"

animation: opacity 0→1, delay 0.8s
```

---

## 24. Страница 404

```
pt-32 pb-16
min-h-[80vh]
flex items-center justify-center
text-center max-w-lg mx-auto px-4

"404":
  text-8xl font-extrabold
  bg-gradient-to-r from-mu-blue via-mu-accent-blue to-mu-green-600
  bg-clip-text text-transparent
  mb-6

H1: text-3xl font-extrabold text-mu-text-900 mb-4
P: text-mu-text-700 font-medium mb-8

CTA: gradient primary, px-8 py-4, rounded-3xl
  ArrowLeft w-5 h-5 (стрелка влево — "На главную")
  shadow-lg shadow-mu-blue/30
```

---

## 25. CSS Architecture (Tailwind v4)

### Файловая структура

```
src/styles/
  ├── fonts.css       — @font-face для SF Pro Display / Rounded
  ├── tailwind.css    — Tailwind entry: @import 'tailwindcss' source(none)
  │                     + @source '../**/*.{js,ts,jsx,tsx}'
  │                     + @import 'tw-animate-css'
  ├── theme.css       — CSS custom properties (:root), @theme inline, @layer base
  └── index.css       — imports: fonts → tailwind → theme (порядок важен!)
```

### Tailwind v4 конфигурация

```css
/* tailwind.css */
@import 'tailwindcss' source(none);
@source '../**/*.{js,ts,jsx,tsx}';    /* сканировать только src */
@import 'tw-animate-css';             /* анимации для shadcn/ui */
```

### @layer base defaults (theme.css)

```css
@layer base {
  * { @apply border-border outline-ring/50; }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-family-body);
  }
  html { font-size: var(--font-size); }  /* 16px */
  h1 { font-family: heading; font-size: --text-2xl; font-weight: 500; line-height: 1.5; }
  h2 { font-family: heading; font-size: --text-xl;  font-weight: 500; line-height: 1.5; }
  h3 { font-family: heading; font-size: --text-lg;  font-weight: 500; line-height: 1.5; }
  h4 { font-family: heading; font-size: --text-base; font-weight: 500; line-height: 1.5; }
  label  { font-size: --text-base; font-weight: 500; line-height: 1.5; }
  button { font-size: --text-base; font-weight: 500; line-height: 1.5; }
  input  { font-size: --text-base; font-weight: 400; line-height: 1.5; }
}
```

Примечание: эти базовые стили — дефолты. Все Tailwind-утилиты (text-5xl, font-extrabold и т.д.) автоматически переопределяют их через CSS specificity layers.

---

## 26. Routing / Карта страниц

```
/                              → HomePage (Layout wrapper)
/services/online-consultations → OnlineConsultationsPage
/services/treatment-abroad     → TreatmentAbroadPage
/services/checkups             → CheckupsPage
/contacts                     → ContactsPage
*                              → NotFoundPage (404)
```

Layout оборачивает все страницы: Header + <Outlet /> + Footer + Liquid Mesh Background.
ScrollToTop на каждую смену pathname.

### Секции главной (HomePage) в порядке:

1. **Hero** — заголовок, CTA, photo composition, trust indicators
2. **StatsSection** — 4 счётчика (43 клиники, 11 стран, 500+ врачей, 15+ лет)
3. **ServicesSection** — 3 карточки услуг с изображениями
4. **GuideSection** — "Не знаете, с чего начать?" — 3 навигационные карточки
5. **WhyUsSection** — "Почему MedicusUnion" — 4 advantage cards + image collage
6. **ContactSection** — форма + координатор + trust chips
7. **CTASection** — финальный баннер с изображением и 2 кнопками

---

## 27. Accessibility (WCAG 2.1 AA)

### Контрастные требования

| Тип текста | Минимальный ratio | Правило |
|------------|:-:|---|
| Normal text (< 18.66px bold / < 24px regular) | **4.5:1** | Используй `*-text` варианты цветов |
| Large text (>= 18.66px bold / >= 24px regular) | **3.0:1** | Допустим `--mu-accent-blue` (#4F84E8, ratio 3.5) |
| UI components (borders, icons) | **3.0:1** | Оригинальные яркие цвета допустимы |
| Decorative | — | Gradient text при extrabold 48px+ — допустим как decorative |

### Таблица контрастов (vs #FBFBFB background)

| Цвет | HEX | Ratio | Normal | Large | Использование |
|------|-----|:-----:|:------:|:-----:|---|
| `mu-text-900` | `#1B212C` | 12.62 | PASS | PASS | Заголовки, основной текст |
| `mu-text-700` (new) | `#4A4E5C` | 5.89 | PASS | PASS | Описания, вторичный текст |
| `mu-text-500` (new) | `#6B6F80` | 4.50 | PASS | PASS | Placeholder, caption |
| `mu-blue-text` | `#0E8FB5` | 4.51 | PASS | PASS | Ссылки, акцентный текст |
| `mu-accent-blue-text` | `#3B6DD0` | 4.58 | PASS | PASS | Badge text, stat numbers |
| `mu-accent-teal-text` | `#3D7E7A` | 4.52 | PASS | PASS | Treatment abroad text |
| `mu-accent-orange-text` | `#B5621D` | 4.53 | PASS | PASS | Checkup text |
| `mu-green-text` | `#1F7A4F` | 4.60 | PASS | PASS | Checkmarks, green text |
| `mu-accent-red` | `#F50057` | 4.94 | PASS | PASS | Error messages (OK as-is) |
| White on CTA (new gradient) | `#0E8FB5→#3B6DD0` | 4.5+ | PASS | PASS | CTA button text |

### Focus States

Все интерактивные элементы MUST включать:

```css
focus-visible:ring-2
focus-visible:ring-[var(--mu-blue-text)]
focus-visible:ring-offset-2
focus-visible:outline-none
```

Применяется к: buttons, links, inputs, selects, textareas, interactive cards, mobile menu toggle.

### Keyboard Navigation

- **Tab** — перемещение между интерактивными элементами
- **Enter/Space** — активация кнопок и ссылок
- **Escape** — закрытие мобильного меню
- Cards с `onClick` — должны быть `role="link"` с `tabIndex={0}` и `onKeyDown={Enter}`

### ARIA

- Form inputs: `aria-required`, `aria-invalid`, `aria-describedby` (для error messages)
- Mobile menu: `aria-expanded`, `aria-label="Toggle menu"`
- Success overlay: `role="alert"`, `aria-live="polite"`
- Images: descriptive `alt` text (не generic "Doctor smiling")
- Navigation: `nav` with `aria-label="Main navigation"`

### Touch Targets

Минимум 44x44px для мобильных:
- Кнопки py-4 (56px) — OK
- Nav links — добавить `py-2 px-3` для увеличения touch area
- Icon buttons `p-2` (40px) — увеличить до `p-2.5` (44px)

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 28. Новые CSS-переменные (добавить в theme.css :root)

```css
:root {
  /* Accessible text variants */
  --mu-blue-text: #0E8FB5;
  --mu-accent-blue-text: #3B6DD0;
  --mu-accent-teal-text: #3D7E7A;
  --mu-accent-orange-text: #B5621D;
  --mu-green-text: #1F7A4F;

  /* Updated neutrals (darker for AA compliance) */
  --mu-text-700: #4A4E5C;    /* was #63687A */
  --mu-text-500: #6B6F80;    /* was #A4A8B5 */

  /* Accessible CTA gradient */
  --mu-cta-from: #0E8FB5;
  --mu-cta-to: #3B6DD0;

  /* Standardized form shadow */
  --shadow-form-inset: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}
```

И в `@theme inline`:
```css
@theme inline {
  --color-mu-blue-text: var(--mu-blue-text);
  --color-mu-accent-blue-text: var(--mu-accent-blue-text);
  --color-mu-accent-teal-text: var(--mu-accent-teal-text);
  --color-mu-accent-orange-text: var(--mu-accent-orange-text);
  --color-mu-green-text: var(--mu-green-text);
  --color-mu-cta-from: var(--mu-cta-from);
  --color-mu-cta-to: var(--mu-cta-to);
  --shadow-form-inset: var(--shadow-form-inset);
}
```

---

## 29. Известные проблемы и стандартизация (из аудита)

### Hardcoded значения (заменить на токены)

| Файл | Строки | Проблема | Замена |
|------|--------|----------|--------|
| ContactsPage.tsx | 155, 160, 165, 178 | `shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]` | `shadow-form-inset` |
| Hero.tsx | 71 | `backdrop-blur-[20px]` | `backdrop-blur-xl` |
| WhyUsSection.tsx | 29 | `rounded-[1.5rem]` (one-off) | `rounded-2xl` (16px, ближайший стандарт) |

### Animation inconsistencies (стандартизировать)

| Файл | Строка | Проблема | Канон |
|------|--------|----------|-------|
| GuideSection.tsx | 29 | `duration: 0.7` | `duration: 0.8` |
| CTASection.tsx | 47, 57 | `scale: 1.05` | `scale: 1.02` |
| Hero.tsx | 156 | `text-amber-400` (нет токена) | Допустимо для star rating; опционально добавить `--mu-star-color` |
| ContactsPage.tsx | 139 | Spring без `stiffness: 200` | Добавить `stiffness: 200` (как в ContactSection.tsx:125) |

### Typography inconsistencies (стандартизировать)

| Файл | Строка | Проблема | Канон |
|------|--------|----------|-------|
| Hero.tsx | 24 | Badge: `font-semibold` (600) | `font-bold` (700), как на подстраницах |
| GuideSection.tsx | 93 | Section title: `font-bold` (700) | `font-extrabold` (800), как все остальные H2 |

### Padding variants (документировано как intentional)

| Контекст | Padding | Статус |
|----------|---------|--------|
| Section badge | `px-5 py-2.5` | Standard |
| Card badge (price) | `px-4 py-1.5` | Standard (smaller) |
| Specialization chip | `px-6 py-3` | Standard (larger, clickable) |
| Feature card | `p-8` | Standard |
| Small card (contact method) | `p-6` | Standard (compact) |
| Container (footer, form) | `p-12` | Standard (spacious) |
| Guide card outer | `p-3` | Standard (image padding frame) |

### Missing component states

| Компонент | Missing | Priority |
|-----------|---------|:--------:|
| All buttons | `focus-visible` ring | CRITICAL |
| All buttons | `disabled` state | HIGH |
| Form inputs | `disabled` visual | HIGH |
| Form inputs | Error border + message | HIGH |
| Interactive cards | `focus-visible` for keyboard | HIGH |
| Select | Custom dropdown arrow | MEDIUM |
| Nav links | `aria-current="page"` indicator | MEDIUM |
| Subpages | Breadcrumb navigation | MEDIUM |
