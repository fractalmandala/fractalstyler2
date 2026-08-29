# Spec — Radius (Shape) Preset

Status: none claimed — the reviewer verifies. Definition of the shape preset language: what each preset does, and exactly which classes it reaches.
Registry basis: registry-v1.md §Shape language + Amendment A2 (fs2 owns the preset runtime).
Live proof surface: `/previews/shape` — a sticky-controlled board that stages **the workings only** (§3's 11 movers, each labeled with its P-code). §4–§6 are never-move records; their evidence is the source line, and the preview deliberately stages nothing that cannot move.

## EXAMPLE OF WHAT NOT TO DO:

agent wrote 

```
Status: **implemented + verified live** (2026-08-29). Source of truth for the shape preset language: what each preset does, and exactly which classes it reaches.

```

agent is not authorized to confirm verification! i am the one who verifies.

---

## §1 — Mechanics

- Four values: `round` / `curved` (default) / `pro` / `sharp`. `presetAxes.shape` is the canonical monotonic order — **roundest → sharpest** — and is what the picker renders directly (`presets.svelte.ts:11`, `ShapePicker.svelte:14`). Default-ness is declared separately in `presetDefaults` (`presets.svelte.ts:18`); it does not dictate array position.
- Applied as `data-shape` on `<html>`. **Absent attribute = curved** (the default per `presetDefaults`). Selecting the default removes the attribute; every non-default sets it — round-trip guaranteed (`presets.svelte.ts:32-36`).
- Mechanism is a pure token remap: the preset rewrites the three radius channels (`_00_tokens.sass:216-234`); no component CSS changes.
- Runtime (fs2-owned per Amendment A2): `src/lib/presets.svelte.ts` — `setPreset('shape', v)` (:66), `initPresets()` (:49), `getPresetScript()` pre-paint head stamp (:75; emitted in `routes/+layout.svelte:14-17`), `ShapePicker.svelte` (glyph map :10). Persistence: `localStorage['fs2.presets']`, non-defaults only (:15, :34-46).
- `prefers-reduced-motion` is orthogonal; shape never touches motion, color, or spacing.

## §2 — Channel table (the whole effect)

| Channel | round | curved (default) | pro | sharp |
|---|---|---|---|---|
| `--radius-sm` | 16px | 8px | 4px | 0 |
| `--radius-md` | 24px | 16px | 8px | 0 |
| `--radius-lg` | 32px | 24px | 16px | 0 |

Values redefined by the author 2026-08-29 (prior: 12/16/24 · 6/8/12 · 2/3/6 · 0/0/2). `:root` defaults and all four `[data-shape]` blocks in `_00_tokens.sass:126-234` carry the new table.

## §3 — Affected vocabulary (complete inventory — the only things that move)

Full census: `border-radius` appears **18 times** in `src/lib/styles` — the 11 channel readers below (§3), the `--radius-full` trio (§4), and the literal utilities themselves (§5). Nothing else in the library declares any radius, so every class not listed in §3 has no radius surface for a shape preset to reach.

### §3.1 — reads `--radius-sm` (6)
| Code | Class | Source | Proof on `/previews/shape` |
|---|---|---|---|
| P1 | `.button` (+ `.primary` `.ghost` `.is-icon` `.active`) | `_07_interactions.sass:77` | sm card (buttons); picker glyphs |
| P2 | `.badge` | `_07_interactions.sass:12` | sm card (badge) + card corner tags |
| P3 | `.kbd` | `_06_visuals.sass:176` | sm card (⌘K) |
| P4 | `.input` | `_07_interactions.sass:24` | sm card (input) |
| P5 | `.select` | `_07_interactions.sass:45` | sm card (select) |
| P6 | `.navtree-link` | `_05_shells.sass:154` | sm card (navtree links) + left rail ≥lg |

### §3.2 — reads `--radius-md` (4)
| Code | Class | Source | Proof on `/previews/shape` |
|---|---|---|---|
| P7 | `.card` | `_06_visuals.sass:132` | every card on the board |
| P8 | `.popover` | `_05_shells.sass:309` | md card |
| P9 | `.accordion-item` | `_05_shells.sass:329` | md card + left rail accordions |
| P10 | `.mobile-toc` | `_05_shells.sass:106` | md card (details specimen) + page-top dropdown below the 1280px seam |

### §3.3 — reads `--radius-lg` (1)
| Code | Class | Source | Proof on `/previews/shape` |
|---|---|---|---|
| P11 | `.dialog` | `_05_shells.sass:286` | lg strip — open via its button |

## §4 — Channel-free by design (full stays full) — records, not staged

`--radius-full` is never remapped: the four shape blocks touch sm/md/lg only (`_00_tokens.sass:216-234`).

| Code | Class | Source |
|---|---|---|
| P12 | `.avatar` | `_06_visuals.sass:152` |
| P13 | `.switch-track` / `.switch-thumb` | `_06_visuals.sass:186,194` |
| P14 | `.radius-full` (utility) | `_02_dimensions.sass:42-43` |

## §5 — Literal opt-out (never move) — records, not staged

`.radius-{N}` utilities are literal px by ruling (`_02_dimensions.sass:38-40`, `-mob`/`-desk` bands at :91); shape presets cannot reach them.

| Code | Class | Source |
|---|---|---|
| P15 | `.radius-0` | `_02_dimensions.sass:38` |
| P16 | `.radius-16` | `_02_dimensions.sass:38` |

## §6 — Anatomy without radius (nothing declared — nothing to move) — records, not staged

| Code | Class(es) | Source |
|---|---|---|
| P17 | `.divider` | `_06_visuals.sass:161` |
| P18 | `.tab-list` / `.tab-trigger` | `_05_shells.sass:210,216` |
| P19 | `.field` | `_06_visuals.sass:134` |
| P20 | `.drawer` | `_05_shells.sass:258` |
| P21 | `.sidebar-left` / `.sidebar-right` | `_05_shells.sass:53` |
| P22 | `.app-shell` family (`.app-shell` `.app-header` `.app-main` `.app-footer`) | `_05_shells.sass:18,24,38,94` |
| P23 | `.page-shell` / `.page-split` (incl. `.page-main` `.page-sidebar`) | `_05_shells.sass:235,239` |
| P24 | `.prose` | `_04_layouts.sass:58` |
| P25 | `.toc-list` | `_05_shells.sass:182` |
| P26 | L1/L2 dimension + flow utilities (`.pad-*` `.gap-*` `.box` …) | `_02_dimensions.sass`, `_03_containers.sass` |

## §7 — Evaluation protocol (reviewer)

1. Open `/previews/shape`. The control bar (picker + live readout) is sticky under the header — it never scrolls away from the specimens.
2. Sweep the picker: round → curved → pro → sharp (roundest → sharpest). The readout tracks §2; every staged specimen moves with it.
3. The board stages only §3's 11 movers — there is nothing on it that must stay put. The never-move records (§4–§6) live in this doc, evidenced by source lines.
4. Open the dialog (P11) — its corner is the lg proof.
5. Below 1280px the page-top `.mobile-toc` appears (P10) and re-rounds with the preset.
6. Reload on any non-default state: attribute stamped pre-paint, no flash (§1).

## §8 — Repair log (defects and changes found by the reviewer, with provenance)

- **2026-08-29 — REDEFINED BY THE AUTHOR: channel values.** New table (§2): round 16/24/32, curved 8/16/24, pro 4/8/16, sharp 0/0/0 (prior: 12/16/24 · 6/8/12 · 2/3/6 · 0/0/2). `:root` defaults and all four `[data-shape]` blocks updated in `_00_tokens.sass`; picker glyphs now mirror the new sm channel (rx 16/8/4/0 — round renders as a full circle). Live probe after the change: all four presets compute exactly to §2; `.card` (md) = 24/16/8/0, `.button` (sm) = 16/8/4/0 across round/curved/pro/sharp. Pending reviewer evaluation.

- **2026-08-29 — DEFECT: round displayed curved's geometry.** Selecting round *removed* `data-shape` from `<html>` instead of setting it; the page fell back to `:root`'s 6/8/12 while the readout printed app state ("round") that never reached the DOM. Root cause: `presetAxes.shape` listed `round` first, and the runtime treated **first entry = default** — so round satisfied `isDefault()` and was stripped. Found by live CSSOM probe (click round → `attr: null`, computed 6/8/12; sharp/pro correct). Repair: default-ness decoupled from array position — `presetDefaults` now declares defaults (`presets.svelte.ts:18`), `isDefault` reads it, the head stamp compares against it; `presetAxes.shape` is the monotonic roundest → sharpest order and the picker renders it directly (the picker's hardcoded display-order copy was deleted, not patched). Live probe after repair: round 12/16/24 (attr set), curved 6/8/12 (attr absent = default), pro 2/3/6, sharp 0/0/2; sharp survived reload pre-paint. Pending reviewer evaluation.
- **2026-08-29 — RECORD CORRECTED: false status claims.** This spec previously carried agent-authored "implemented + verified live" / "implemented" status lines. The reviewer struck them: the agent is not authorized to confirm verification. Status claims are removed; the reviewer verifies.
