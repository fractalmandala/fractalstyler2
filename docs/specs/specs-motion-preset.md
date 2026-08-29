# Spec — Motion (Energy) Preset

Status: none claimed — the reviewer verifies. Definition of the motion preset language: what each preset does, and exactly which classes it reaches.
Registry basis: registry-v1.md §Motion language + Amendment A2 (fs2 owns the preset runtime).
Live proof surface: `/previews/motion` — sticky-controlled board staging **movers only**, all interactive (hover, toggle, open).

---

## §1 — Mechanics

- Four values: `reduced` / `heavy` / `active` (default) / `springy`. `presetAxes.motion` is the canonical order — **least → most energy** (still → slow weight → snappy → overshoot) — and is what the picker renders directly (`presets.svelte.ts:12`, `MotionPicker.svelte`). Default-ness is declared in `presetDefaults` (`active`); it does not dictate array position.
- Applied as `data-motion` on `<html>`. **Absent attribute = active.** Selecting the default removes the attribute; every non-default sets it — round-trip guaranteed.
- Mechanism is a **duration + easing remap**: `--motion-fast/base/slow` and (springy only) `--ease-out` — the curve swaps to the spring bezier (same curve as `--ease-spring`). Heavy slows durations but keeps the standard ease; reduced zeroes durations (transitions snap); springy quickens slightly and overshoots.
- **`prefers-reduced-motion: reduce` zeroes all three durations globally regardless of preset** (registry v1 accessibility ruling, `_00_tokens.sass` end) — OS-level reduced-motion always wins.
- Runtime (fs2-owned per Amendment A2): shared `src/lib/presets.svelte.ts` — `setPreset('motion', v)`, `initPresets()`, `getPresetScript()` pre-paint stamp, `MotionPicker.svelte` (glyph = one arc, amplitude 0/4/8/12). Persistence: `localStorage['fs2.presets']`, non-defaults only.
- Motion never touches spacing, radius, color, or layout.

## §2 — Value table (the whole effect)

| Token | reduced | heavy | active (default) | springy |
|---|---|---|---|---|
| `--motion-fast` | 0ms | 200ms | 120ms | 140ms |
| `--motion-base` | 0ms | 300ms | 160ms | 200ms |
| `--motion-slow` | 0ms | 450ms | 240ms | 300ms |
| `--ease-out` | (standard) | (standard) | cubic-bezier(0.16, 1, 0.3, 1) | cubic-bezier(0.34, 1.56, 0.64, 1) |

Defaults ship in `:root` (`_00_tokens.sass:132-137`); the three presets in the `[data-motion]` blocks. `--motion-slow` is defined for consumer-side use — no library class reads it yet (record, not staged).

## §3 — Affected vocabulary (complete inventory — the only things that move)

| Class | Transition reads | Source |
|---|---|---|
| `.button` | background/border/color × fast | `_07_interactions.sass:83` |
| `.switch-track` | background/border × fast | `_06_visuals.sass:188` |
| `.switch-thumb` | translate × fast | `_06_visuals.sass:196` |
| `.navtree-link` | background/color × fast | `_05_shells.sass:155` |
| `.toc-link` | color × fast | `_05_shells.sass:195` |
| `.tab-trigger` | color/border × fast | `_05_shells.sass:227` |
| `.drawer` | transform/visibility × base + ease-out | `_05_shells.sass:271` |
| `.dialog` | opacity/visibility/translate × base + ease-out | `_05_shells.sass:291` |
| `.popover` | opacity/visibility/translate × fast + ease-out | `_05_shells.sass:315` |
| `.accordion-content` | grid-template-rows × base + ease-out | `_05_shells.sass:335` |

Census: these 10 classes are every `var(--motion-*)` / `var(--ease-out)` reference in the library. All staged on `/previews/motion` except `.drawer` (the sidebar drawer's slide — visible on the real shell below 1024px).

## §4 — Never moves (opt-outs, by design)

- **Instant by construction**: anything without a `transition` declaration never animates regardless of preset.
- **Layout, shape, color axes**: untouched.
- **OS reduced-motion**: overrides all presets (§1).

## §5 — Evaluation protocol (reviewer)

1. Open `/previews/motion`. The control bar (picker + live readout: three durations + the ease curve) is sticky.
2. Sweep reduced → heavy → active → springy. Toggle every staged mover: hover the button/links/tabs, flip the switch, toggle the accordion and popover, open the dialog — each transition's length and character track the readout.
3. Springy: overshoot on dialog/popover translate and accordion rows. Heavy: everything lingers. Reduced: everything snaps.
4. Reload on a non-default: attribute stamped pre-paint, no flash.
5. With OS reduced-motion enabled, all durations read 0 regardless of preset.

## §6 — Definition log

- **2026-08-29 — IMPLEMENTED: runtime + picker + board.** Token blocks existed from the registry pass; this wave added the monotonic axis order (**reduced → heavy → active → springy**, previously default-first `active, springy, heavy, reduced`), `MotionPicker.svelte`, the `/previews/motion` board with real toggles, and this spec. Values per registry v1 tables, unchanged.
