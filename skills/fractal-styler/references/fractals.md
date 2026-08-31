# Fractalstyler2 — Class Reference

GENERATED FILE — do not edit. Emitted by `scripts/update-registry.js` from the
parsed stylesheet. 285 classes across 89 tokens.

**The classes below are the entire public API.** The system defines no
authoring mixins and no SASS functions — `+stack`, `+surface`, `space()` and
friends do not exist. Compose in markup.

`*` marks a family: substitute a preset step (`3xs 2xs xs sm md lg xl 2xl 3xl`)
or a value from the literal ladder: `0, 1, 2, 4, 6, 8, 12`, then every
multiple of 8 — to 64px for gap/pad/marg and radius, to 512px for sizing.
Append `-mob` or `-desk` to bind a
class to one side of the 768px seam.

---

## L0 — Tokens

Raw values. Every token also exists as a class.

| Class | Applies | Source |
|:---|:---|:---|
| `.theme-light-default` | 22 colour tokens | `_00_themes.sass` |
| `.theme-himalaya-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-editorial-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-space-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-sun-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-monochrono-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-molly-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-malana-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-coresync-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-studio-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-matcha-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-sakura-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-nordic-frost-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-desert-dune-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-lavender-mist-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-botanical-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-clay-studio-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-solaris-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-cyberpunk-day-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-copper-patina-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-dracula-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-lagoona-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-frozen-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-night-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-inkworm-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-monochrono-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-fouram-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-wintercame-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-sun-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-console-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-dracula-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-catppuccin-mocha` | 22 colour tokens | `_00_themes.sass` |
| `.theme-nord-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-gruvbox-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-onedark-pro` | 22 colour tokens | `_00_themes.sass` |
| `.theme-rose-pine-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-midnight-emerald-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-obsidian-crimson-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-synthwave-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-deep-ocean-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-amethyst-void-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-dark-default` | 22 colour tokens | `_00_themes.sass` |
| `.theme-himalaya-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-editorial-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-space-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-molly-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-malana-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-coresync-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-studio-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-matcha-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-sakura-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-nordic-frost-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-desert-dune-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-lavender-mist-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-botanical-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-clay-studio-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-solaris-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-cyberpunk-day-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-copper-patina-dark` | 22 colour tokens | `_00_themes.sass` |
| `.theme-lagoona-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-frozen-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-night-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-inkworm-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-fouram-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-wintercame-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-console-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-catppuccin-latte` | 22 colour tokens | `_00_themes.sass` |
| `.theme-nord-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-gruvbox-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-onelight-pro` | 22 colour tokens | `_00_themes.sass` |
| `.theme-rose-pine-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-midnight-emerald-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-obsidian-crimson-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-synthwave-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-deep-ocean-light` | 22 colour tokens | `_00_themes.sass` |
| `.theme-amethyst-void-light` | 22 colour tokens | `_00_themes.sass` |

---

## L1 — Dimensions

Space, size, radius. Preset steps (3xs..3xl) and the literal ladder, each in three bands: base, -mob, -desk.

| Class | Applies | Source |
|:---|:---|:---|
| `.gap-*` | gap: calc(var(--space-*) * var(--gap-scale)) \| {N}px | `_02_dimensions.sass` |
| `.rgap-*` | row-gap: calc(var(--space-*) * var(--gap-scale)) \| {N}px | `_02_dimensions.sass` |
| `.cgap-*` | column-gap: calc(var(--space-*) * var(--gap-scale)) \| {N}px | `_02_dimensions.sass` |
| `.pad-*` | padding: calc(var(--space-*) * var(--pad-scale)) \| {N}px | `_02_dimensions.sass` |
| `.pad-x-*` | padding-inline: calc(var(--space-*) * var(--pad-scale)) \| {N}px | `_02_dimensions.sass` |
| `.pad-y-*` | padding-block: calc(var(--space-*) * var(--pad-scale)) \| {N}px | `_02_dimensions.sass` |
| `.pad-top-*` | padding-top: calc(var(--space-*) * var(--pad-scale)) \| {N}px | `_02_dimensions.sass` |
| `.pad-right-*` | padding-right: calc(var(--space-*) * var(--pad-scale)) \| {N}px | `_02_dimensions.sass` |
| `.pad-bottom-*` | padding-bottom: calc(var(--space-*) * var(--pad-scale)) \| {N}px | `_02_dimensions.sass` |
| `.pad-left-*` | padding-left: calc(var(--space-*) * var(--pad-scale)) \| {N}px | `_02_dimensions.sass` |
| `.marg-*` | margin: calc(var(--space-*) * var(--gap-scale)) \| {N}px | `_02_dimensions.sass` |
| `.marg--*` | margin: calc(var(--space-*) * var(--gap-scale) * -1) \| -{N}px | `_02_dimensions.sass` |
| `.marg-x-*` | margin-inline: calc(var(--space-*) * var(--gap-scale)) \| {N}px | `_02_dimensions.sass` |
| `.marg-y-*` | margin-block: calc(var(--space-*) * var(--gap-scale)) \| {N}px | `_02_dimensions.sass` |
| `.marg-top-*` | margin-top: calc(var(--space-*) * var(--gap-scale)) \| {N}px | `_02_dimensions.sass` |
| `.marg-top--*` | margin-top: calc(var(--space-*) * var(--gap-scale) * -1) \| -{N}px | `_02_dimensions.sass` |
| `.marg-bottom-*` | margin-bottom: calc(var(--space-*) * var(--gap-scale)) \| {N}px | `_02_dimensions.sass` |
| `.marg-bottom--*` | margin-bottom: calc(var(--space-*) * var(--gap-scale) * -1) \| -{N}px | `_02_dimensions.sass` |
| `.marg-left-*` | margin-left: calc(var(--space-*) * var(--gap-scale)) \| {N}px | `_02_dimensions.sass` |
| `.marg-right-*` | margin-right: calc(var(--space-*) * var(--gap-scale)) \| {N}px | `_02_dimensions.sass` |
| `.radius-*` | border-radius: {N}px | `_02_dimensions.sass` |
| `.radius-full` | border-radius: var(--radius-full) | `_02_dimensions.sass` |
| `.w-*` | width: {N}px | `_02_dimensions.sass` |
| `.h-*` | height: {N}px | `_02_dimensions.sass` |
| `.square-*` | width: {N}px; height: {N}px | `_02_dimensions.sass` |
| `.min0` | min-width: 0; min-height: 0 | `_02_dimensions.sass` |
| `.wfull` | width: 100% | `_02_dimensions.sass` |
| `.hfull` | height: 100% | `_02_dimensions.sass` |
| `.full` | width: 100%; height: 100% | `_02_dimensions.sass` |
| `.hfull-vh` | min-height: 100vh | `_02_dimensions.sass` |
| `.hfull-vh-fitted` | min-height: calc(100vh - var(--header-height) - var(--footer-height)) | `_02_dimensions.sass` |

---

## L2 — Containers

Flow and alignment. x* is ALWAYS horizontal, y* is ALWAYS vertical, in every container.

| Class | Applies | Source |
|:---|:---|:---|
| `.box` | .box component / container | `_03_containers.sass` |
| `.box.xcenter` | Modifier for .box | `_03_containers.sass` |
| `.box.xleft` | Modifier for .box | `_03_containers.sass` |
| `.box.xright` | Modifier for .box | `_03_containers.sass` |
| `.box.ycenter` | Modifier for .box | `_03_containers.sass` |
| `.box.ytop` | Modifier for .box | `_03_containers.sass` |
| `.box.ybot` | Modifier for .box | `_03_containers.sass` |
| `.box.ybetween` | Modifier for .box | `_03_containers.sass` |
| `.box.yevenly` | Modifier for .box | `_03_containers.sass` |
| `.box.yaround` | Modifier for .box | `_03_containers.sass` |
| `.row` | .row component / container | `_03_containers.sass` |
| `.row.xleft` | Modifier for .row | `_03_containers.sass` |
| `.row.xcenter` | Modifier for .row | `_03_containers.sass` |
| `.row.xright` | Modifier for .row | `_03_containers.sass` |
| `.row.xbetween` | Modifier for .row | `_03_containers.sass` |
| `.row.xevenly` | Modifier for .row | `_03_containers.sass` |
| `.row.xaround` | Modifier for .row | `_03_containers.sass` |
| `.row.ycenter` | Modifier for .row | `_03_containers.sass` |
| `.row.ytop` | Modifier for .row | `_03_containers.sass` |
| `.row.ybot` | Modifier for .row | `_03_containers.sass` |
| `.grid` | .grid component / container | `_03_containers.sass` |
| `.grid.center` | Modifier for .grid | `_03_containers.sass` |
| `.grid.xcenter` | Modifier for .grid | `_03_containers.sass` |
| `.grid.xleft` | Modifier for .grid | `_03_containers.sass` |
| `.grid.xright` | Modifier for .grid | `_03_containers.sass` |
| `.grid.xstretch` | Modifier for .grid | `_03_containers.sass` |
| `.grid.ycenter` | Modifier for .grid | `_03_containers.sass` |
| `.grid.ytop` | Modifier for .grid | `_03_containers.sass` |
| `.grid.ybot` | Modifier for .grid | `_03_containers.sass` |
| `.grid.ystretch` | Modifier for .grid | `_03_containers.sass` |
| `.grid.xbetween` | Modifier for .grid | `_03_containers.sass` |
| `.grid.xevenly` | Modifier for .grid | `_03_containers.sass` |
| `.grid.xaround` | Modifier for .grid | `_03_containers.sass` |
| `.grid.ybetween` | Modifier for .grid | `_03_containers.sass` |
| `.grid.yevenly` | Modifier for .grid | `_03_containers.sass` |
| `.grid.yaround` | Modifier for .grid | `_03_containers.sass` |
| `.wrap` | .wrap component / container | `_03_containers.sass` |
| `.grow` | .grow component / container | `_03_containers.sass` |
| `.shrink-0` | .shrink-0 component / container | `_03_containers.sass` |
| `.relative` | .relative component / container | `_03_containers.sass` |
| `.absolute` | .absolute component / container | `_03_containers.sass` |
| `.fixed` | .fixed component / container | `_03_containers.sass` |
| `.sticky` | .sticky component / container | `_03_containers.sass` |

---

## L3 — Layouts

Grids that step only through divisors, reading measures, frames, reels.

| Class | Applies | Source |
|:---|:---|:---|
| `.frame-16-9` | aspect-ratio: 16 / 9 | `_04_layouts.sass` |
| `.frame-9-16` | aspect-ratio: 9 / 16 | `_04_layouts.sass` |
| `.frame-4-3` | aspect-ratio: 4 / 3 | `_04_layouts.sass` |
| `.frame-3-4` | aspect-ratio: 3 / 4 | `_04_layouts.sass` |
| `.frame-3-2` | aspect-ratio: 3 / 2 | `_04_layouts.sass` |
| `.frame-2-3` | aspect-ratio: 2 / 3 | `_04_layouts.sass` |
| `.frame-1-1` | aspect-ratio: 1 / 1 | `_04_layouts.sass` |
| `.grid-1` | .grid-1 component / container | `_04_layouts.sass` |
| `.grid-2` | .grid-2 component / container | `_04_layouts.sass` |
| `.grid-3` | .grid-3 component / container | `_04_layouts.sass` |
| `.grid-4` | .grid-4 component / container | `_04_layouts.sass` |
| `.grid-6` | .grid-6 component / container | `_04_layouts.sass` |
| `.card-grid` | .card-grid component / container | `_04_layouts.sass` |
| `.prose` | .prose component / container | `_04_layouts.sass` |
| `.reel` | .reel component / container | `_04_layouts.sass` |

---

## L4 — Shells

Page and application scaffolding. Each shell class is paired with a canonical markup — see canonical-markups.md.

| Class | Applies | Source |
|:---|:---|:---|
| `.app-shell` | .app-shell component / container | `_05_shells.sass` |
| `.app-header` | .app-header component / container | `_05_shells.sass` |
| `.app-main` | .app-main component / container | `_05_shells.sass` |
| `.main-section` | .main-section component / container | `_05_shells.sass` |
| `.sidebar-left` | , | `_05_shells.sass` |
| `.sidebar-right` | .sidebar-right component / container | `_05_shells.sass` |
| `.sidebar-left` | .sidebar-left component / container | `_05_shells.sass` |
| `.sidebar-right` | .sidebar-right component / container | `_05_shells.sass` |
| `.sidebar-left` | Required child of .sidebar-right — see canonical-markups.md | `_05_shells.sass` |
| `.sidebar-right` | Required child of .sidebar-right — see canonical-markups.md | `_05_shells.sass` |
| `.content-shell` | .content-shell component / container | `_05_shells.sass` |
| `.app-footer` | .app-footer component / container | `_05_shells.sass` |
| `.mobile-toc` | .mobile-toc component / container | `_05_shells.sass` |
| `.navtree` | .navtree component / container | `_05_shells.sass` |
| `.navtree-title` | .navtree-title component / container | `_05_shells.sass` |
| `.navtree-link` | .navtree-link component / container | `_05_shells.sass` |
| `.navtree-link.active` | Modifier for .navtree-link | `_05_shells.sass` |
| `.navtree-sub` | .navtree-sub component / container | `_05_shells.sass` |
| `.toc` | .toc component / container | `_05_shells.sass` |
| `.toc-title` | .toc-title component / container | `_05_shells.sass` |
| `.toc-list` | .toc-list component / container | `_05_shells.sass` |
| `.toc-link` | .toc-link component / container | `_05_shells.sass` |
| `.toc-link.active` | Modifier for .toc-link | `_05_shells.sass` |
| `.toc-footer` | .toc-footer component / container | `_05_shells.sass` |
| `.tab-list` | .tab-list component / container | `_05_shells.sass` |
| `.tab-trigger` | .tab-trigger component / container | `_05_shells.sass` |
| `.tab-trigger.active` | Modifier for .tab-trigger | `_05_shells.sass` |
| `.page-shell` | .page-shell component / container | `_05_shells.sass` |
| `.page-split` | .page-split component / container | `_05_shells.sass` |
| `.page-main` | Required child of .page-split — see canonical-markups.md | `_05_shells.sass` |
| `.page-sidebar` | Required child of .page-split — see canonical-markups.md | `_05_shells.sass` |
| `.drawer` | .drawer component / container | `_05_shells.sass` |
| `.drawer.open` | Modifier for .drawer | `_05_shells.sass` |
| `.dialog` | .dialog component / container | `_05_shells.sass` |
| `.dialog.open` | , | `_05_shells.sass` |
| `.popover` | .popover component / container | `_05_shells.sass` |
| `.popover.open` | Modifier for .popover | `_05_shells.sass` |
| `.accordion` | .accordion component / container | `_05_shells.sass` |
| `.accordion-item` | .accordion-item component / container | `_05_shells.sass` |
| `.accordion-content` | Required child of .accordion-item — see canonical-markups.md | `_05_shells.sass` |
| `.accordion-panel` | Required child of .accordion-item — see canonical-markups.md | `_05_shells.sass` |
| `.accordion-item.open` | .accordion-content | `_05_shells.sass` |
| `.accordion-trigger` | .accordion-trigger component / container | `_05_shells.sass` |
| `.hero` | .hero component / container | `_05_shells.sass` |

---

## L5 — Visuals & Interactions

Surfaces, ink, borders, type, controls. The outermost layer.

| Class | Applies | Source |
|:---|:---|:---|
| `.bg` | .bg component / container | `_06_visuals.sass` |
| `.surface` | .surface component / container | `_06_visuals.sass` |
| `.raised` | .raised component / container | `_06_visuals.sass` |
| `.panel` | .panel component / container | `_06_visuals.sass` |
| `.footer` | .footer component / container | `_06_visuals.sass` |
| `.canvas` | .canvas component / container | `_06_visuals.sass` |
| `.terminal` | .terminal component / container | `_06_visuals.sass` |
| `.text-primary` | .text-primary component / container | `_06_visuals.sass` |
| `.text-secondary` | .text-secondary component / container | `_06_visuals.sass` |
| `.text-muted` | .text-muted component / container | `_06_visuals.sass` |
| `.text-inverse` | .text-inverse component / container | `_06_visuals.sass` |
| `.text-theme` | .text-theme component / container | `_06_visuals.sass` |
| `.text-success` | .text-success component / container | `_06_visuals.sass` |
| `.text-warning` | .text-warning component / container | `_06_visuals.sass` |
| `.text-danger` | .text-danger component / container | `_06_visuals.sass` |
| `.text-info` | .text-info component / container | `_06_visuals.sass` |
| `.bg-success` | .bg-success component / container | `_06_visuals.sass` |
| `.bg-warning` | .bg-warning component / container | `_06_visuals.sass` |
| `.bg-danger` | .bg-danger component / container | `_06_visuals.sass` |
| `.bg-info` | .bg-info component / container | `_06_visuals.sass` |
| `.border` | .border component / container | `_06_visuals.sass` |
| `.border-subtle` | .border-subtle component / container | `_06_visuals.sass` |
| `.border-top` | .border-top component / container | `_06_visuals.sass` |
| `.border-right` | .border-right component / container | `_06_visuals.sass` |
| `.border-bottom` | .border-bottom component / container | `_06_visuals.sass` |
| `.border-left` | .border-left component / container | `_06_visuals.sass` |
| `.text-xs` | .text-xs component / container | `_06_visuals.sass` |
| `.text-sm` | .text-sm component / container | `_06_visuals.sass` |
| `.text-md` | .text-md component / container | `_06_visuals.sass` |
| `.text-lg` | .text-lg component / container | `_06_visuals.sass` |
| `.text-xl` | .text-xl component / container | `_06_visuals.sass` |
| `.text-2xl` | .text-2xl component / container | `_06_visuals.sass` |
| `.text-3xl` | .text-3xl component / container | `_06_visuals.sass` |
| `.text-4xl` | .text-4xl component / container | `_06_visuals.sass` |
| `.weight-400` | .weight-400 component / container | `_06_visuals.sass` |
| `.weight-500` | .weight-500 component / container | `_06_visuals.sass` |
| `.weight-600` | .weight-600 component / container | `_06_visuals.sass` |
| `.weight-700` | .weight-700 component / container | `_06_visuals.sass` |
| `.mono` | .mono component / container | `_06_visuals.sass` |
| `.tt-u` | .tt-u component / container | `_06_visuals.sass` |
| `.tt-c` | .tt-c component / container | `_06_visuals.sass` |
| `.truncate` | .truncate component / container | `_06_visuals.sass` |
| `.clamp-1` | .clamp-1 component / container | `_06_visuals.sass` |
| `.clamp-2` | .clamp-2 component / container | `_06_visuals.sass` |
| `.clamp-3` | .clamp-3 component / container | `_06_visuals.sass` |
| `.eyebrow` | .eyebrow component / container | `_06_visuals.sass` |
| `.card` | .card component / container | `_06_visuals.sass` |
| `.field` | .field component / container | `_06_visuals.sass` |
| `.field-label` | .field-label component / container | `_06_visuals.sass` |
| `.field-error` | .field-error component / container | `_06_visuals.sass` |
| `.avatar` | .avatar component / container | `_06_visuals.sass` |
| `.divider` | .divider component / container | `_06_visuals.sass` |
| `.kbd` | .kbd component / container | `_06_visuals.sass` |
| `.switch-track` | .switch-track component / container | `_06_visuals.sass` |
| `.switch-thumb` | .switch-thumb component / container | `_06_visuals.sass` |
| `.switch-track` | [aria-checked='true'], | `_06_visuals.sass` |
| `.switch-track` | .checked | `_06_visuals.sass` |
| `.switch-thumb` | Required child of .switch-track — see canonical-markups.md | `_06_visuals.sass` |
| `.hide-mobile` | .hide-mobile component / container | `_06_visuals.sass` |
| `.hide-desktop` | .hide-desktop component / container | `_06_visuals.sass` |
| `.only-mobile` | .only-mobile component / container | `_06_visuals.sass` |
| `.shadow-sm` | .shadow-sm component / container | `_06_visuals.sass` |
| `.shadow-md` | .shadow-md component / container | `_06_visuals.sass` |
| `.shadow-lg` | .shadow-lg component / container | `_06_visuals.sass` |
| `.badge` | .badge component / container | `_07_interactions.sass` |
| `.input` | .input component / container | `_07_interactions.sass` |
| `.select` | .select component / container | `_07_interactions.sass` |
| `.link` | .link component / container | `_07_interactions.sass` |
| `.link-plain` | .link-plain component / container | `_07_interactions.sass` |
| `.link-parent` | .link-parent component / container | `_07_interactions.sass` |
| `.link-plain` | Required child of .link-parent — see canonical-markups.md | `_07_interactions.sass` |
| `.button` | .button component / container | `_07_interactions.sass` |
| `.button.primary` | Modifier for .button | `_07_interactions.sass` |
| `.button.ghost` | Modifier for .button | `_07_interactions.sass` |
| `.button.active` | Modifier for .button | `_07_interactions.sass` |
| `.button.is-icon` | Modifier for .button | `_07_interactions.sass` |

---

## Semantic Tokens

```css
:root {
  --bg: #fdfefe;
  --bg-surface: #f8f7f7;
  --bg-raised: #f1f5f9;
  --bg-panel: #F1F3F5;
  --bg-footer: #E9ECEF;
  --bg-popover: #FFFFFF;
  --bg-dialog: #FFFFFF;
  --bg-terminal: #0F172A;
  --bg-input: #FFFFFF;
  --bg-canvas: #F8F9FA;
  --text-primary: #0f172a;
  --text-secondary: #5b6472;
  --text-muted: #929497;
  --text-inverse: #ffffff;
  --state-hover: #E2E8F0;
  --state-hover-subtle: #F1F5F9;
  --state-selected: #CBD5E1;
  --border: #E2E8F0;
  --border-subtle: #EDF2F7;
  --theme-color: #04825B;
  --theme-color-alt: #047857;
  --success: #10B981;
  --success-hover: #059669;
  --warning: #F59E0B;
  --warning-hover: #D97706;
  --danger: #EF4444;
  --danger-hover: #DC2626;
  --info: #3B82F6;
  --info-hover: #2563EB;
  --feedback-error: #DC2626;
  --ring: rgba(0, 127, 78, 0.35);
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12);
  --font-sans: "Google Sans Flex", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --text-xs: 0.75rem;
  --text-sm: clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem);
  --text-md: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem);
  --text-lg: clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem);
  --text-xl: clamp(1.62rem, 1.4837rem + 0.6057vw, 1.9531rem);
  --text-2xl: clamp(1.944rem, 1.7405rem + 0.9044vw, 2.4414rem);
  --text-3xl: clamp(2.3328rem, 2.0387rem + 1.3072vw, 3.0518rem);
  --text-4xl: clamp(2.7994rem, 2.384rem + 1.8461vw, 3.8147rem);
  --space-3xs: clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem);
  --space-2xs: clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem);
  --space-xs: clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem);
  --space-sm: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem);
  --space-md: clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem);
  --space-lg: clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem);
  --space-xl: clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem);
  --space-2xl: clamp(4.5rem, 4.2955rem + 0.9091vw, 5rem);
  --space-3xl: clamp(6.75rem, 6.4432rem + 1.3636vw, 7.5rem);
  --radius-0: 0;
  --radius-2: 2px;
  --radius-3: 3px;
  --radius-4: 4px;
  --radius-6: 6px;
  --radius-8: 8px;
  --radius-12: 12px;
  --radius-16: 16px;
  --radius-24: 24px;
  --radius-full: 9999px;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --motion-fast: 120ms;
  --motion-base: 160ms;
  --motion-slow: 240ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --control-h-sm: 26px;
  --control-h-md: 32px;
  --control-h-lg: 38px;
  --z-base: 0;
  --z-raised: 10;
  --z-sticky: 100;
  --z-modal: 200;
  --z-toast: 300;
  --header-height: 48px;
  --footer-height: 32px;
  --measure: 65ch;
  --page-gutter: clamp(1rem, 4vw, 2rem);
  --sidebar-width: 260px;
  --toc-width: 240px;
  --card-min: 16rem;
  --breakpoint: 768px;
  --gap-scale: 0.85;
  --pad-scale: 0.7;
}
```
