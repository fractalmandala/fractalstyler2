---
title: fractalstyler2 Documentation
description: Index of all user guides — philosophy, architecture, reference, tokens, and design laws.
---

# fractalstyler2 Documentation

Welcome to the **fractalstyler2** design system documentation. Every style unit in this system is a SASS mixin ("a fractal"), and every component and page layout is a composable recipe of smaller fractals.

Available as a **shadcn-style scaffolder** (`npx fractalstyler2 init`) and as a **direct package import** (`import 'fractalstyler2/styles'`).

---

## Complete Guide Index

| Chapter | Document | What It Teaches |
|---|---|---|
| **01** | [Philosophy](01-philosophy.md) | The fractal model, self-similarity, dual consumption, and why CUBE CSS works |
| **02** | [Structure & Hierarchy](02-structure.md) | File anatomy, the canonical 12-file numbered scale, and cascade rules |
| **03** | [Getting Started](03-getting-started.md) | CLI scaffolding, SvelteKit project setup, and your first component |
| **04** | [Fractals Reference](04-fractals-reference.md) | Complete manual for every atom (`+box`, `+row`, `+bg`) and molecule (`+stack`, `+surface`) |
| **05** | [Tokens & Theming](05-tokens-and-theming.md) | Fluid Utopia scales, the strict 21-variable contract, and light/dark modes |
| **06** | [Utilities Reference](06-utilities.md) | 1:1 markup classes, directional padding/margin (`.pad-top-*`), and `.hide-desktop` |
| **07** | [Components & Layouts](07-components-and-layouts.md) | Built-in blocks (`.card`, `.select`, `.badge`) and layouts (`.docs`, `.card-grid`) |
| **08** | [Recipes & Patterns](08-recipes.md) | Step-by-step practical component builds: pricing card, modal dialog, and forms |
| **09** | [Migration from v1](09-migration-from-v1.md) | Upgrading from unnumbered partials to the numbered hierarchy |
| **10** | [MCP Server](10-mcp-server.md) | Model Context Protocol server for Antigravity, OpenCode, and Claude |
| **11** | [Agent Plugin Spec](11-agent-plugin.md) | agent-plugins.org v1.0.0 architecture and automated tool integration |
| **Design** | [DESIGN.md](../DESIGN.md) | Golden UI invariants, Reading Column Law, Partition Law, and Card Containment |

---

## The One-Paragraph Summary

A fractal is a mixin: `+box`, `+gap(m)`, `+surface(...)`. You consume a fractal two ways:
1. **Composed into a Svelte component**: `.card { +surface(surface, s, 6) +stack(s) }`
2. **Projected to a class in markup**: `<div class="box gap-s pad-m bg-surface radius-6">...</div>`

Atoms compose into molecules, molecules into components, components into layouts. All numeric values pass through resolvers (`space(m)` $\to$ `var(--space-m)`, `space(18)` $\to$ `18px`), creating a single shared vocabulary between CSS and markup with zero bloat.
