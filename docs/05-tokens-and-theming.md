---
title: Tokens & Theming
description: Fluid Utopia scales, the strict 21-variable color contract, concentric radii, and light/dark modes.
---

# Tokens & Theming

All literal CSS values in `fractalstyler2` live inside `_00_tokens.sass`. Components and mixins never hardcode hexes, raw pixel font sizes, or ad-hoc variables — they strictly reference the token scale.

---

## 1. The Strict 21-Token Contract

The color palette is locked to 21 semantic variables defined on `:root` and `[data-mode]`:

| Category | Token Variable | Purpose |
|---|---|---|
| **Base Surface** | `--bg` | Application background (light: `#fdfefe`, dark: `#0E1118`) |
| **Card Surface** | `--bg-surface` | Default card & container material |
| **Elevated Surface** | `--bg-raised` | Hover states, pill tracks, badge backgrounds |
| **Panel Surface** | `--bg-panel` | Sidebars, drawers, toolbars |
| **Footer Surface** | `--bg-footer` | Pinned application and page footers |
| **Flyout Surfaces** | `--bg-popover`, `--bg-dialog` | Dropdown menus, modals, and tooltips |
| **Specialty Surfaces** | `--bg-terminal`, `--bg-input`, `--bg-canvas` | Code editors, form textfields, canvas backgrounds |
| **Typography** | `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse` | 4-tier ink hierarchy |
| **Interactive States** | `--state-hover`, `--state-hover-subtle`, `--state-selected` | Interaction backgrounds and selected row highlights |
| **Borders & Accents** | `--border`, `--border-subtle`, `--theme-color`, `--theme-color-alt` | Borders, subtle dividers, and primary brand accents |

> [!CAUTION]
> **No Foreign Token Variables**:
> Never introduce ad-hoc variables like `--card`, `--primary`, or `--border-strong`. All components must consume the 21-token contract.

---

## 2. Fluid Utopia Typography & Spacing

Type and space scales use fluid `clamp()` formulas mapped from 360px to 1240px viewports:

```sass
// Fluid Type
--text-xs: 0.75rem
--text-sm: clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem)
--text-md: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)
--text-lg: clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem)
--text-xl: clamp(1.62rem, 1.4837rem + 0.6057vw, 1.9531rem)
--text-2xl: clamp(1.944rem, 1.7405rem + 0.9044vw, 2.4414rem)
--text-3xl: clamp(2.3328rem, 2.0387rem + 1.3072vw, 3.0518rem)

// Fluid Spacing
--space-3xs: 0.3125rem
--space-2xs: clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem)
--space-xs:  clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem)
--space-s:   clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)
--space-m:   clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem)
--space-l:   clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem)
--space-xl:  clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem)
```

---

## 3. Concentric Radius Scale

The design system enforces concentric geometric nesting:
- Outer Cards & Panels: `radius(6)` (6px)
- Inner Interactive Controls & Inputs: `radius(4)` (4px)
- Inner Keycaps & Badges: `radius(3)` (3px)
- Micro Indicators: `radius(2)` (2px)
- Full Pills: `radius(full)` (9999px)

---

## 4. Color Mode Switching

Light mode is the SSR-safe default. Dark mode activates automatically via `prefers-color-scheme: dark` or with an explicit `data-mode` attribute:

```svelte
<script lang="ts">
	import { toggleMode, setMode } from 'fractalstyler2';
</script>

<button class="button ghost text-xs" onclick={toggleMode}>
	Toggle Theme
</button>
```
