# Fractalstyler2 — Token Reference

GENERATED FILE — do not edit. Emitted by `scripts/update-registry.js`
from `_00_tokens.sass`.

Every token is also a class. If `--space-md` exists, so do `.gap-md`,
`.pad-md` and `.marg-md`. There is no second vocabulary to learn.

## Fluid Type Scale

Interpolates smoothly between 360px and 1240px. No breakpoints.

| Token | Class | Value |
|:---|:---|:---|
| `--text-xs` | `.text-xs` | `0.75rem` |
| `--text-sm` | `.text-sm` | `clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem)` |
| `--text-md` | `.text-md` | `clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)` |
| `--text-lg` | `.text-lg` | `clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem)` |
| `--text-xl` | `.text-xl` | `clamp(1.62rem, 1.4837rem + 0.6057vw, 1.9531rem)` |
| `--text-2xl` | `.text-2xl` | `clamp(1.944rem, 1.7405rem + 0.9044vw, 2.4414rem)` |
| `--text-3xl` | `.text-3xl` | `clamp(2.3328rem, 2.0387rem + 1.3072vw, 3.0518rem)` |
| `--text-4xl` | `.text-4xl` | `clamp(2.7994rem, 2.384rem + 1.8461vw, 3.8147rem)` |

## Fluid Space Scale

Gaps and margins scale by `--gap-scale`; paddings by `--pad-scale`.
The two move at different rates under the layout preset.

| Token | Class | Value |
|:---|:---|:---|
| `--space-3xs` | `.gap-3xs` `.pad-3xs` | `clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem)` |
| `--space-2xs` | `.gap-2xs` `.pad-2xs` | `clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem)` |
| `--space-xs` | `.gap-xs` `.pad-xs` | `clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem)` |
| `--space-sm` | `.gap-sm` `.pad-sm` | `clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)` |
| `--space-md` | `.gap-md` `.pad-md` | `clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem)` |
| `--space-lg` | `.gap-lg` `.pad-lg` | `clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem)` |
| `--space-xl` | `.gap-xl` `.pad-xl` | `clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem)` |
| `--space-2xl` | `.gap-2xl` `.pad-2xl` | `clamp(4.5rem, 4.2955rem + 0.9091vw, 5rem)` |
| `--space-3xl` | `.gap-3xl` `.pad-3xl` | `clamp(6.75rem, 6.4432rem + 1.3636vw, 7.5rem)` |

## Radius

The `-sm/-md/-lg` channels are what compositions read; shape presets remap them.

| Token | Class | Value |
|:---|:---|:---|
| `--radius-0` | — | `0` |
| `--radius-2` | — | `2px` |
| `--radius-3` | — | `3px` |
| `--radius-4` | — | `4px` |
| `--radius-6` | — | `6px` |
| `--radius-8` | — | `8px` |
| `--radius-12` | — | `12px` |
| `--radius-16` | — | `16px` |
| `--radius-24` | — | `24px` |
| `--radius-full` | — | `9999px` |
| `--radius-sm` | — | `8px` |
| `--radius-md` | — | `16px` |
| `--radius-lg` | — | `24px` |

## Colour Roles

Name the role, never the hex. Values shown are the light default;
`[data-mode="dark"]` and the colour presets remap them.

| Token | Class | Value |
|:---|:---|:---|
| `--bg` | — | `#fdfefe` |
| `--bg-surface` | — | `#f8f7f7` |
| `--bg-raised` | — | `#f1f5f9` |
| `--bg-panel` | — | `#F1F3F5` |
| `--bg-footer` | — | `#E9ECEF` |
| `--bg-popover` | — | `#FFFFFF` |
| `--bg-dialog` | — | `#FFFFFF` |
| `--bg-terminal` | — | `#0F172A` |
| `--bg-input` | — | `#FFFFFF` |
| `--bg-canvas` | — | `#F8F9FA` |
| `--text-primary` | — | `#0f172a` |
| `--text-secondary` | `.text-secondary` | `#5b6472` |
| `--text-muted` | `.text-muted` | `#929497` |
| `--text-inverse` | `.text-inverse` | `#ffffff` |
| `--state-hover` | — | `#E2E8F0` |
| `--state-hover-subtle` | — | `#F1F5F9` |
| `--state-selected` | — | `#CBD5E1` |
| `--border` | — | `#E2E8F0` |
| `--border-subtle` | — | `#EDF2F7` |
| `--theme-color` | — | `#04825B` |
| `--theme-color-alt` | — | `#047857` |
| `--success` | — | `#10B981` |
| `--success-hover` | — | `#059669` |
| `--warning` | — | `#F59E0B` |
| `--warning-hover` | — | `#D97706` |
| `--danger` | — | `#EF4444` |
| `--danger-hover` | — | `#DC2626` |
| `--info` | — | `#3B82F6` |
| `--info-hover` | — | `#2563EB` |
| `--feedback-error` | — | `#DC2626` |
| `--ring` | — | `rgba(0, 127, 78, 0.35)` |

## Preset Axes

Stamped as attributes. An absent attribute means that axis's default.

| Attribute | Values | Default |
|:---|:---|:---|
| `data-layout` | tight · comfortable · sprawling | comfortable |
| `data-shape` | round · curved · pro · sharp | curved |
| `data-color` | clean · general · vibrant | general |
| `data-motion` | reduced · active · heavy · springy | active |
| `data-mode` | light · dark | follows prefers-color-scheme |
