---
title: Utilities Reference
description: Complete reference of generated 1:1 atomic markup classes, directional padding, margins, and responsive visibility.
---

# Utilities Reference

Utility classes in `_09_utilities.sass` are direct 1:1 projections of atom and molecule fractals. Because `_09_utilities.sass` is loaded after `_08_blocks.sass` in `index.sass`, utility classes override component styles without specificity conflicts.

---

## 1. Flow & Flexbox

```svelte
<!-- Vertical Flexbox Stack -->
<div class="box gap-s">...</div>

<!-- Horizontal Flexbox Row -->
<div class="row ycenter xbetween gap-xs">...</div>

<!-- Wrapping Row for Badges & Buttons -->
<div class="row wrap ycenter gap-2xs">...</div>

<!-- Dead Center Child -->
<div class="center hfull">...</div>
```

### Alignment Modifiers
- **Box Axis Modifiers**: `.box.xcenter`, `.box.xleft`, `.box.xright`, `.box.ycenter`, `.box.ytop`, `.box.ybot`, `.box.ybetween`, `.box.yevenly`
- **Row Axis Modifiers**: `.row.ycenter`, `.row.ytop`, `.row.ybot`, `.row.xbetween`, `.row.xevenly`, `.row.xleft`, `.row.xright`

---

## 2. Spacing & Directional Padding

All spacing classes map to fluid Utopia steps (`3xs`, `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl`, `s-l`):

| Class Pattern | Shorthand | What It Applies |
|---|---|---|
| `.gap-#{$s}` | — | `gap: var(--space-#{$s})` |
| `.pad-#{$s}` | — | `padding: var(--space-#{$s})` |
| `.px-#{$s}` | — | `padding-inline: var(--space-#{$s})` |
| `.py-#{$s}` | — | `padding-block: var(--space-#{$s})` |
| `.pad-top-#{$s}` | `.pt-#{$s}` | `padding-top: var(--space-#{$s})` |
| `.pad-bottom-#{$s}` | `.pb-#{$s}` | `padding-bottom: var(--space-#{$s})` |
| `.pad-left-#{$s}` | `.pl-#{$s}` | `padding-left: var(--space-#{$s})` |
| `.pad-right-#{$s}` | `.pr-#{$s}` | `padding-right: var(--space-#{$s})` |
| `.m-#{$s}` | — | `margin: var(--space-#{$s})` |
| `.mt-#{$s}` | `.margin-top-#{$s}` | `margin-top: var(--space-#{$s})` |
| `.mb-#{$s}` | `.margin-bottom-#{$s}` | `margin-bottom: var(--space-#{$s})` |
| `.mx-#{$s}` / `.my-#{$s}` | — | `margin-inline` / `margin-block` |
| `.mx-auto` / `.my-auto` | — | `margin-inline: auto` / `margin-block: auto` |

---

## 3. Surface & Borders

- **Surfaces**: `.bg-bg`, `.bg-surface`, `.bg-raised`, `.bg-panel`, `.bg-footer`, `.bg-popover`, `.bg-dialog`, `.bg-terminal`, `.bg-input`, `.bg-canvas`
- **Borders**: `.border`, `.border-top`, `.border-bottom`, `.border-left`, `.border-right`
- **Radius**: `.radius-0`, `.radius-2`, `.radius-3`, `.radius-4`, `.radius-6`, `.radius-full`
- **Shadow**: `.shadow-sm`, `.shadow-md`, `.shadow-lg`

---

## 4. Typography & Clamping

- **Text Scale**: `.text-xs`, `.text-sm`, `.text-md`, `.text-lg`, `.text-xl`, `.text-2xl`, `.text-3xl`, `.text-4xl`
- **Font Weights**: `.weight-400`, `.weight-500`, `.weight-600`, `.weight-700`
- **Semantic Text**: `.muted` (secondary ink), `.eyebrow` (uppercase tracking header)
- **Clamping**: `.truncate` (single line ellipsis), `.clamp-1`, `.clamp-2`, `.clamp-3`

---

## 5. Sizing & Overflow

- `.wfull` / `.hfull` / `.full` — 100% width and height
- `.grow` / `.shrink-0` — Flex grow and shrink prevention
- `.min0` — Zero minimum dimension to prevent flex and grid child overflow
- `.overflow-hidden` / `.cursor-pointer` / `.block` / `.relative` / `.absolute`

---

## 6. Responsive Visibility

- `.hide-desktop`: Hidden at viewports $\ge 1024\text{px}$ (`display: none !important`). Use on mobile drawer triggers and mobile topbars.
- `.hide-mobile`: Hidden at viewports $< 1024\text{px}$ (`display: none !important`).
- `.only-mobile`: Explicitly visible on mobile only.
