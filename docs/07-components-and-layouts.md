---
title: Components & layouts
description: The shipped blocks and layout templates, their markup contracts, and how to author new ones.
---

Everything here is authored in `src/lib/styles/` (or `$lib/styles/`) by composing fractals. Each
class is a short recipe; state rides on `data-*`.

## Blocks (`_blocks.sass`)

| Class | Markup contract | Notable exceptions |
| --- | --- | --- |
| `.card` | any container | `[data-elevated]` adds a shadow |
| `.panel` | any container | raised surface, larger radius |
| `.badge` | inline label | — |
| `.avatar` | wraps an img or initials | sizes via `--avatar-size` |
| `.input` | `<input>` / `<textarea>` | `:focus-visible` ring |
| `.button` | `<button>` / `<a>` | `[data-variant='primary' | 'ghost']` |
| `.divider` | `<hr>` or empty div | — |
| `.kbd` | inline `<kbd>` | — |

```svelte
<article class="card" data-elevated>
	<span class="badge">new</span>
	<h3 class="text-lg">Title</h3>
	<p class="body muted">Body copy.</p>
</article>

<button class="button" data-variant="primary">Save</button>
```

## Layouts (`_layouts.sass`)

| Class | Shape | Child slots |
| --- | --- | --- |
| `.grid-3` | responsive 1 → 2 → 3 columns | grid items |
| `.card-grid` | intrinsic auto-fit (tracks ≥ 16rem) | grid items |
| `.hero` | full-height cover, centered message | `.center` (the focal child) |
| `.holy-grail` | header / (nav · main · aside) / footer | `.hg-header` `.hg-nav` `.hg-body` `.hg-aside` `.hg-footer` |
| `.docs` | sidebar nav + reading column + TOC | `.docs-nav` `.docs-main` `.docs-toc` |
| `.app-shell` | sticky header, fluid body, footer | `.app-header` `.app-main` `.app-footer` |

```svelte
<div class="holy-grail">
	<header class="hg-header">…</header>
	<div class="hg-body">
		<nav class="hg-nav">…</nav>
		<main>…</main>
		<aside class="hg-aside">…</aside>
	</div>
	<footer class="hg-footer">…</footer>
</div>
```

`.holy-grail` collapses to a single column below `lg`; `.docs` reveals the nav at
`md` and the TOC at `xl`.

## Authoring a new block

1. Open `src/lib/styles/_blocks.sass` (or your local `$lib/styles/_blocks.sass`).
2. Compose from fractals; write raw CSS only for genuinely unique declarations.
3. Put variants/states on `data-*`, not modifier classes.

```sass
.callout
	+surface(raised, m, 12)      // material
	+stack(2xs)                  // rhythm
	+border(left, var(--theme))  // unique accent
	&[data-tone='danger']
		+border(left, var(--feedback-danger, #ef4444))
```

## Authoring a new layout

1. Open `src/lib/styles/_layouts.sass` (or your local `$lib/styles/_layouts.sass`).
2. Start from a grid or `+box`, name child slots as plain descendant classes.
3. Reshape at breakpoints with `+at()`; keep the mobile-first base first.

```sass
.split
	+box
	+gap(m)
	+at(md)
		display: grid
		grid-template-columns: 1fr 1fr
```

## Do you need a component at all?

If a class string is used once, leave it in markup. Promote to a component when
the same string recurs, or when the arrangement carries meaning worth naming.
That judgement is the whole craft — see [Philosophy §3](01-philosophy.md).

Next: [Recipes](08-recipes.md).
