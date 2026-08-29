---
title: Tokens & Theming
description: Fluid Utopia scales, the strict 21-variable color contract, concentric radii, and light/dark modes.
---

# Tokens & Theming in fractalstyler2

All literal values in `fractalstyler2` live inside `_00_tokens.sass`. Components and mixins never hardcode hex colors, arbitrary pixel font sizes, or ad-hoc variables — they strictly resolve from the centralized token scale.

---

## 1. The Full 30-Token Semantic Contract

The system defines 30 semantic CSS custom properties across 6 core categories. Every theme in `fractalthemer` maps 1:1 onto these exact token variables:

| Category | Token Variable | Purpose | Light Default | Dark Default |
| :--- | :--- | :--- | :--- | :--- |
| **Base Surface** | `--bg` | Application canvas backdrop | `#fdfefe` | `#0E1118` |
| **Card Surface** | `--bg-surface` | Primary card and container material | `#f8f7f7` | `#141824` |
| **Elevated Surface** | `--bg-raised` | Hover states, pill tracks, badge surfaces | `#f1f5f9` | `#1C2232` |
| **Panel Surface** | `--bg-panel` | Sidebars, drawers, toolbars, headers | `#F1F3F5` | `#101420` |
| **Footer Surface** | `--bg-footer` | Pinned application and page footers | `#E9ECEF` | `#0B0D14` |
| **Flyout Surfaces** | `--bg-popover`, `--bg-dialog` | Dropdown menus, modals, dialog cards | `#FFFFFF` | `#20273A` |
| **Specialty Surfaces** | `--bg-terminal`, `--bg-input`, `--bg-canvas` | Code blocks, form inputs, outer canvas | `#0F172A`, `#FFF`, `#F8F9FA` | `#080A0F`, `#121622`, `#0E1118` |
| **Typography** | `--text-primary` | Headings, titles, high-contrast ink | `#0f172a` | `#EDF2F7` |
| | `--text-secondary` | Body paragraphs, descriptions, labels | `#5b6472` | `#9BB0C7` |
| | `--text-muted` | Captions, timestamps, metadata | `#929497` | `#5D7087` |
| | `--text-inverse` | Contrast text on solid brand buttons | `#ffffff` | `#0E1118` |
| **Borders** | `--border` | Primary borders, card outlines, separators | `#E2E8F0` | `#28324A` |
| | `--border-subtle` | Faint dividers, table rows, inner items | `#EDF2F7` | `#1E2538` |
| **Brand Accent** | `--theme-color` (`--theme-color`) | Primary action color, active tabs, badges | `#04825B` | `#38BDF8` |
| | `--theme-color-alt` (`--theme-color-alt`) | Hover state for primary action buttons | `#047857` | `#0EA5E9` |
| | `--ring` | Visible focus outline ring | `rgba(0,127,78,0.35)` | `rgba(16,185,129,0.4)` |
| **Status Feedback** | `--success`, `--success-hover` | Success states, confirmed badges | `#10B981`, `#059669` | `#34D399`, `#6EE7B7` |
| | `--warning`, `--warning-hover` | Warning alerts, pending states | `#F59E0B`, `#D97706` | `#FBBF24`, `#FCD34D` |
| | `--danger`, `--danger-hover` | Destructive buttons, error alerts | `#EF4444`, `#DC2626` | `#F87171`, `#FCA5A5` |
| | `--info`, `--info-hover` | Information callouts, notifications | `#3B82F6`, `#2563EB` | `#60A5FA`, `#93C5FD` |
| | `--feedback-error` | Form validation error text and outlines | `#DC2626` | `#F87171` |

---

## 2. Universal Token Resolver (`tok()`)

`fractalstyler2` provides a single universal Sass function `@function tok($group, $v)` in `_01_config.sass` that powers all domain-specific resolvers:

```sass
// Universal Token Resolver in _01_config.sass
@function tok($group, $v)
	@if $v == null
		@return null
	@if meta.type-of($v) == number and math.is-unitless($v)
		@return #{$v}px
	@if meta.type-of($v) == string and not (math.unit($v) != '')
		@return var(--#{$group}-#{$v})
	@return $v

// Domain helper functions:
@function space($v)    // space(m) -> var(--space-m) | space(16) -> 16px
@function radius($v)   // radius(4) -> var(--radius-4) | radius(full) -> var(--radius-full)
@function text-size($v)// text-size(sm) -> var(--text-sm)
@function shadow($v)   // shadow(md) -> var(--shadow-md)
@function surface($v)  // surface(raised) -> var(--bg-raised)
@function ink($v)      // ink(primary) -> var(--text-primary)
```

### Usage Example in Custom Components
```sass
@use 'fractalstyler2/styles' as *

.my-custom-panel
	background: surface(raised)      // resolves to var(--bg-raised)
	color: ink(primary)              // resolves to var(--text-primary)
	padding: space(m) space(l)       // resolves to var(--space-m) var(--space-l)
	border-radius: radius(6)         // resolves to var(--radius-6)
	box-shadow: shadow(md)           // resolves to var(--shadow-md)
```

---

## 3. Concentric Geometric Radius Hierarchy

The system strictly enforces concentric nesting: child elements inside containers must have proportionally smaller corner radii to avoid optical corner collisions.

```
Outer Modal Dialog (radius-6 / 6px)
  └── Inner Input Control (radius-4 / 4px)
        └── Keycap / Chip (radius-3 / 3px)
```

- `--radius-0`: `0`
- `--radius-2`: `2px` (Micro tags, dots)
- `--radius-3`: `3px` (Keycaps, mini chips)
- `--radius-4`: `4px` (Buttons, form inputs, select boxes)
- `--radius-6`: `6px` (Cards, panels, modal dialogs)
- `--radius-8`: `8px`
- `--radius-12`: `12px`
- `--radius-16`: `16px`
- `--radius-24`: `24px`
- `--radius-full`: `9999px` (Pills, circular avatars)

---

## 4. Fluid Typography & Spacing (Utopia Curves)

All type and space scales use fluid viewport formulas interpolating smoothly between 360px (mobile) and 1240px (desktop):

### Typography Steps
```sass
--text-xs:  0.75rem                                       // 12px
--text-sm:  clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem)   // 15px - 16px
--text-md:  clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)// 18px - 20px
--text-lg:  clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem)// 21.6px - 25px
--text-xl:  clamp(1.62rem, 1.4837rem + 0.6057vw, 1.9531rem)// 26px - 31.25px
--text-2xl: clamp(1.944rem, 1.7405rem + 0.9044vw, 2.4414rem)// 31.1px - 39px
--text-3xl: clamp(2.3328rem, 2.0387rem + 1.3072vw, 3.0518rem)// 37.3px - 48.8px
--text-4xl: clamp(2.7994rem, 2.384rem + 1.8461vw, 3.8147rem)// 44.8px - 61px
```

### Spacing Steps
```sass
--space-3xs: clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem) // 5px
--space-2xs: clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem) // 9px - 10px
--space-xs:  clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem) // 14px - 15px
--space-s:   clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem) // 18px - 20px
--space-m:   clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem) // 27px - 30px
--space-l:   clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem) // 36px - 40px
--space-xl:  clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem) // 54px - 60px
--space-2xl: clamp(4.5rem, 4.2955rem + 0.9091vw, 5rem) // 72px - 80px
--space-3xl: clamp(6.75rem, 6.4432rem + 1.3636vw, 7.5rem) // 108px - 120px
```

---

## 5. Seamless Integration with `fractalthemer`

`fractalstyler2` provides the static CSS contract and mixin scaffolding; `fractalthemer` provides the dynamic runtime engine.

### Zero-JS Baseline
With JavaScript disabled or before hydration, `_00_tokens.sass` renders `=light-theme-tokens` by default, or `=dark-theme-tokens` when `@media (prefers-color-scheme: dark)` is active.

### Dynamic Runtime State
When `fractalthemer` is installed, `themeState.apply(themeId)` dynamically writes the full token dictionary to `document.documentElement.style`, instantly updating all `fractalstyler2` components across:
- Dark/Light mode flipping (`[data-mode='dark']`, `[data-mode='light']`)
- Preset color families (`theme-night-dark`, `theme-frozen-dark`, `theme-nord-dark`, etc.)
- User-customized accent colors (`--theme-color`, `--theme-color-alt`)
- GPU Atmospheric Shaders (`[data-bg-style='aura']`, `[data-bg-style='gradient']`, `[data-bg-style='pattern']`)
