---
title: fractalstyler2 documentation
description: Index of all user docs — philosophy, structure, usage, reference, and recipes.
---

# fractalstyler2 docs

A fractal-composition styling system for SvelteKit. Every style unit is a SASS
mixin ("a fractal"); components and layouts are recipes of smaller fractals.

Read in order if you're new; jump directly if you know what you need.

| # | Doc | What it covers |
| --- | --- | --- |
| 01 | [Philosophy](01-philosophy.md) | The fractal model, self-similarity, dual consumption, why CUBE |
| 02 | [Structure](02-structure.md) | File/folder anatomy, the four tiers, cascade order |
| 03 | [Getting started](03-getting-started.md) | Install, wire into SvelteKit, your first page |
| 04 | [Fractals reference](04-fractals-reference.md) | Every atom & molecule mixin, arguments, examples |
| 05 | [Tokens & theming](05-tokens-and-theming.md) | Token scales, color mode, named themes |
| 06 | [Utilities](06-utilities.md) | The projected markup classes |
| 07 | [Components & layouts](07-components-and-layouts.md) | Shipped blocks/layouts and how to author new ones |
| 08 | [Recipes](08-recipes.md) | Worked builds: 3-col grid, hero, docs page, dashboard |

For agents: start at [`AGENTS.md`](../AGENTS.md) → [agent registry](agents/registry.md).
For maintainers: [`DEVELOPERS.md`](../DEVELOPERS.md).

## The one-paragraph version

A fractal is a mixin: `+box`, `+gap(m)`, `+surface(...)`. You consume a fractal
two ways — bound to a class for markup (`.gap-m { +gap(m) }`) or composed into a
component (`.card { +surface(...) +stack(...) }`). Atoms compose into molecules,
molecules into components, components into layouts — the same move at every
scale. Values route through resolvers that prefer the finite token scale
(`+gap(m)` → `var(--space-m)`) and fall back to raw units (`+gap(16)` → `16px`),
so there is one vocabulary and no utility-class explosion.
