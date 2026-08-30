# Fractalstyler

> **A fractal-composition SASS styling system, fluid design token engine, and runtime preset architecture for SvelteKit and AI coding agents.**

[![npm version](https://img.shields.io/npm/v/fractalstyler2.svg?style=flat-square)](https://www.npmjs.com/package/fractalstyler2)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Every styling decision in `Fractalstyler` is a modular fractal: unitary tokens, dimensions, and container primitives that compose into higher layers while retaining mathematical harmony, responsiveness, and zero-runtime bloat.

---

## The Fractal Mental Model

```
Tokens (L0) ──► Dimensions (L1) ──► Containers (L2) ──► Layouts (L3) ──► Shells (L4) ──► Visuals (L5)
```

1. **Tokens (L0)**: 30 semantic color tokens (`_00_tokens.sass`) and fluid Utopia typography/space scales.
2. **Dimensions (L1)**: 17 space families (`.gap-sm`, `.pad-md`, `.marg-xs`), negative margins (`.marg--sm`), literal pixel utilities (`.w-120`, `.radius-8`), and `-mob` / `-desk` bands.
3. **Containers (L2)**: Flexible flow primitives (`.box`, `.row`, `.grid`) with strict physical X/Y axis alignment (`.xcenter`, `.ycenter`, `.xbetween`).
4. **Layouts (L3)**: Gridding Golden Rules ($3\to1$, $4\to2\to1$, $6\to3\to2\to1$), `.card-grid`, reading measure `.prose`, and scroll-snap `.reel`.
5. **Shells (L4)**: Full application frames (`.app-shell`, `.app-header`, `.app-main`, `.sidebar-left`, `.sidebar-right`, `.page-split`, `.drawer`, `.dialog`, `.popover`, `.accordion`).
6. **Visuals & Interactions (L5)**: Bare surfaces (`.bg`, `.surface`, `.raised`), text inks, 1px hairline borders, the button quartet (`.primary`, `.ghost`, `.active`, `.is-icon`), and form controls (`.input`, `.select`).

---

## Quick Start

### 1. Installation

```bash
pnpm add -D sass fractalstyler2
```

Or scaffold the editable SASS source directly into your project:

```bash
npx fractalstyler2 init
```

### 2. Import Stylesheet

In your root layout (`src/routes/+layout.svelte`):

```svelte
<script lang="ts">
  import 'fractalstyler2/styles';
  import { initPresets, getPresetScript } from 'fractalstyler2';
  import { onMount } from 'svelte';

  onMount(() => {
    initPresets();
  });
</script>

<svelte:head>
  {@html `<script>${getPresetScript()}</script>`}
</svelte:head>

<slot />
```

---

## The Four Preset Tuning Axes

Fractalstyler includes a runtime tuning engine governing four fundamental aesthetic axes:

```html
<!-- HTML root attribute contract -->
<html data-layout="tight" data-shape="sharp" data-color="clean" data-motion="active">
```

| Axis | Options | Description |
|:---|:---|:---|
| **Layout** (`data-layout`) | `tight` · `comfortable` *(default)* · `sprawling` | Scales gap and padding density factors independently. |
| **Shape** (`data-shape`) | `round` · `curved` *(default)* · `pro` · `sharp` | Controls corner radii scale down to strict $0\text{px}$ sharp edges. |
| **Color** (`data-color`) | `clean` · `general` *(default)* · `vibrant` | Adjusts background contrasts and surface elevations. |
| **Motion** (`data-motion`) | `reduced` · `heavy` · `active` *(default)* · `springy` | Sets transition durations and spring easing physics. |

---

## The Complete Grepable Registry

The master class dictionary is documented in [**`REGISTRY.md`**](./REGISTRY.md) and programmatically exposed via [`registry.json`](./registry.json).

To regenerate the registry after editing stylesheet files:

```bash
pnpm registry
```

---

## Documentation Index

| Chapter | Document | Scope & Contents |
|:---|:---|:---|
| **01** | [**`01-introduction.md`**](./docs/01-introduction.md) | Philosophy, $L0 \to L5$ mental model, and design invariants. |
| **02** | [**`02-getting-started.md`**](./docs/02-getting-started.md) | Installation, CLI init, SvelteKit setup, and Fractalthemer. |
| **03** | [**`03-structure.md`**](./docs/03-structure.md) | Numbered physical scale (`_00` through `_08`) and cascade order. |
| **04** | [**`04-tokens.md`**](./docs/04-tokens.md) | 30 semantic colors, fluid Utopia scales, and dark/light modes. |
| **05** | [**`05-dimensions.md`**](./docs/05-dimensions.md) | 17 space families, literal px (1–256), and `-mob`/`-desk` bands. |
| **06** | [**`06-containers.md`**](./docs/06-containers.md) | `.box`, `.row`, `.grid`, and physical X/Y axis alignment. |
| **07** | [**`07-layouts.md`**](./docs/07-layouts.md) | Gridding Golden Rules, `.card-grid`, `.prose`, and `.reel`. |
| **08** | [**`08-shells-and-markups.md`**](./docs/08-shells-and-markups.md) | Canonical App Shell, role-bound sidebars, mobile disclosures, overlays. |
| **09** | [**`09-visuals-and-interactions.md`**](./docs/09-visuals-and-interactions.md) | Surfaces, inks, hairline borders, buttons, and form inputs. |
| **10** | [**`10-presets.md`**](./docs/10-presets.md) | Presets runtime, `presets.svelte.ts` API, and Svelte UI pickers. |
| **11** | [**`11-mcp-server.md`**](./docs/11-mcp-server.md) | Model Context Protocol server tools and agent connection configs. |
| **12** | [**`12-agent-plugin.md`**](./docs/12-agent-plugin.md) | `agent-plugins.org` spec, bundled skills (`fractal-styler`, `style-migration`). |
| **13** | [**`13-cookbook.md`**](./docs/13-cookbook.md) | The Zero-SASS Recipe Gallery: real-world UI patterns composed in HTML. |
| **Registry** | [**`REGISTRY.md`**](./REGISTRY.md) | Comprehensive, grepable class dictionary and token table. |

---

## AI Agent Integration & MCP

Fractalstyler2 includes a native MCP server (`fractalstyler2-mcp`) providing 7 tools for AI coding agents:
- `compile_fractals`: Live compilation of indented SASS recipes into CSS.
- `get_design_tokens`: Structured token queries by category.
- `snap_to_tokens`: Snaps raw pixel measurements to nearest token steps.
- `css_to_fractals`: Converts raw CSS declarations to idiomatic markup classes.
- `validate_recipe`: Lints snippets against design system rules.

---

## License

MIT © [Fractal Mandala](https://github.com/fractalmandala)
