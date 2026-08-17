---
title: AGENTS
description: Progressive-discovery entry point for agents — golden rules, intent→command routing, and pointers into the registry and docs.
---

# AGENTS — start here

This is the **entry point** for any agent working in fractalstyler2. It is
deliberately short. It gives you the rules and a routing table, then sends you to
the [command registry](docs/agents/registry.md), which sends you to the exact
[docs](docs/) you need. Load only what the task requires — don't read everything.

## What this package is (10 seconds)

A styling system where **a fractal is a SASS mixin**. Components and layouts are
recipes of smaller fractals. You build UI by *composing fractals*, not by writing
raw CSS or long utility strings. Source of truth is `src/lib/**`; `dist/` is
generated — never edit it.

## The golden rules (always)

1. Never hardcode a value a token covers — use `+gap(m)`, `+radius(12)`, `+bg(surface)`.
2. Compose fractals; write raw CSS only for genuinely unique lines.
3. State on `data-*` / `aria-*`, never modifier classes.
4. Markup stays thin and semantic; mobile-first, grow with `+at()`.
5. Edit `src/lib/**` only. Verify with `npx sass src/lib/styles/index.sass:/tmp/check.css` or `npm run dev` (pnpm: `pnpm dev`).

(Full text: [registry → Golden rules](docs/agents/registry.md#golden-rules).)

## Discovery ladder

```
1. AGENTS.md (this file)         → rules + routing
2. docs/agents/registry.md       → the command that matches the request
3. the command's "Primary docs"  → read ONLY those docs/ files
4. do the work; verify; report
```

## Route the request → a command

| The user asks to… | Command | Then read |
| --- | --- | --- |
| build a page or route | [`fs2:page`](docs/agents/registry.md#fs2page) | docs/03, 07, 08 |
| build a reusable component/block | [`fs2:component`](docs/agents/registry.md#fs2component) | docs/04, 07 |
| build a page layout/template | [`fs2:layout`](docs/agents/registry.md#fs2layout) | docs/04, 07 |
| add a new mixin/primitive | [`fs2:fractal`](docs/agents/registry.md#fs2fractal) | docs/02, 04, DEVELOPERS |
| add a theme / change tokens | [`fs2:theme`](docs/agents/registry.md#fs2theme) | docs/05 |
| clean up / convert existing CSS | [`fs2:refactor`](docs/agents/registry.md#fs2refactor) | docs/01, 04, 06 |
| review/audit for idiom | [`fs2:review`](docs/agents/registry.md#fs2review) | docs/01, 02 |

If nothing matches, read [docs/README.md](docs/README.md) to orient, then pick
the closest command.

## Minimal quickstart (for any build task)

```sass
// compose your own from the API — emits nothing until called
@use 'fractalstyler2/fractals' as *

.thing
	+surface(surface, s, 12)   // material: bg + border + radius + pad
	+stack(2xs)                // arrangement: flex column + gap
	&[data-variant='loud']     // state via attribute
		+shadow(lg)
```

```svelte
<!-- or use shipped classes; markup stays semantic -->
<section class="grid-3">
	<article class="card" data-elevated><h3 class="text-lg">…</h3></article>
</section>
```

## For maintainers, not feature work

If the task is about building, packaging, versioning, or publishing the library
itself (not building UI *with* it), go to [DEVELOPERS.md](DEVELOPERS.md).
