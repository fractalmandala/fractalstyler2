---
title: Agent command registry
description: Named, self-contained agent prompts that direct an agent to build pages, components, layouts, fractals, themes, and audits with fractalstyler2.
---

Each entry is a **command**: a reusable prompt that directs an agent to do one
kind of work with fractalstyler2. `AGENTS.md` routes a user request to a command;
this file is the command body. Hosts may wire these as slash commands (e.g.
`/fs2:page`) or paste them as a system/task prompt.

**Every command inherits the [Golden rules](#golden-rules).** Read them once;
they are not repeated in each entry.

## Command index

| Command | Use when the user wants to… | Primary docs |
| --- | --- | --- |
| [`fs2:page`](#fs2page) | build a whole page/route | 03, 07, 08 |
| [`fs2:component`](#fs2component) | build a reusable block | 04, 07 |
| [`fs2:layout`](#fs2layout) | build a page-layout template | 04, 07 |
| [`fs2:fractal`](#fs2fractal) | add a new atom/molecule mixin | 02, 04, DEVELOPERS |
| [`fs2:theme`](#fs2theme) | add a named theme or tune tokens | 05 |
| [`fs2:refactor`](#fs2refactor) | convert existing CSS/utility-soup to fractals | 01, 04, 06 |
| [`fs2:review`](#fs2review) | audit markup/SASS for fractal idiom | 01, 02 |

---

## Golden rules

Applied to every command:

1. **Never hardcode a value that a token covers.** Route through fractals and
   resolvers: `+gap(m)`, `+radius(12)`, `+bg(surface)`. A raw number
   (`+gap(18)`) is allowed only as a deliberate escape hatch — flag it.
2. **Compose fractals; don't write raw CSS** when a fractal exists. Raw
   declarations are for genuinely unique lines only.
3. **State on `data-*` / `aria-*`, never modifier classes.** No `.btn--primary`,
   no `.is-active`.
4. **Markup stays thin and semantic.** Prefer one component class over a long
   utility string once the string recurs or carries meaning.
5. **Mobile-first.** Base styles first; grow with `+at(md/lg/xl)` and `+cols`.
6. **Don't touch `dist/`.** It is generated. Edit `src/lib/**` only.
7. **Verify.** Run `npx sass src/lib/styles/index.sass:/tmp/check.css` (or
   `npm run dev` / `pnpm dev`) and confirm zero errors before declaring done.
8. **Stay inside the vocabulary.** If a needed primitive is missing, propose a
   new fractal (`fs2:fractal`) rather than inlining CSS across call sites.

---

## fs2:page

> **Goal:** build a complete page/route from existing fractals, blocks, and
> layouts.
>
> **Inputs:** the page's purpose, the sections it needs, the target route file.
>
> **Procedure:**
> 1. Pick a layout shell: `.app-shell` (app chrome), `.holy-grail` (nav+main+aside),
>    `.docs` (docs), or a bare `.box` for a marketing page. See docs/07.
> 2. Lay out sections with layout fractals — `.grid-3`/`+cols` for card grids,
>    `.card-grid` for auto-fit, `.hero` for a lead. See docs/08 for copy-paste.
> 3. Fill with shipped blocks (`.card`, `.panel`, `.button`, `.badge`, …).
> 4. Only when a needed piece isn't shipped, author it inline via `fs2:component`.
> 5. Keep markup semantic; use utility classes for one-off spacing only.
>
> **Output:** a `+page.svelte` (or component) using classes from the system,
> plus any scoped `<style lang="sass">` for bespoke pieces. No global CSS edits.
>
> **Guardrails:** don't invent class names that aren't in docs/06–07 unless you
> also define them; don't reach for inline `style=""` except for genuine
> one-offs (a single `padding` via a token var is fine).

---

## fs2:component

> **Goal:** author a reusable block component as a fractal recipe.
>
> **Inputs:** component name, its states/variants, where it lives (scoped in a
> `.svelte` file, or shared in `src/lib/components/_blocks.sass`).
>
> **Procedure:**
> 1. Start from `+surface(...)` if it's a material (card-like) or `+stack/+cluster`
>    if it's an arrangement.
> 2. Add skin/spacing/type via atoms — never raw `display:flex`, `padding:16px`.
> 3. Express every variant/state with `&[data-*]`.
> 4. Import the API: `@use 'fractalstyler2/fractals' as *`.
>
> **Output:** a SASS recipe (scoped or in `_blocks.sass`). If shared, note that a
> repack is needed before other projects see it (DEVELOPERS.md).
>
> **Example skeleton:**
> ```sass
> .thing
> 	+surface(surface, s, 12)
> 	+stack(2xs)
> 	&[data-variant='loud']
> 		+shadow(lg)
> ```

---

## fs2:layout

> **Goal:** build a page-layout template (structural, no visual skin).
>
> **Inputs:** the regions and how they reflow across breakpoints.
>
> **Procedure:**
> 1. Base = mobile single-column, from `+box`/`+grid`. Name regions as plain
>    descendant classes (`.x-header`, `.x-body`).
> 2. Reshape at breakpoints with `+at(md/lg/xl)`; use `grid-template-columns` or
>    `+cols` for column changes.
> 3. Keep it skin-free — composition only. No colors/shadows in a layout.
>
> **Output:** a recipe in `src/lib/components/_layouts.sass` (or scoped).
>
> **Guardrails:** layouts must not set `background`/`box-shadow`/`color`; that's a
> block's job. Sticky rails use `+sticky`.

---

## fs2:fractal

> **Goal:** add a new atom or molecule mixin the idiomatic way.
>
> **Inputs:** the decision it encodes, its arguments, whether it's an atom (one
> decision) or molecule (composes atoms).
>
> **Procedure:**
> 1. Atom → `src/lib/fractals/_atoms.sass`; molecule → `_molecules.sass`.
> 2. Route values through resolvers (`space()`, `radius()`, …). If it introduces a
>    new scale keyword, add it to `_config.sass` and `_tokens.sass` together.
> 3. If it should be usable from markup, project it in `_utilities.sass`.
> 4. Document it in docs/04; if agent-relevant, mention it here.
>
> **Output:** the mixin, optional utility projection, doc entry. A repack is
> required before external consumers get it.
>
> **Guardrails:** an atom is ONE decision — if you're writing three unrelated
> properties, it's a molecule. Give sensible argument defaults.

---

## fs2:theme

> **Goal:** add a named theme or adjust the token scales.
>
> **Inputs:** the palette (or scale) changes.
>
> **Procedure:**
> 1. Named theme → add a `[data-theme='name']` block redefining only the tokens
>    that differ (see docs/05). Do not duplicate the whole palette.
> 2. Scale tune → edit values in `_tokens.sass`. Adding a new *keyword* also
>    requires adding it to the matching list in `_config.sass`.
> 3. Never change `:root` light defaults away from marker-free (SSR contract).
>
> **Output:** token/theme edits in `_tokens.sass` (+ `_config.sass` if a keyword
> was added). No component changes needed — fractals reference the vars.

---

## fs2:refactor

> **Goal:** convert hand-written CSS or utility-soup markup into fractal recipes.
>
> **Inputs:** the target file(s).
>
> **Procedure:**
> 1. Map each raw declaration to a fractal (docs/04). `display:flex;flex-direction:column`
>    → `+box`; `padding:1.25rem` → `+pad(s)`; `border-radius:12px` → `+radius(12)`.
> 2. Collapse recurring markup class strings (`class="card stack gap16 pad24 …"`)
>    into a single semantic component class whose recipe is those fractals.
> 3. Move `--modifier`/`.is-*` states onto `data-*`.
> 4. Replace magic numbers with the nearest token; flag any that don't map.
>
> **Output:** slimmer markup + fractal recipes; a short list of values that had
> no token (candidates for `fs2:theme`).
>
> **Guardrails:** preserve rendered output — verify before/after in the browser.

---

## fs2:review

> **Goal:** audit code for fractal-idiom compliance (no build changes).
>
> **Checklist:**
> - [ ] No hardcoded px/rem where a token exists.
> - [ ] No raw `display/padding/margin/gap` where a fractal exists.
> - [ ] No modifier classes for state (`--`, `.is-`); uses `data-*`.
> - [ ] Layouts carry no skin; blocks carry no page structure.
> - [ ] Markup class strings aren't a de-facto un-named component.
> - [ ] New scale keywords exist in BOTH `_tokens.sass` and `_config.sass`.
> - [ ] `dist/` untouched; only `src/lib/**` edited.
>
> **Output:** findings grouped by severity with file:line and the idiomatic fix.
