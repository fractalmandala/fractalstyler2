---
title: Migration & Breaking Changes (from fractals-styler v1)
description: Comprehensive catalog of breaking changes, removed JIT classes, renamed primitives, and migration strategies when upgrading from fractals-styler (v1) to fractalstyler2.
---

# Migration & Breaking Changes (v1 → v2)

This guide documents every breaking change, removed class, and behavioral difference between the legacy **`fractals-styler` (v1)** and the modern **`fractalstyler2` (v2)** architecture.

---

## 1. Paradigm Shift: JIT Virtual CSS vs. Pure SASS Composition

The primary architectural shift between v1 and v2 is the elimination of the runtime/build-time JIT class scanner:

- **In `fractals-styler` (v1):** A Vite plugin (`fractalsStyler()`) scanned markup files for arbitrary regex patterns (such as `gap18`, `pad22`, `pad12-sm`) and generated dynamic CSS rules injected into a virtual module (`virtual:fractals-styler.css`).
- **In `fractalstyler2` (v2):** There is **no Vite JIT scanner or virtual CSS**. The system is 100% standard SASS mixins ("fractals") and a fixed, token-derived static utility projection (`_utilities.sass`).

Because there is no dynamic class scanner in v2, **any class that was previously generated on-the-fly by JIT will not exist in v2 markup.**

---

## 2. Dynamic JIT Classes (Removed in v2)

In v1, numerical classes could be typed arbitrarily into HTML. In v2, numerical values belong in SASS mixins or should use the token-based T-shirt scale in markup.

| v1 Dynamic Pattern | Examples | v2 Status | v2 Replacement |
| :--- | :--- | :--- | :--- |
| **`gap{N}`** | `gap0`, `gap8`, `gap16`, `gap24` | ❌ **Broken** | Markup: `.gap-xs`, `.gap-s`, `.gap-m`<br>SASS: `+gap(8)` or `+gap(s)` |
| **`pad{N}`** | `pad0`, `pad8`, `pad16`, `pad22` | ❌ **Broken** | Markup: `.pad-xs`, `.pad-s`, `.pad-m`<br>SASS: `+pad(16)` or `+pad(m)` |
| **`padtop{N}` / `padbot{N}`** | `padtop12`, `padbot20` | ❌ **Broken** | Markup: `.py-s`, `.py-m`<br>SASS: `+py(s)` or `padding-block: ...` |
| **`padleft{N}` / `padright{N}`** | `padleft16`, `padright16` | ❌ **Broken** | Markup: `.px-s`, `.px-m`<br>SASS: `+px(s)` or `padding-inline: ...` |
| **`margin{N}`** | `margin10`, `margin20` | ❌ **Broken** | Manage via container `+gap(...)` or explicit SASS margin |
| **`margintop{N}` / `marginbot{N}`** | `margintop16`, `marginbot24` | ❌ **Broken** | Manage via container `+gap(...)` or explicit SASS margin |
| **`marginleft{N}` / `marginright{N}`** | `marginleft8`, `marginright8` | ❌ **Broken** | SASS: `+mx-auto` or parent `+gap(...)` |
| **`cgap{N}` / `rgap{N}`** | `cgap8`, `rgap12` | ❌ **Broken** | SASS: `+gap(...)` or `column-gap` / `row-gap` |
| **`width{N}` / `height{N}`** | `width320`, `height200` | ❌ **Broken** | Markup: `.wfull`, `.hfull`<br>SASS: `+w(320px)`, `+h(200px)` |
| **`minw{N}` / `maxw{N}`** | `minw200`, `maxw600` | ❌ **Broken** | SASS: `min-width: 200px` or `+center-column(600px)` |
| **`minh{N}` / `maxh{N}`** | `minh100`, `maxh400` | ❌ **Broken** | SASS: `min-height: 100px` |
| **Breakpoint Suffixes (`.*-sm`, `.*-md`, `.*-lg`, `.*-xl`)** | `pad12-sm`, `row-md`, `wfull-lg`, `gap16-xl` | ❌ **Broken** | SASS: `+at(md)`, `+until(lg)`, or `+cols((base: 1, sm: 2, lg: 3))` |

---

## 3. Layout & Composition Primitives (Breaking Behavioral Shifts)

In v1, Every-Layout compositions (`stack`, `cluster`, `reel`, etc.) were shipped as global utility classes. In v2, compositions are **SASS Mixins (Molecules)** to prevent CSS bloat and enforce clean separation of concerns.

> [!WARNING]
> **Critical Change: `.center`**
> In v1, `.center` formatted a **reading column** bounded by a max-width (`max-width: 60ch; margin-inline: auto`).
> In v2, `.center` is a **dead-centering grid utility** (`display: grid; place-items: center`).
> If you used `<div class="center">` for reading content, replace it with the SASS mixin `+center-column` or component styling.

| Primitive / Class | v1 Behavior | v2 Behavior | Migration Guide |
| :--- | :--- | :--- | :--- |
| **`.center`** | Reading column (`max-width: 60ch; margin: auto`) | Dead-center utility (`display: grid; place-items: center`) | ⚠️ **Use `+center-column` in SASS for text reading measures.** |
| **`.stack`** | Global class (`flex-direction: column; gap: var(--stack-gap)`) | **SASS mixin only (`+stack(gap, align)`)** | ❌ No markup class `.stack`. Use `+stack(s)` in `<style lang="sass">`. |
| **`.cluster`** | Global class (`flex-wrap: wrap; gap: var(--cluster-gap)`) | **SASS mixin only (`+cluster(gap, align, justify)`)** | ❌ No markup class `.cluster`. Use `+cluster(xs)` in SASS. |
| **`.reel`** | Global class for horizontal snap-scrolling | **SASS mixin only (`+reel(gap)`)** | ❌ Use `+reel(s)` in SASS. |
| **`.cover`** | Global class for full-height centered layout | **SASS mixin only (`+cover(min, pad)`)** | ❌ Use `+cover(80vh, xl)` in SASS or the `.hero` layout template. |
| **`.frame`** | Global class with `data-ratio="..."` attribute selector | **SASS mixin only (`+frame(ratio)`)** | ❌ Use `+frame(16/9)` in SASS. |
| **`.switcher`** | Algorithmic flex-wrapping container | **Removed** | ❌ Replace with `+auto-grid(...)` or `+cols(...)`. |
| **`.with-sidebar`** | Global class with `.rail` and `.flow` children | **SASS mixin only (`+with-sidebar(...)`)** | ❌ Use `+with-sidebar(240px, s)` in SASS or use `.docs` / `.holy-grail`. |
| **`.auto-grid`** | Global class for auto-fitting CSS grids | **SASS mixin (`+auto-grid`)** + **`.card-grid` layout** | Use `.card-grid` markup class or `+auto-grid(16rem, m)` in SASS. |

---

## 4. App Shell & Layout Templates

Layout patterns have been formalized into dedicated, production-tested templates in `_layouts.sass`:

| Feature | v1 (Legacy) | v2 (fractalstyler2) | Details |
| :--- | :--- | :--- | :--- |
| **App Shell** | `.appshell`, `.appheader`, `.appbody`, `.appfooter`, `.body-main` | `.app-shell`, `> .app-header`, `> .app-main`, `> .app-footer` | Hyphenated naming; sub-elements must be direct descendants. |
| **Three-Column / Holy Grail** | `.appbody` + `[data-left]` + `[data-right]` + `.sidebar-left/right` | `.holy-grail`, `> .hg-header`, `> .hg-nav`, `> .hg-body`, `> .hg-aside`, `> .hg-footer` | Dedicated grid layout that handles responsive sidebars cleanly at `lg` breakpoint. |
| **Documentation Layout** | Custom implementation | `.docs`, `> .docs-nav`, `> .docs-main`, `> .docs-toc` | Built-in responsive docs template with sticky left navigation and right on-page TOC. |
| **Responsive Grid** | `.grid.grid-cols-*` | `.grid-3` (`+cols((base: 1, sm: 2, lg: 3), m)`) | Responsive 1 → 2 → 3 column reflow across breakpoints. |

---

## 5. Static Utility Classes (Renamed, Removed, or Replaced)

### Sizing Utilities

| v1 Class | v2 Status | v2 Replacement |
| :--- | :--- | :--- |
| `.w100` | ❌ Removed | Use `.wfull` |
| `.h100` | ❌ Removed | Use `.hfull` |
| `.w100vw`, `.h100vh` | ❌ Removed | Use `+w(100vw)`, `+h(100vh)` in SASS |
| `.min-w-0`, `.min-h-0` | ❌ Removed | Use `.min0` (sets both `min-width: 0` and `min-height: 0`) |
| `.shrink-0` | ❌ Removed from utilities | Use `+shrink(0)` in SASS |

### Grid Utilities

| v1 Class | v2 Status | v2 Replacement |
| :--- | :--- | :--- |
| `.grid` | ❌ Removed as standalone utility | Use `.grid-cols-1` … `.grid-cols-6` directly |
| `.col-span-2` … `.col-span-6` | ❌ Removed from utilities | Use `grid-column: span N` in SASS |
| `.row-span-2` … `.row-span-6` | ❌ Removed from utilities | Use `grid-row: span N` in SASS |

### Alignment & Axis Modifiers

| v1 Class | v2 Status / Behavior | Notes |
| :--- | :--- | :--- |
| `.box.xleft`, `.box.xright` | ⚠️ **Changed** | Sets `align-items` only. **No longer applies `text-align: left/right`**. |
| `.box.auto`, `.row.auto` | ❌ Removed | Use `+mx-auto` or `+my-auto` in SASS |

### Typography Utilities

| v1 Class | v2 Status | v2 Replacement |
| :--- | :--- | :--- |
| `.fw400`, `.fw500`, `.fw600`, `.bold` | ❌ Removed from utilities | SASS: `+weight(500)` or `font-weight: 500` |
| `.lh11`, `.lh125`, `.lh15`, `.lh16` | ❌ Removed from utilities | SASS: `+leading(1.5)` or `line-height: 1.5` |
| `.tt-u`, `.tt-c` | ❌ Removed from utilities | SASS: `text-transform: uppercase / capitalize` |
| `.ta-l`, `.ta-r`, `.ta-c` | ❌ Removed from utilities | SASS: `text-align: left / right / center` |
| `.italic` | ❌ Removed from utilities | SASS: `font-style: italic` |
| `.body-std` | ❌ Renamed | Use `.body` (sets `+type(md)`, `+leading(1.6)`, `+ink(primary)`) |
| `.page-title` | ❌ Removed | Use `.text-4xl` or `+type(4xl)` |
| `.eyebrow` | ⚠️ **Changed** | In v1: only `font-size: var(--text-sm)`.<br>In v2: **complete semantic preset** (`+type(sm)`, `+ink(muted)`, `uppercase`, `tracking 0.06em`, `weight 500`). |
| `.line-clamp-2`, `.line-clamp-3` | ❌ Removed from utilities | SASS: `+clamp-lines(2)` or `+clamp-lines(3)` |
| `.font-googleflex`, `.font-monasans`, etc. | ❌ Removed | v2 relies on `--font-sans` and `--font-mono` custom properties |

### Color, Ink & State Utilities

| v1 Class | v2 Status | v2 Replacement |
| :--- | :--- | :--- |
| `.text-primary`, `.text-secondary` | ❌ Removed as raw classes | Markup: `.body` (primary), `.muted` (secondary)<br>SASS: `+ink(primary)`, `+ink(secondary)` |
| `.text-muted`, `.text-inverse` | ❌ Removed as raw classes | SASS: `+ink(muted)`, `+ink(inverse)` |
| `.text-theme`, `.text-danger`, etc. | ❌ Removed | Configure in SASS using custom properties |
| OpenColor variables (`$oc-*`) | ❌ Removed | `_colors.sass` is no longer bundled |
| `.bdr` (`border: 1px solid red`) | ❌ Removed | Add custom debug borders during local dev |
| `button.blank`, `a.blank`, `a.link` | ❌ Removed | Handled by modern CSS reset in `_base.sass` |
| `.mode-light-only`, `.mode-dark-only`| ❌ Removed | Use standard CSS media queries or `[data-mode]` selectors |

---

## 6. Component Blocks & Variants

| Component | v1 Implementation | v2 Implementation | Key Differences |
| :--- | :--- | :--- | :--- |
| **`.card`** | Flat surface styling (bg, border, radius, pad) | `+surface(surface, s, 12)` + `+stack(s)` | Automatically sets up vertical flex layout with gap. Supports `&[data-elevated]`. |
| **`.panel`** | *(Did not exist)* | `+surface(raised, m, 16)` + `+stack(m)` | Added in v2 for larger grouping containers. |
| **`.button`** | Bordered by default.<br>Variants: `primary`, `quiet`, `icon`.<br>Supported `[data-state='open']`. | Unbordered base with `+transition`.<br>Variants: `primary`, `ghost`. | `[data-variant='quiet']` is now `[data-variant='ghost']`. `[data-variant='icon']` removed (use `+center` and `+square`). |
| **`.badge`** | Inline flex with custom padding | `+row(center, center)` + `+px(2xs)` + `+radius(full)` | Built completely from fractals. |

---

## 7. Migration Examples: Before & After

### Example 1: Card with Header and Content

```svelte
<!-- Legacy (v1) -->
<div class="card stack gap12 pad16">
  <div class="row ycenter xbetween">
    <h3 class="page-title bold">Project Title</h3>
    <span class="badge">Active</span>
  </div>
  <p class="body-std text-secondary">Card content description goes here.</p>
</div>

<!-- Modern (v2) -->
<div class="card">
  <div class="row ycenter xbetween">
    <h3 class="text-4xl">Project Title</h3>
    <span class="badge">Active</span>
  </div>
  <p class="body muted">Card content description goes here.</p>
</div>
```

### Example 2: Interactive Action Row

```svelte
<!-- Legacy (v1) -->
<div class="row gap8 padtop16 ycenter">
  <button class="button" data-variant="primary">Save Changes</button>
  <button class="button" data-variant="quiet">Cancel</button>
</div>

<!-- Modern (v2) -->
<div class="row gap-xs py-s ycenter">
  <button class="button" data-variant="primary">Save Changes</button>
  <button class="button" data-variant="ghost">Cancel</button>
</div>
```

### Example 3: Responsive Custom Component (SASS)

```sass
// Legacy (v1): Relied on virtual JIT classes in markup
// <div class="row gap16 pad24 pad12-sm width320">

// Modern (v2): Clean fractal composition in component <style lang="sass">
@use '$lib/styles/fractals' as *

.feature-box
  +row(center, center)
  +gap(m)
  +pad(l)
  +w(320px)
  +until(sm)
    +pad(s)
    +gap(s)
```

---

## 8. Migration Cheat Sheet

| v1 Markup Pattern | v2 Replacement |
| :--- | :--- |
| `<div class="row gap8 pad16">` | `<div class="row gap-xs pad-s">` *(or SASS `+gap(8); +pad(16)`)`* |
| `<div class="center">` *(as reading column)* | SASS: `.my-content { +center-column }` |
| `<div class="stack">` | SASS: `.my-container { +stack(s) }` |
| `<div class="cluster">` | SASS: `.my-chips { +cluster(xs) }` |
| `<div class="box w100 min-w-0">` | `<div class="box wfull min0">` |
| `<p class="body-std text-muted">` | `<p class="body muted">` |
| `<span class="eyebrow tt-u">` | `<span class="eyebrow">` *(already includes uppercase + tracking)* |
| `<button class="button" data-variant="quiet">` | `<button class="button" data-variant="ghost">` |
| `<div class="appshell">` | `<div class="app-shell">` |
| `<div class="pad12-sm gap16-lg">` | SASS: `+at(sm) { +pad(12) }` and `+at(lg) { +gap(16) }` |
