# Fractal Architecture & Directory Composition System

## 1. Core Philosophy

### The Fractal Principle: Self-Similarity Across Scales
In natural fractals, the same geometric formula operates whether you examine a coastline from orbit or an inlet up close. In this styling system, the exact same principle applies to user interfaces:

$$\text{Atom} \longrightarrow \text{Molecule} \longrightarrow \text{Recipe} \longrightarrow \text{Composition}$$

- An **Atom** is an indivisible mixin making a single visual decision (`+box`, `+pad`, `+radius`, `+gap`).
- A **Molecule** is a small formula combining atoms (`+surface`, `+stack`, `+cluster`, `+frame`, `+cols`).
- A **Recipe** is a parametric macro mixin (`=card`, `=button`, `=badge`, `=input`) that accepts arguments rather than locking scale choices.
- A **Composition** is a complete, reusable UX archetype (like `<Directory>`, `<Hero>`, or `<HolyGrail>`) that arranges molecules and recipes without hardcoding card contents.

---

### The Three Golden Rules

1. **Human Legibility, Zero Syntactic Noise**:
   Avoid `__`, `&__`, or complex deeply-nested selectors. A container is a `.box` or `.row`, a spacing unit is `.pad-s` or `.gap-xs`.
2. **Zero Variable Chasing**:
   To know the value of something, you should never have to trace up a chain like `--this-var` $\to$ `var(--other-var)` $\to$ `$token`. Spacing, radius, typography, and color route directly from semantic Utopia tokens.
3. **Non-Opinionated Primitives**:
   Primitives set structure, alignment, and material surfaces. They **never** hardcode arbitrary paddings, fixed heights, or locked radii. Svelte 5 markup combines primitives to achieve any scale.

---

### Why Traditional Systems & `_kit.sass` Monoliths Fail

| Traditional / Monolithic Failure | The Fractal Solution |
|---|---|
| **Locked Scale Defaults**: `.card` sets `padding: 18px; border-radius: 12px;`, breaking when you need a compact or roomy card. | **Parametric & Open**: `+surface($bg, $pad: null, $radius: 6)`. Padding is entirely decoupled from the surface primitive. |
| **Cascade Wars**: Adding `.pad-xs` to a class fails because `.card` has equal specificity and was declared later. | **Guaranteed Cascade Order**: `_utilities.sass` loads *after* `_blocks.sass`. Single-class utilities always win cleanly. |
| **Monolithic Component Bloat**: 28KB `_kit.sass` files containing hundreds of rigid `.k-card`, `.k-aspect-ratio`, `.k-badge` classes. | **Zero CSS Bloat**: Raw fractals compose directly in markup (e.g. `<div class="frame radius-6">`). |
| **40-Prop Component Trap**: Creating a `<Catalog>` monolith with dozens of boolean flags (`showSearch`, `showTabs`, `hasImages`). | **Snippet-Driven Compositions**: Layout coordinators handle state, while Svelte 5 `{#snippet}` handles card rendering. |

---

## 2. System Architecture Layers

```
Layer 0: Tokens (_tokens.sass)
   │  Fluid Utopia Scales: --space-*, --text-*, --radius-*, --border, --bg-*
   ▼
Layer 1: Atoms (_atoms.sass)
   │  Indivisible Mixins: +box, +row, +pad, +gap, +radius, +border, +bg, +weight
   ▼
Layer 2: Molecules (_molecules.sass)
   │  Self-Similar Formulas: +surface, +stack, +cluster, +frame, +cols, +reel
   ▼
Layer 3: Recipes (_recipes.sass)
   │  Parametric Macro Mixins: =card, =button, =badge, =input, =kbd, =divider
   ▼
Layer 4: Projections (_blocks.sass & _utilities.sass)
   │  Blocks: .surface, .card, .button, .badge, .input
   │  Utilities: .pad-*, .gap-*, .radius-*, .text-*, .bg-*, .frame
   ▼
Layer 5: Compositions (_layouts.sass & Components)
      .grid-1..6, .hero, .docs, <Directory>, <AppShell>
```

### The Cascade Order in `index.sass`
```sass
@use './tokens'       // Layer 0: CSS variables & color schemes
@use './base'         // Global resets & typography baselines
@use './blocks'       // Semantic baseline classes (.card, .panel, .button)
@use './utilities'    // 1:1 atom & molecule projections (.pad-xs, .radius-4)
@use './layouts'      // Structural page layouts (.grid-3, .hero, .docs)
@use './own'          // Project-specific custom elements
```

---

## 3. Design Tokens & Visual Constraints

### Border-Radius Scale
The design system enforces a crisp, subtle 3px/6px radius:
- `--radius-2`: `2px` (micro badges, inline icons)
- `--radius-3`: `3px` (keycaps, tags, badges)
- `--radius-4`: `4px` (buttons, inputs, toolbars)
- `--radius-6`: `6px` (cards, surfaces, frames, panels)

### Button Borders
All interactive buttons have an explicit `border: 1px solid var(--border)` baseline:
- **Ghost Button**: `background: transparent; border-color: var(--border)`. Transitions to `var(--border-strong)` on hover.
- **Active State**: `[data-active]` renders `border-color: var(--theme)` or `var(--border-strong)`.
- **Primary Button**: `background: var(--theme); border-color: var(--theme)`.

---

## 4. The Directory Composition Specification

The Directory is a **Layout Composition Fractal** designed to eliminate repetitive page-building logic while supporting any visual layout.

```
+--------------------------------------------------------------------------------+
|  1. HEADER: Title, description, optional action slot                          |
+--------------------------------------------------------------------------------+
|  2. TABS: Filter pills / tag tabs with count badges                            |
+--------------------------------------------------------------------------------+
|  3. TOOLBAR: [🔍 Search Input... ✕]   [Sort: Options]   [⊞ Grid / ☰ List]     |
+--------------------------------------------------------------------------------+
|  4. SUMMARY: Active filter breadcrumbs, result count, clear button            |
+--------------------------------------------------------------------------------+
|  5. VIEW: Dynamic Column Grid or List (rendered via Svelte 5 Snippet)         |
|     ├── cols={1}: Single-column list feed (.grid-1)                            |
|     ├── cols={2}: 2-column image/portfolio showcase (.grid-2)                  |
|     ├── cols={3}: 3-column package/article registry (.grid-3)                  |
|     ├── cols={4}: 4-column collection gallery (.grid-4)                        |
|     ├── cols={6}: 6-column compact icon/swatch picker (.grid-6)                |
|     └── cols="auto": Fluid auto-fit grid (.card-grid)                          |
+--------------------------------------------------------------------------------+
|  6. EMPTY STATE: Standard or custom zero-results view with reset action        |
+--------------------------------------------------------------------------------+
|  7. PAGINATION: "Load more" button with remaining count indicator             |
+--------------------------------------------------------------------------------+
```

### The Single-Item Rule
Grid tracks are declared with `repeat(N, minmax(0, 1fr))`. When a filter matches only 1 item, that card occupies its natural 1-column width (e.g. 25% on 4-col, 50% on 2-col) and **never** stretches across the entire screen.

---

## 5. Unified Card Anatomy

Every card in this system follows the exact same self-similar vertical stack:

```
+-----------------------------------+
|  1. Top Media (Optional .frame)   |  <-- 16:9 Thumbnail, banner, or avatar
|  2. Meta Row (Host / Status)      |  <-- Favicon + host, or status badge
|  3. Title (text-sm, weight 600)   |  <-- Clean link opening in new tab
|  4. Description (muted, text-sm)  |  <-- Line-clamped summary (clamp-2)
|  5. Tags Cluster (row wrap)       |  <-- #tag badges that filter on click
|  6. Footer Actions (Optional)     |  <-- Terminal install box, npm/repo links
+-----------------------------------+
```

---

## 6. Examples & Implementation Guide

### Example 1: Curated Web Resource Directory (4 Columns)
```svelte
<script lang="ts">
  import { collectionsData, getTagFilters } from '$lib/data/collections.js';
  import { Directory, UrlCard } from '$lib';

  const tags = getTagFilters(collectionsData);
</script>

<Directory
  title="Svelte Collections"
  description="Explore curated resources across the ecosystem."
  items={collectionsData}
  {tags}
  cols={4}
  searchPlaceholder="Search collections..."
  tagFilterFn={(item, tagId) => item.tags.includes(tagId)}
  searchFn={(item, q) => item.title.toLowerCase().includes(q.toLowerCase())}
  sortBy="visits"
  sortOptions={[
    { id: 'visits', label: 'Popular' },
    { id: 'title', label: 'A–Z' },
    { id: 'host', label: 'Host' }
  ]}
  sortFn={(list, sortKey) => {
    const sorted = [...list];
    if (sortKey === 'visits') sorted.sort((a, b) => b.visits - a.visits);
    else if (sortKey === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }}
>
  {#snippet item(entry, layout, { selectTag })}
    <UrlCard item={entry} {layout} ontagclick={(tag) => selectTag(tag)} />
  {/snippet}
</Directory>
```

---

### Example 2: Package Registry & Ecosystem Tracker (3 Columns)
```svelte
<script lang="ts">
  import { packages, getPackageStats } from '$lib/data/packages.js';
  import { Directory, PackageCard, PackageList } from '$lib';

  const stats = getPackageStats(packages);
  const tags = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'released', label: 'Released', count: stats.released },
    { id: 'wip', label: 'WIP', count: stats.wip }
  ];
</script>

<Directory
  title="All Packages"
  description="Explore all libraries and themes in the ecosystem."
  items={packages}
  {tags}
  cols={3}
  searchPlaceholder="Search packages..."
  tagFilterFn={(pkg, tagId) => tagId === 'all' || pkg.status === tagId}
  searchFn={(pkg, q) => pkg.name.toLowerCase().includes(q.toLowerCase())}
>
  {#snippet item(entry, layout)}
    {#if layout === 'grid'}
      <PackageCard pkg={entry} />
    {:else}
      <PackageList packages={[entry]} />
    {/if}
  {/snippet}
</Directory>
```

---

### Example 3: Pure Visual Photo Gallery (2 Columns, No Text)
```svelte
<script lang="ts">
  import { Directory } from '$lib';

  interface Photo {
    id: string;
    url: string;
    category: string;
  }

  let { photos }: { photos: Photo[] } = $props();
</script>

<Directory
  title="Wallpapers"
  description="High-resolution visual showcase."
  items={photos}
  cols={2}
  gap="m"
  showSearch={false}
>
  {#snippet item(photo)}
    <article class="card pad-3xs radius-6" data-elevated>
      <div class="frame radius-4">
        <img src={photo.url} alt="" loading="lazy" />
      </div>
    </article>
  {/snippet}
</Directory>
```

---

### Example 4: Compact Icon / Asset Picker (6 Columns)
```svelte
<script lang="ts">
  import { Directory, Icons } from '$lib';

  interface IconItem {
    name: string;
    category: string;
  }

  let { icons }: { icons: IconItem[] } = $props();
</script>

<Directory
  title="Icon Suite"
  description="Search and filter through 1,000+ vector icons."
  items={icons}
  cols={6}
  gap="xs"
  searchPlaceholder="Search icons..."
  searchFn={(icon, q) => icon.name.toLowerCase().includes(q.toLowerCase())}
>
  {#snippet item(icon)}
    <button
      type="button"
      class="button pad-xs center box gap-3xs radius-4"
      data-variant="ghost"
      onclick={() => navigator.clipboard.writeText(icon.name)}
      title={`Copy ${icon.name}`}
    >
      <Icons name={icon.name} size={22} />
      <span class="text-xs truncate">{icon.name}</span>
    </button>
  {/snippet}
</Directory>
```
