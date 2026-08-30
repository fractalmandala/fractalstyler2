---
id: 06-containers
title: Containers & Flow
type: design
tags: [containers, flow, flexbox, grid, alignment, positioning, l2]
summary: Reference guide for Level 2 container fractals (.box, .row, .grid) and the physical X/Y axis alignment universe.
updated: 2026-08-30
---

Level 2 (L2) fractals provide structure and flow for web interfaces. In Fractalstyler2, 90% of layout composition relies on three core container primitives: `.box` (vertical flex column), `.row` (horizontal flex row), and `.grid` (CSS grid).


## 1. The Core Primitives

```html
<!-- Vertical Stack -->
<div class="box gap-md">
  <h2>Settings</h2>
  <p class="text-secondary">Manage your preferences.</p>
</div>

<!-- Horizontal Row -->
<div class="row ycenter xbetween gap-sm">
  <span class="text-sm weight-500">Status</span>
  <span class="badge">Active</span>
</div>

<!-- Grid Matrix -->
<div class="grid center pad-lg">
  <span class="badge">Centred</span>
</div>
```

| Class | Display Mode | Flex / Grid Direction | Primary Use Case |
|:---|:---|:---|:---|
| `.box` | `display: flex` | `flex-direction: column` | Vertical stacks, card contents, forms, sidebars |
| `.row` | `display: flex` | `flex-direction: row` | Toolbars, navigation bars, badge clusters, inline fields |
| `.grid` | `display: grid` | Matrix layout | Tabular items, dead-centered overlays, matrix cards |

---

## 2. Physical Alignment Contract

Alignment classes strictly adhere to **physical axes**, eliminating the mental overhead of switching between flexbox main-axis and cross-axis terms (`justify-content` vs `align-items`):

- **`x*` classes ALWAYS control the horizontal (X) axis.**
- **`y*` classes ALWAYS control the vertical (Y) axis.**

Alignment classes are nested under their base containers and must be composed directly on the container element:

### Horizontal Alignment (`x*`)

| Class | Behavior in `.box` (Column) | Behavior in `.row` (Row) | Behavior in `.grid` |
|:---|:---|:---|:---|
| `.xleft` | `align-items: flex-start` | `justify-content: flex-start` | `justify-items: start` |
| `.xcenter` | `align-items: center` | `justify-content: center` | `justify-items: center` |
| `.xright` | `align-items: flex-end` | `justify-content: flex-end` | `justify-items: end` |
| `.xbetween` | — | `justify-content: space-between` | `justify-content: space-between` |
| `.xevenly` | — | `justify-content: space-evenly` | `justify-content: space-evenly` |
| `.xaround` | — | `justify-content: space-around` | `justify-content: space-around` |
| `.xstretch` | `align-items: stretch` | — | `justify-items: stretch` |

### Vertical Alignment (`y*`)

| Class | Behavior in `.box` (Column) | Behavior in `.row` (Row) | Behavior in `.grid` |
|:---|:---|:---|:---|
| `.ytop` | `justify-content: flex-start` | `align-items: flex-start` | `align-items: start` |
| `.ycenter` | `justify-content: center` | `align-items: center` | `align-items: center` |
| `.ybot` | `justify-content: flex-end` | `align-items: flex-end` | `align-items: end` |
| `.ybetween` | `justify-content: space-between` | — | `align-content: space-between` |
| `.yevenly` | `justify-content: space-evenly` | — | `align-content: space-evenly` |
| `.yaround` | `justify-content: space-around` | — | `align-content: space-around` |
| `.ystretch` | — | `align-items: stretch` | `align-items: stretch` |

### Dead Centering (`.center`)
When using `.grid`, `.grid.center` applies `place-items: center` to dead-center children horizontally and vertically with a single class.

---

## 3. Flex Flow & Positioning Primitives

Fractalstyler2 includes lightweight layout flow modifiers to control wrapping, expansion, and positioning:

```html
<!-- Breadcrumb Bar with Auto-Growing Search -->
<header class="row wrap ycenter gap-xs pad-x-sm border-bottom">
  <div class="row ycenter gap-2xs shrink-0">
    <a href="/dashboard" class="link">Home</a>
    <span class="text-muted">/</span>
    <span class="text-primary">Projects</span>
  </div>
  
  <input type="search" class="input grow min0" placeholder="Search..." />
  
  <button class="button primary shrink-0">New</button>
</header>
```

| Class | CSS Definition | Purpose |
|:---|:---|:---|
| `.wrap` | `flex-wrap: wrap` | Allows flex items to wrap across multiple lines |
| `.grow` | `flex: 1 1 0%` | Expands item to fill available flex space |
| `.shrink-0` | `flex-shrink: 0` | Prevents icons, buttons, or badges from shrinking |
| `.relative` | `position: relative` | Establishes local positioning coordinate context |
| `.absolute` | `position: absolute` | Positions element relative to nearest positioned ancestor |
| `.fixed` | `position: fixed` | Positions element relative to viewport |
| `.sticky` | `position: sticky` | Sticks element during scrolling |

[Next - Layouts](./07-layouts.md)