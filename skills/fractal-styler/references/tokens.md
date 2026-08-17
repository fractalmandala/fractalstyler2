# Design Tokens Reference

## Space Scale (Fluid Utopia)
| Step | Token Variable | Approximate Px | Clamp Formula |
| :--- | :--- | :--- | :--- |
| `3xs` | `--space-3xs` | ~5px | `clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem)` |
| `2xs` | `--space-2xs` | ~9px | `clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem)` |
| `xs`  | `--space-xs`  | ~14px | `clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem)` |
| `s`   | `--space-s`   | ~18px | `clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)` |
| `m`   | `--space-m`   | ~27px | `clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem)` |
| `l`   | `--space-l`   | ~36px | `clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem)` |
| `xl`  | `--space-xl`  | ~54px | `clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem)` |
| `2xl` | `--space-2xl` | ~72px | `clamp(4.5rem, 4.2955rem + 0.9091vw, 5rem)` |
| `3xl` | `--space-3xl` | ~108px | `clamp(6.75rem, 6.4432rem + 1.3636vw, 7.5rem)` |
| `s-l` | `--space-s-l` | ~18→40px | `clamp(1.125rem, 0.5625rem + 2.5vw, 2.5rem)` |

## Typography Scale
| Step | Token Variable | Fluid Clamp |
| :--- | :--- | :--- |
| `xs`  | `--text-xs`  | `0.75rem` (12px) |
| `sm`  | `--text-sm`  | `clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem)` |
| `md`  | `--text-md`  | `clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)` |
| `lg`  | `--text-lg`  | `clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem)` |
| `xl`  | `--text-xl`  | `clamp(1.62rem, 1.4837rem + 0.6057vw, 1.9531rem)` |
| `2xl` | `--text-2xl` | `clamp(1.944rem, 1.7405rem + 0.9044vw, 2.4414rem)` |
| `3xl` | `--text-3xl` | `clamp(2.3328rem, 2.0387rem + 1.3072vw, 3.0518rem)` |
| `4xl` | `--text-4xl` | `clamp(2.7994rem, 2.384rem + 1.8461vw, 3.8147rem)` |

## Radius Scale
`0`, `2`, `4`, `6`, `8`, `12`, `16`, `24`, `full`

## Color & Surface Roles
* **Surfaces**: `--bg`, `--bg-surface`, `--bg-raised`
* **Ink**: `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse`
* **Borders**: `--border`, `--border-strong`
* **Brand**: `--theme`, `--theme-hover`, `--theme-active`, `--ring`
