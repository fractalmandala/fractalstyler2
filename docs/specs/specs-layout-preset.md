# Spec — Layout (Density) Preset

Status: none claimed — the reviewer verifies. Definition of the layout preset language: what each preset does, and exactly which classes it reaches.
Registry basis: registry-v1.md §Layout language + Amendment A2 (fs2 owns the preset runtime). Mechanism redefined by the author twice on 2026-08-29 (see §6).
Live proof surface: `/previews/layout` — a sticky-controlled board staging **movers only**, split by role (gaps vs pads), plus the canonical sidebar vocabulary. The real app-shell around the page is itself the canonical shell specimen.

---

## §1 — Mechanics

- Three values: `tight` / `comfortable` (default) / `sprawling`. `presetAxes.layout` is the canonical order — **tightest → loosest** — and is what the picker renders directly (`presets.svelte.ts:10`, `LayoutPicker.svelte`). Default-ness is declared separately in `presetDefaults`.
- Applied as `data-layout` on `<html>`. **Absent attribute = comfortable.** Selecting the default removes the attribute; every non-default sets it — round-trip guaranteed.
- Mechanism is **two density factors**: gaps and margins read `calc(var(--space-*) × var(--gap-scale, 1))`; paddings read `calc(var(--space-*) × var(--pad-scale, 1))` — at every use site (utilities and compositions). The attribute block sets only the two factors (`_00_tokens.sass`). Pads and gaps scale at **different rates by design**: uniform scaling is a perceptual no-op (if pad and gap inside a box grow equally, nothing changed); breathing opens when padding outgrows gap.
- **Element sizes, heights, and widths never move.** Control heights stay authored at their comfortable values (26/32/38) under all three presets; width/height utilities are px.
- Runtime (fs2-owned per Amendment A2): `src/lib/presets.svelte.ts` — `setPreset('layout', v)`, `initPresets()`, `getPresetScript()` pre-paint head stamp, `LayoutPicker.svelte`. Persistence: `localStorage['fs2.presets']`, non-defaults only. Runtime is shared across all four axes; layout adds no code.
- Layout never touches radius, text, motion, or color.

## §2 — Factor table (the whole effect)

| | tight | comfortable (default) | sprawling |
|---|---|---|---|
| `--gap-scale` (gaps + margins) | 0.85 | 1 (attribute absent) | 1.2 |
| `--pad-scale` (paddings) | 0.7 | 1 (attribute absent) | 1.5 |

Every `--space-*` step (3xs…3xl) keeps its comfortable clamp; use sites apply the role factor. Example: `--space-sm` ≈ 18px → gap-sm 15.3px tight / 21.6px sprawling; pad-sm 12.6px tight / 27px sprawling — the pad/gap ratio falls in tight (breathing closes) and rises in sprawling (breathing opens). Control heights: 32px in all three.

## §3 — Affected vocabulary (complete inventory — the only things that move)

### §3.1 — utilities (17 space families, role-split)

- **Gap families** (`gap` `rgap` `cgap`): step classes read `calc(var(--space-step) × var(--gap-scale, 1))` (`_02_dimensions.sass`).
- **Pad families** (`pad` `pad-x` `pad-y` `pad-top` `pad-right` `pad-bottom` `pad-left`): steps read `calc(… × var(--pad-scale, 1))`.
- **Margin families** (`marg` + 6 directionals): positives and `--` negatives ride `--gap-scale` (margins separate blocks, the same role as gaps).
- All families × 9 steps × 3 bands (base / `-mob` / `-desk`).

### §3.2 — compositions reading spaces (all factor-wrapped at use site)

| Class | Gap/margin reads (×gap-scale) | Pad reads (×pad-scale) |
|---|---|---|
| `.badge` | gap 3xs | pad-inline 2xs |
| `.input` / `.select` | — | pad-inline xs |
| `.button` | — | pad-inline sm |
| `.kbd` | — | pad-inline 2xs |
| `.card` | gap sm | pad md |
| `.field` | gap 3xs | — |
| `.divider` | margin-block sm | — |
| `.app-header` / `.app-footer` | — | pad-inline sm |
| `.sidebar-left` / `.sidebar-right` | — | pad sm |
| `.mobile-toc` | (open) summary margin-bottom xs | pad xs · (open) summary pad-bottom 2xs |
| `.navtree` | gap sm | — |
| `.navtree-title` | — | pad-inline xs |
| `.navtree-link` | — | pad-block 3xs · pad-inline xs |
| `.navtree-sub` | gap 3xs | pad-left sm |
| `.toc` / `.toc-list` | gap xs · gap 3xs | — |
| `.toc-title` | — | pad-inline xs |
| `.toc-footer` | margin-top xs | pad-top xs |
| `.tab-list` | gap 2xs | — |
| `.tab-trigger` | — | pad-block 2xs · pad-inline xs |
| `.page-shell` | — | pad-block md |
| `.drawer` | — | pad sm |
| `.accordion` / open content | gap 2xs | (open) pad xs |
| `.accordion-trigger` | — | pad 2xs xs |
| `.hero` | gap lg | pad-block xl |
| `.prose` | rhythm margins sm / md | — |

Sources: `_05_shells.sass`, `_06_visuals.sass`, `_07_interactions.sass`, `_04_layouts.sass` — every `var(--space-*)` read in the library is factor-wrapped (census: zero unwrapped reads remain).

## §4 — Never moves (opt-outs, by design)

- **Element sizes**: `--control-h-sm/md/lg` stay at comfortable values in all presets (heights/widths are not density). `.button`/`.input`/`.select`/`.accordion-trigger` heights therefore constant.
- **`-N` literal utilities**: `.gap-8`, `.pad-16`, `.marg--12`… are px.
- **Size utilities**: `.w-*` / `.h-*` / `.square-*` are px.
- **Structural tokens**: `--page-gutter`, `--measure`, `--sidebar-width`, `--toc-width`, `--header-height`, `--footer-height`, `--card-min`, `--breakpoint` — chrome geometry fixed while content density moves.
- **Radius / text / motion / color**: orthogonal axes.

## §5 — Evaluation protocol (reviewer)

1. Open `/previews/layout`. The control bar (picker + live readout) is sticky.
2. Sweep tight → comfortable → sprawling. Readout: both factors, a real `.gap-sm` measurement, a real `.pad-sm` measurement, and the button height — gaps shrink less than pads in tight, grow less in sprawling; the height never changes.
3. Gaps card, pads card, canonical sidebar card, stays row — everything staged moves except the stays row.
4. Widen the window ≥1024px: the real `sidebar-left` (canonical nav) appears around the page; ≥1280px adds `sidebar-right` (TOC). Sweep the densities — the whole canonical shell re-spaces live.
5. Reload on tight or sprawling: attribute stamped pre-paint, no flash.

## §6 — Definition log

- **2026-08-29 — REDEFINED BY THE AUTHOR: factor mechanism.** Prior: hand-authored per-step `--space-*` tables per preset (registry-v1.md §Layout language). Author: "just multiply the --space- tokens by 0.75, 1.2, 1.5 or something like that, for instant 4 complete configs of every gap and pad". First redefinition: single `--space-scale` factor inside the tokens.
- **2026-08-29 — REDEFINED BY THE AUTHOR: two factors, heights out.** Author: "layout presets are about gaps and pads and breathing spaces they should NOT affect sizes heights widths of elements" and "if pad + gap inside a box both increase by same amount then actually nothing changed! if pads increase say 1.2x compared to gap -> thats when breathing space opens". Second redefinition: `--gap-scale` + `--pad-scale` applied at use sites (utilities and compositions), different rates per role — tight 0.85/0.7, sprawling 1.2/1.5; `--control-h-*` overrides deleted from the preset blocks (heights constant; registry v1's ±4px control-height shift is thereby superseded for v1 presets). The canonical app-shell (sidebar-left nav + sidebar-right TOC) is now rendered by the demo app's own `+layout.svelte`, so the real chrome is the shell specimen.
