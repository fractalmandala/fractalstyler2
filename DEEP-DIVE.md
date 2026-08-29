# A deep dive into the fractals styling system

*fractalstyler2* is a SASS design system for SvelteKit applications.

You write styles as indented SASS mixins, called **fractals**. During the build, the Sass compiler turns those mixin calls into regular CSS.

This makes fractals look like a CSS-in-JS library or a utility framework while you write them. But the browser receives plain, semantic CSS.

There is no runtime. No style injection. No JavaScript styling layer at all.

That distinction is the key to understanding the system.

The fractal model changes how we author CSS. It does not replace the need to understand it. If you are still learning CSS, learn layout, the cascade, and responsive design first. The system sits on top of those ideas — it encodes a methodology called [CUBE CSS](https://cube.fyi/) into mixins — but every compiled result is CSS you could have written by hand.

In this deep dive we will set it up with SvelteKit, walk its layers from tokens to page layouts, and look at the tradeoffs.


## The problem it tries to solve

CSS is easy to start with.

Create a class, add a few properties, and use the class in your markup.

The problems appear when an application grows.

You start asking questions like these:

- Is this class name already used?
- Can I delete this rule?
- Why does another selector override it?
- Which file owns this style?
- How do I customize a shared component safely?
- How much unused CSS are we shipping?
- Why does every card have a different padding?

Teams solve these problems in different ways: naming systems, CSS Modules, utility frameworks, CSS-in-JS libraries, and design systems.

fractalstyler2 makes a specific set of choices:

- every reusable styling decision is a **mixin** ("a fractal"), defined once
- components and layouts are **recipes** of smaller fractals
- values route through **resolvers** — token scale first, raw unit as escape hatch, same call site
- utility classes are a **generated projection** of the same mixins, not a parallel vocabulary
- state rides on `data-*` / `aria-*` attributes, never modifier classes
- the cascade is ordered by file number, so overrides win without `!important`
- all colors resolve from one small token contract, so themes are swappable

The result is a system where a `.card`, a `.docs` page layout, and a `.hero` section are all read the same way: as a short list of fractal calls.


## The mental model

The fractal flow looks like this:

```
token scales + resolvers  (Sass data — zero CSS)
↓
atoms        (+box +gap +pad +radius +bg +ink)
↓
molecules    (+stack +cluster +surface +cols +cover)
↓
recipes      (=control =card =select =partition)
↓
projections  (.card .button blocks, .gap-* .pad-* utilities)
↓
layouts      (.grid-3 .hero .docs .holy-grail)
↓
the browser receives regular CSS
```

Suppose we write this:

```sass
=gap($v: s)
	gap: space($v)
```

`gap` is a fractal. It makes exactly one styling decision — the gap between flex or grid children — and routes the value through the `space()` resolver.

Call it inside your own selector:

```sass
.toolbar
	+row
	+gap(m)
```

The compiler emits:

```css
.toolbar {
	display: flex;
	gap: var(--space-m);
}
```

And `--space-m` is not a magic constant. It is a fluid value:

```css
--space-m: clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem);
```

The same fractal can also be projected into a utility class, which ships once and is reused from markup. Same source of truth, two consumers. We will come back to that — it is the signature idea of the system.


## Set up with SvelteKit

There are two ways to consume the system, and both end in the same place: editable SASS in your project.

### Scaffold mode (shadcn-style)

Copy the complete design system into your project:

```bash
npx fractalstyler2 init
```

This creates the numbered stylesheet scale in `src/lib/styles/`. Import the master stylesheet once in your root `src/routes/+layout.svelte`:

```svelte
<script>
	import '$lib/styles/index.sass';
</script>
```

### Package mode

Or add it as a dependency:

```bash
pnpm add fractalstyler2
pnpm add -D sass
```

```svelte
<script>
	import 'fractalstyler2/styles';
</script>

<style lang="sass">
	@use 'fractalstyler2/fractals' as *

	.card
		+surface(surface, s, 6)
		+stack(s)
</style>
```

### The two entrypoints

The whole import story rests on exactly two files:

```sass
// _fractals.sass — the pure API barrel
@forward '01_config'
@forward '03_responsive'
@forward '04_atoms'
@forward '05_molecules'
@forward '06_recipes'
```

```sass
// index.sass — the master stylesheet
@forward 'fractals'

@use '02_fonts' as *
@use '00_tokens' as *
@use '07_base' as *
@use '08_blocks' as *
@use '09_utilities' as *
@use '10_layouts' as *
@use '11_own' as *
```

`_fractals.sass` forwards only the mixin layers. It emits **0 bytes of CSS**. This is the rule that makes the system scale: you can `@use` it inside a hundred component `<style>` blocks without leaking a single duplicate `:root` block or class rule. Only `index.sass`, loaded once globally, is allowed to emit.

Components import the barrel. The layout imports the cascade. Never the other way around.


## Your first composed component

Create a pricing card in any component:

```svelte
<div class="pricing-card">
	<span class="badge" data-status="released">Pro Plan</span>
	<h3>$29/mo</h3>
	<p>Full access to all fractal components and layouts.</p>
</div>

<style lang="sass">
	@use '$lib/styles/fractals' as *

	.pricing-card
		+surface(surface, m, 6, md)   // surface material: bg(surface) + radius(6px) + pad(m) + shadow(md)
		+stack(s, start)              // flex-column + gap(s) + top-anchored flow
</style>
```

Two lines. Read them as English: *this is a surface of the "surface" material, medium padding, 6px radius, medium elevation. It flows as a vertical stack, small gap, anchored to the top.*

The compiler expands each mixin inline:

```css
.pricing-card {
	background-color: var(--bg-surface);
	border-radius: var(--radius-6);
	padding: var(--space-m);
	box-shadow: var(--shadow-md);
	display: flex;
	flex-direction: column;
	gap: var(--space-s);
	align-items: flex-start;
}
```

This is the core workflow of the system:

1. compose fractals inside your own selector
2. let the compiler write the CSS

Everything else builds on those two moves.


## Why it is called fractal

In natural fractals, the same geometric formula operates whether you examine a coastline from orbit or an inlet up close. The system applies the same principle: **each tier is a recipe of the tier below**.

```
Config      space(), radius(), surface(), ink()   ← scales-as-data + resolvers
  ↓
Atoms       +box  +gap  +pad  +border  +radius    ← one decision each
  ↓
Molecules   +stack  +cluster  +surface  +cols     ← graphs of atoms
  ↓
Recipes     =control  =card  =select  =partition  ← parametric archetypes
  ↓
Projections .card .badge  ·  .pad-* .gap-*        ← classes for markup
  ↓
Compositions .grid-3  .hero  .docs  .holy-grail    ← page-scale recipes
```

The proof is in the source. The `.grid-3` layout is not a wall of media queries — it is one molecule call:

```sass
.grid-3
	+cols((base: 1, sm: 2, lg: 3), s)
```

And `+cols` is itself a loop over the breakpoint mixins:

```sass
=cols($map, $gap: s)
	display: grid
	grid-auto-flow: row
	+gap($gap)
	@each $bp, $n in $map
		@if $bp == base
			grid-template-columns: repeat($n, minmax(0, 1fr))
		@else
			+at($bp)
				grid-template-columns: repeat($n, minmax(0, 1fr))
```

You read a whole-page `.docs` layout the same way you read a `.card`. That self-similarity is the reason the system stays small as it grows: new complexity is always "another recipe of things that already exist."


## Dual consumption: mixin in SASS or class in markup

A fractal is defined once. There are exactly two ways to use it.

**A — as a semantic composition** (inside your own selector):

```sass
.hero
	+cover(80vh, xl)
	> .center
		+stack(m, center)
```

**B — as a utility class** (bound to a name, used from markup). The utilities file projects the same atoms through simple loops:

```sass
@each $s in $space-steps
	.gap-#{$s}
		+gap($s)
	.pad-#{$s}
		+pad($s)
	.px-#{$s}
		+px($s)
```

```svelte
<div class="box gap-m pad-l">…</div>
```

This dissolves the old "utility CSS vs. component CSS" argument. There is one vocabulary of fractals, and you decide per fractal whether it lives in markup or in a component recipe.

Ubiquitous atoms like `box`, `gap-*`, and `pad-*` are worth projecting into single classes — the CSS ships once instead of being inlined everywhere. Bounded component recipes are worth composing in SASS, where the readability win is large and the duplication is small. You choose. That control is the whole point.


## Resolvers: one call, token or raw

Fractals never hardcode a value. Every value routes through a resolver that prefers the finite token scale and falls back to a raw unit.

The universal resolver is a small, strict function:

```sass
@function tok($group, $v)
	@if $v == null
		@return null
	@if meta.type-of($v) == number
		@if math.is-unitless($v)
			@return var(--#{$group}-#{$v})
		@return $v
	@if meta.type-of($v) == string
		@if $v == 'auto' or $v == 'inherit' or $v == 'initial' or $v == 'unset' or $v == 'none' or $v == 'transparent'
			@return $v
		@return var(--#{$group}-#{$v})
	@return $v
```

In practice it resolves three kinds of input:

```
space(m)    → var(--space-m)     // the design vocabulary (default)
space(18)   → 18px               // escape hatch, same call
space(2rem) → 2rem               // passthrough
```

So there is one `+gap()` fractal — the value is an argument, not a new class. No `gap16`, `gap18`, `gap22` explosion. The token scale is the default vocabulary; raw values are the exploratory escape hatch, and they live in the *same* call site. Promoting an experimental raw value to a token is a one-character edit.

The system is deliberately not opinionated about units. Token steps, pixel numbers, and CSS units (`2rem`, `80vh`) all resolve.


## The token scales

Tokens live in `_00_tokens.sass` as CSS custom properties, and the same scales are mirrored as Sass data in `_01_config.sass` so the resolvers can validate steps at compile time.

Spacing and typography are **fluid** — Utopia-style clamps that scale between a 360px and 1240px viewport:

```css
--text-md: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem);
--space-s: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem);
--space-s-l: clamp(1.125rem, 0.5625rem + 2.5vw, 2.5rem);  /* one-token responsive section spacing */
```

Radius is a fixed concentric hierarchy — crisp and subtle by design:

```css
--radius-3: 3px;    /* keycaps, tags, badges */
--radius-4: 4px;    /* buttons, inputs, toolbars */
--radius-6: 6px;    /* cards, surfaces, frames, panels */
```

There are also control heights (`--control-h-sm/md/lg`), three shadow steps, a z-index ladder, and a reading measure:

```css
--measure: 65ch;
```

Everything visual that is not a color comes from this scale. And because every fractal routes through `space()`, `radius()`, and friends, changing one token reflows the entire system without touching a component.


## The token contract and themes

All colors resolve from one small contract defined once in `_00_tokens.sass`:

- **Surfaces** (10): `--bg`, `--bg-surface`, `--bg-raised`, `--bg-panel`, `--bg-footer`, `--bg-popover`, `--bg-dialog`, `--bg-terminal`, `--bg-input`, `--bg-canvas`
- **Ink** (4): `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse`
- **States** (3): `--state-hover`, `--state-hover-subtle`, `--state-selected`
- **Borders & accents** (2): `--border`, `--border-subtle`, plus `--theme-color` / `--theme-color-alt`

The invariants guide extends the contract with semantic feedback pairs — `--success`, `--warning`, `--danger`, `--info` and their hovers — and the focus ring `--ring`. Thirty-ish tokens total. The rule is zero tolerance: no foreign variables like `--card`, `--primary`, or `--destructive`. If a color is not in the contract, the design is wrong, not the theme.

Color modes are built as mixins over the contract:

```sass
=light-theme-tokens
	color-scheme: light
	--bg: #fdfefe
	--text-primary: #0f172a
	--theme-color: #04825B
	// …the full palette

=dark-theme-tokens
	color-scheme: dark
	--bg: #0E1118
	--text-primary: #EDF2F7
	--theme-color: #38BDF8
	// …the full palette
```

And they are wired with a deliberate SSR-safe order:

```sass
:root
	+light-theme-tokens        // light is the marker-free default

@media (prefers-color-scheme: dark)
	:root:not([data-mode='light'])
		+dark-theme-tokens      // follow the OS unless the user chose

[data-mode='dark']
	+dark-theme-tokens          // explicit override wins

[data-mode='light']
	+light-theme-tokens
```

Light being the unmarked default means tokens are defined during server rendering and with JavaScript disabled — no flash of an unstyled or wrongly-themed page.

A small JS API flips the attribute:

```js
import { toggleMode, setMode } from 'fractalstyler2';

toggleMode();     // flip light/dark
setMode('dark');  // force mode
```

Notice what components do *not* do: they never read the mode. A card consumes `var(--bg-surface)`. The theme decides what that value is. Components consume semantic tokens; themes decide the values. If you use the companion [fractalthemer](https://github.com/fractalmandala/fractalthemer) package to generate palettes, this contract is what makes its themes drop-in: swap the token values, change nothing else. (One warning from the docs: if you use fractalthemer, do not hand-edit the color token variables, or the themes will no longer work.)


## Layout composition without counting columns

A large share of responsive CSS is manual column accounting. The system's layout molecules remove most of it by making containers reflow intrinsically.

`+auto-grid` fits as many columns as will hold the minimum track — no breakpoints, no counting:

```sass
=auto-grid($min: 15rem, $gap: s)
	display: grid
	grid-template-columns: repeat(auto-fit, minmax(min(#{$min}, 100%), 1fr))
	gap: space($gap)
```

`+with-sidebar` is the classic Every Layout sidebar: an intrinsic rail beside a fluid main that wraps when tight — with `flex-grow: 999` doing the work of a media query:

```sass
=with-sidebar($rail: 240px, $gap: s, $min: 60%)
	+row
	+wrap
	+gap($gap)
	> .rail
		flex-basis: $rail
		flex-grow: 1
	> .flow
		flex-basis: 0
		flex-grow: 999
		min-width: $min
```

`+cover` fills a min-height and centers a focal child. `+reel` is a scroll-snap rail. `+frame` is an aspect-ratio media box. Each is a named layout decision you can call by name.

When column count genuinely matters, use `+cols` with a per-breakpoint map, or the breakpoint mixins directly:

```sass
+at(lg)      // min-width media query
+below(md)   // max-width
+between(sm, lg)
```

They compose inside any selector, and they compose inside other fractals — `+cols` and `.holy-grail` use them internally.

The one opinion the system holds: in constrained reading measures (`≤ 760px` docs columns), grids never exceed 2 columns. Three- and four-column grids are reserved for full-width viewports. It is an invariant, not a suggestion — it is written into the golden rules the package ships for both humans and agents.


## Recipes: parametric archetypes

One tier up from molecules sit **recipes** — macro mixins that encode a whole component archetype but take arguments instead of locking choices.

The workhorse is `=control`, the universal interactive primitive underneath buttons, select triggers, and accordion headers:

```sass
=control($size: md, $radius: 4)
	+row(null, center)
	+gap(2xs)
	+radius($radius)
	+border(all, var(--border))
	+bg(surface)
	+ink(primary)
	+weight(500)
	user-select: none
	cursor: pointer
	text-decoration: none
	transition: background 120ms ease, border-color 120ms ease, transform 80ms ease

	@if $size == sm
		height: var(--control-h-sm, 26px)
		+px(2xs)
		+type(xs)
	@else if $size == lg
		height: var(--control-h-lg, 38px)
		+px(s)
		+type(md)
	@else
		height: var(--control-h-md, 32px)
		+px(xs)
		+type(sm)

	&:hover
		+bg(raised)
		border-color: var(--border-subtle)

	&:active
		transform: scale(0.985)

	&:focus-visible
		+ring

	&:disabled, &[aria-disabled='true']
		opacity: 0.5
		cursor: not-allowed
		pointer-events: none
```

Read what it contains: geometry from the control-height tokens, material from the surface contract, hover from the state tokens, focus from the ring, and a disabled state via `aria-disabled`. Nothing is hardcoded — pass `sm` or `lg` and the size knobs change together coherently.

`=card` shows how recipes stack:

```sass
=card($bg: surface, $pad: null, $radius: 6, $elevation: none)
	+surface($bg, $pad, $radius, $elevation)
	+box(stretch, start)
	+gap(s)
	height: 100%
	text-align: left
```

A card *is* a surface material plus a top-anchored stack. Note the `null` default for padding — the recipe deliberately does not lock density. That is a core design decision: primitives set structure, alignment, and material; they never hardcode arbitrary paddings, fixed heights, or locked radii.

Some recipes encode invariants directly. `=partition` makes the "content never touches a divider line" rule impossible to violate:

```sass
=partition($side: top, $pad: s)
	@if $side == top
		margin-top: auto      // pin to the bottom of the card
		padding-top: space($pad)   // reciprocal breathing room
		border-top: 1px solid var(--border)
```

`=select` encodes browser-fighting lore that is easy to lose: optical `line-height: 1.2` to stop vertical glyph truncation in WebKit, `appearance: none`, a 28px right padding, and an embedded SVG chevron.

`=collapsible` replaces height-animation hacks with a grid-rows transition:

```sass
=collapsible
	display: grid
	grid-template-rows: 0fr
	transition: grid-template-rows 140ms cubic-bezier(0.16, 1, 0.3, 1)

	&[data-open='true'], &[aria-expanded='true']
		grid-template-rows: 1fr

	> .collapsible-inner
		overflow: hidden
		min-height: 0
```

Others — `=badge`, `=input`, `=kbd`, `=dialog-surface`, `=popover-surface`, `=marquee`, `=divider` — follow the same shape: a named pattern, parameterized, composing the layers below.


## State rides on attributes

Variants and states ride on `data-*` / `aria-*`, never on modifier classes:

```sass
.button
	&[data-variant='primary']
		background: var(--theme)
```

```svelte
<button class="button" data-variant="primary">Save</button>
```

Compare this with the classic `.btn .btn--primary` convention. Attribute state keeps class strings short and structural, and it bridges HTML, CSS, and Svelte runes without class thrashing — in a component, `data-active={selected}` is one reactive attribute, not a class-list computation.

The shipped blocks use it consistently. The `.badge` block colors itself from a single attribute:

```sass
.badge
	+badge
	&[data-status='released']
		color: var(--theme-color)
		background: rgba(16, 185, 129, 0.1)
		border-color: rgba(16, 185, 129, 0.25)
	&[data-status='wip']
		color: #d97706
		background: rgba(245, 158, 11, 0.1)
		border-color: rgba(245, 158, 11, 0.25)
	&[data-status='archived']
		+ink(muted)
```

And complex states compose: `.docs[data-drawer-open='true'] > .docs-nav` slides the mobile drawer; `[data-elevated]` adds elevation to a `.card`. One vocabulary for state everywhere: the element describes itself.


## Blocks and utilities: the projections

Below the mixins, two files emit the markup-facing classes.

`_08_blocks.sass` provides baseline semantic classes by composing recipes:

```sass
.card
	+card($pad: null, $radius: 6)
	&[data-elevated]
		+shadow(md)
	> :is(footer, .card-footer, .meta-bottom)
		margin-top: auto
		padding-top: var(--space-xs)
		border-top: 1px solid var(--border)
```

Note what this block does *not* do: it does not lock padding or radius (the recipe defaults stay open), and it encodes the pinned-partition card footer as a descendant rule so every `.card` gets the invariant for free.

`.button` composes `=control` with named variants (`.primary`, `.ghost`), and `[data-active]` handles toggled state. `.select`, `.input`, `.badge`, `.avatar`, `.kbd`, `.divider` — each is a thin projection of its recipe, not a parallel implementation. One source of truth: fix the recipe, every projection benefits.

`_09_utilities.sass` is the 1:1 markup projection of atoms and molecules — plus the alignment modifiers that make utilities composable without new classes:

```sass
.row
	+row
	&.wrap
		+wrap
	&.ycenter
		align-items: center
	&.xbetween
		justify-content: space-between
```

```svelte
<div class="row wrap ycenter xbetween gap-xs">…</div>
```

The load order is the safety mechanism. `index.sass` emits blocks before utilities:

```sass
@use '08_blocks' as *
@use '09_utilities' as *
```

Both layers are single-class selectors with equal specificity — so when you drop `.pad-s` onto an element inside a `.card`, the utility wins *by file order*, cleanly, with no `!important` and no specificity war. That is the cascade guarantee at the heart of the file-numbering scheme.


## Understand the constraints

The model buys its guarantees by giving things up. Four constraints matter.

**Mixins inline their output.** If 50 components each call `+box`, the `display: flex; flex-direction: column;` pair is emitted 50 times, where a single `.box` utility class ships once. Two things make this a non-issue: gzip and brotli collapse repeated declarations extremely well, and the utilities layer exists precisely for ubiquitous atoms. Reserve mixin-composition for components, where duplication is bounded and the readability win is large. You choose per fractal.

**The barrel emits nothing.** Component `<style>` blocks must import `_fractals.sass`, never `index.sass`. Importing the master file from a hundred components would duplicate every token block and every utility class a hundred times. The two-entrypoint rule is not a convention — it is the difference between a system and a bug.

**No foreign variables.** All color decisions resolve from the token contract. An ad-hoc `--my-purple` is a broken theme waiting to happen — it will not flip with `data-mode`, and fractalthemer cannot restyle it.

**It is compile-time only.** Theming works by swapping CSS custom properties under attributes, not by generating styles from JavaScript. That is what keeps the runtime at zero — but if you want per-element dynamic values, you reach for inline `style="--x: {value}"` and a fractal that consumes `var(--x)`, or you accept a static variant set. Known states (`sm`, `lg`, `primary`, `ghost`) are variants; truly dynamic values are CSS variables. The system does not pretend otherwise.

There is also a smaller one worth naming: the system is written in **indented SASS** (`.sass`, tabs). If your team refuses a preprocessor or the indentation syntax, the model does not transfer cleanly to plain CSS — the resolvers, loops, and `@content` breakpoints are the system.


## Why this system is interesting for coding agents

The fractal model becomes more interesting when coding agents write most of the UI code.

Tailwind is a great language for humans. Its short classes are fast to type and excellent for experimenting in markup. But an agent can produce valid utility soup in thousands of equivalent ways — `gap-4`, `gap-[18px]`, `style="gap:1rem"`, a copied `md:gap-6`. All render similarly while making the codebase less consistent.

The important question changes. Not "which syntax can I type fastest?" but "which system makes inconsistent code harder to create?"

fractalstyler2 gives an agent a small space of acceptable choices:

- compose known fractals (`+surface`, `+stack`, `+cluster`) instead of writing raw declarations
- resolve values through `space()` / `radius()` — token step by default, raw value visibly intentional
- express state with `data-*` / `aria-*`, never modifier classes
- import only the zero-CSS barrel in components
- use `.select` on `<select>`, `.row.wrap` inside cards, `=partition` footers — the invariants are mixins, so the safe path is also the easy path
- never introduce a variable outside the token contract

Because the constraints are *executable* — mixins, resolvers, and cascade order rather than prose — an agent that follows the vocabulary cannot drift far. The package leans into this deliberately: it ships an `AGENTS.md` routing file with golden rules, a skills directory, and an MCP server, so agents can query the mixin catalog instead of guessing at class names.

It also improves review. Diffs read as intent — `+surface(surface, m, 6, md)` says what the element *is*, not sixteen declarations saying what it *does*. Review shifts from normalizing arbitrary values to asking whether the interface is correct.


## The cost of those constraints

The system is not a free improvement.

The Sass toolchain is mandatory. This is fine in SvelteKit (one dev dependency), but it rules out contexts where CSS must stay vanilla.

The vocabulary has a learning curve. `+stack` vs `+box`, `+cluster` vs `+row`, `=control` vs `=button` — the names are few but precise, and until they are internalized, agents and humans will occasionally reach for a raw property where a fractal exists. The golden rules and the reference docs are the antidote, but they are a prerequisite, not a bonus.

The ecosystem gravity is real. Most copy-and-paste component collections ship Tailwind classes. Choosing fractals means converting those styles — which is honest work, since the source is yours, but it is work. There is no community component sea to pull from.

And the raw-value escape hatch cuts both ways. `+gap(18)` is legal. If nobody reviews for it, the token scale quietly erodes into magic numbers wearing a mixin costume. The system gives you the leash; discipline keeps it attached.


## Compared with other approaches

Here is the short version:

| Approach | What you write | What ships | Main strength | Main cost |
| --- | --- | --- | --- | --- |
| Plain CSS | Rules and selectors | Static CSS | Native, flexible, no tooling | You manage scope, naming, and consistency |
| Tailwind | Utility classes in markup | Generated CSS | Fast authoring, huge ecosystem | Markup grows; arbitrary choices creep back |
| Svelte scoped styles | Per-component CSS | Component-local CSS | Automatic scoping | No shared vocabulary; repetition across components |
| StyleX | Typed JS style objects | Compiled atomic CSS + tiny runtime | Predictable composition at scale | Compiler setup, JS-centric |
| fractalstyler2 | Indented SASS mixins | Plain semantic CSS, zero runtime | One vocabulary, dual consumption, executable invariants | Sass toolchain, vocabulary learning, small ecosystem |

The closest comparison is not Tailwind — it is StyleX. Both extract styling to a compile step; both make the token path the default and the raw value the exception; both treat constraints as the feature. The difference is the substrate: StyleX keeps you in JavaScript with hashed atomic classes; fractals keep you in markup with semantic classes, on top of CUBE CSS ideas, with the cascade doing the composition work.


## When I would use it

I would use it for a SvelteKit application with a growing component library — especially one where agents and humans build UI together. In that situation, one vocabulary, resolvable tokens, and executable invariants are worth more than terse syntax.

I would start with these rules:

- compose fractals in components; project ubiquitous atoms to utilities
- token steps by default, raw values rare and deliberate
- state on attributes, never modifier classes
- the barrel in components, `index.sass` once in the layout
- all colors from the token contract — or hand the palette to fractalthemer

I would not reach for it on a content-heavy site with no component layer, or in a stack where Sass is unwelcome. And I would not migrate a working small project just to use it.

My first experiment would be one real feature: build it, inspect the compiled CSS, and have an agent extend it. Then review. Did the styles stay in vocabulary? Did variants compose cleanly? Did the resolvers keep magic numbers out? Were the diffs readable?

Those answers matter more than the first impression of the syntax.


## The final check

Run the build and open the compiled CSS.

You should see semantic classes with plain declarations — `.card { display: flex; flex-direction: column; … }`, fluid `clamp()` tokens on `:root`, utilities ordered after blocks. You should not see the mixins, the maps, or any runtime.

That final check closes the loop:

```
token scales as Sass data
↓
fractal calls in components and layouts
↓
compile-time expansion through resolvers
↓
plain, ordered, semantic CSS in the browser
```

This is why I would evaluate the fractal system as a methodology with a compiler, not as another way to spell CSS: the mixin is the unit of design, the cascade is the unit of composition, and everything the browser receives is CSS you could have written by hand — if you could get a whole team, and every agent, to write it this consistently.
