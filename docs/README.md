---
id: readme
title: Fractalstyler2 Documentation
type: design
tags: [documentation, index, fractalstyler, design-system, tokens, sveltekit]
summary: Master index of all Fractalstyler2 documentation chapters, covering philosophy, tokens, dimensions, containers, layouts, shells, presets, and MCP agent tooling.
updated: 2026-08-30
---


Welcome to the **Fractalstyler2** design system documentation. Every style unit in this system is a modular fractal: unitary tokens, dimensions, and container classes that compose into higher layers while retaining mathematical harmony and responsiveness.

Available three ways, all from one source:

- **Plain CSS** — `npx fractalstyler2 init --css`, or `import 'fractalstyler2/css'`. No toolchain.
- **Editable SASS** — `npx fractalstyler2 init`. Scaffolds the partials so you can retune the generators.
- **Direct dependency** — `import 'fractalstyler2/styles'` for the SASS entry, `'fractalstyler2/css'` for the compiled one.

---

## Documentation Index

| Chapter | Document | What It Teaches |
|:---|:---|:---|
| **01** | [Introduction](01-introduction.md) | The fractal mental model ($L0 \to L5$), philosophy, and design principles. |
| **02** | [Getting Started](02-getting-started.md) | Installation (CSS or SASS), SvelteKit configuration, themes and preset runtime. |
| **03** | [Structure & Hierarchy](03-structure.md) | Directory anatomy, the canonical numbered physical scale, and cascade order. |
| **04** | [Tokens & Theming](04-tokens.md) | The 31 semantic colors, fluid Utopia type and space scales, and dark/light modes. |
| **05** | [Dimensions & Spacing](05-dimensions.md) | Level 1 space families (gaps, pads, margins), literal pixel utilities, and `-mob`/`-desk` bands. |
| **06** | [Containers & Flow](06-containers.md) | Level 2 `.box`, `.row`, and `.grid` primitives with strict physical X/Y axis alignment. |
| **07** | [Layouts & Grids](07-layouts.md) | Level 3 gridding golden rules ($3\to1, 4\to2\to1, 6\to3\to2\to1$), `.card-grid`, `.prose`, frames, and reels. |
| **08** | [Shells & Canonical Markups](08-shells-and-markups.md) | Level 4 application shells, role-bound sidebars, mobile disclosure physics, and overlays. |
| **09** | [Visuals & Interactions](09-visuals-and-interactions.md) | Level 5 bare surfaces, text inks, borders, typography, button quartet, and form inputs. |
| **10** | [Presets & Runtime Tuning](10-presets.md) | The 4 preset axes (Layout, Shape, Color, Motion), Svelte 5 runtime state, and UI pickers. |
| **11** | [MCP Server](11-mcp-server.md) | Model Context Protocol server tools (`compile_fractals`, `snap_to_tokens`, `validate_recipe`). |
| **12** | [Agent Plugin & Coding Skills](12-agent-plugin.md) | `agent-plugins.org` architecture, the bundled `fractal-styler` skill, and agent golden rules. |
| **13** | [Zero-SASS Cookbook & Recipe Gallery](13-cookbook.md) | Real-world UI patterns (segmented controls, tabs, modals, search) built with pure Fractalstyler2. |

---

## The Core Heuristic

> **Tokens (L0)** $\rightarrow$ **Dimensions (L1)** $\rightarrow$ **Containers (L2)** $\rightarrow$ **Layouts (L3)** $\rightarrow$ **Shells (L4)** $\rightarrow$ **Visuals & Interactions (L5)**

1. **Tokens (L0)** define fluid scales (`--space-sm`, `--text-lg`) and 31 semantic colors (`--bg-surface`, `--text-primary`, `--theme-color`).
2. **Dimensions (L1)** spread out space with 17 role-split families (`.gap-sm`, `.pad-md`, `.marg-xs`, `.radius-8`).
3. **Containers (L2)** establish flow with `.box`, `.row`, `.grid` and physical alignment (`.xcenter`, `.ycenter`, `.xbetween`).
4. **Layouts (L3)** enforce harmonious reflow with `.grid-1` through `.grid-6`, `.card-grid`, and `.prose`.
5. **Shells (L4)** provide responsive application frames (`.app-shell`, `.app-header`, `.app-main`, `.sidebar-left`, `.sidebar-right`).
6. **Visuals (L5)** complete the look with surfaces (`.surface`, `.raised`), typography, buttons (`.button.primary`), and interactive controls.
