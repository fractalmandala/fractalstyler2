# CSS Class Registry — v1

Status: **v1 LOCKED** — all dialogue items resolved 2026-08-29 (rulings log at bottom). This registry is the source of truth.
Companion artifact: `registry-v0.md` (the dialogue record).

---

## The Contract (physics all entries obey)

1. **Suffix grammar**: `family-{preset}` → token-routed (fluid, remappable by presets); `family-{N}` → literal px, `$utility-range: (1, 256)`. `family--{N}` / `family--{preset}` → the negative form (margin families only).
2. **Self-sufficiency**: every class works alone; co-occurrence adds, never requires.
3. **One vocabulary, one definition** — no mixin/class twins. Mixins are internal generators only, deprecated as public API.
4. **Physical axes**: `x-` = horizontal, `y-` = vertical — always viewport-physical, never main/cross. Legibility over cleverness.
5. **Cascade** = emission order L0 → L5. Within L5, bare dress emits before compositions; media-scoped variants (`-mob`/`-desk`) emit after their base classes.
6. **No foreign custom properties.** Visual toggles = `.open` / `.active`. Semantic state = native attributes (`[disabled]`, `[aria-expanded]`, `:focus-visible`) — CSS may style from them. html-level `data-mode` / `data-theme` / `data-bg-style` / preset attributes = themer runtime only.
7. **Responsive scoping**: any registry class takes `-mob` (max-width: $breakpoint) or `-desk` (min-width: $breakpoint) suffix, generated for the whole registry. Prefix (`mob:`) and companion-class (`.mob`) forms are rejected: colons need CSS escaping and break grep; companion classes are unimplementable in pure CSS (media queries cannot read siblings).

---

## L0 — Tokens (changes this wave)

- **Unified step taxonomy** (one scale everywhere steps are needed):
  `3xs 2xs xs sm md lg xl 2xl 3xl` — text extends it with `4xl`.
- **Renames**: `--space-s` → `--space-sm`, `--space-m` → `--space-md`, `--space-l` → `--space-lg`. Text and shadow steps already conform (`xs sm md lg xl 2xl 3xl [4xl]`).
- **Deleted**: `--space-s-l` — like it never existed. `$space-steps` config updated to the taxonomy. Usages migrate to `lg`/`xl` during the build wave (audit: templates only — 2 hits).
- **Shadows move per-mode**: `--shadow-sm/md/lg` enter `=light-theme-tokens` and `=dark-theme-tokens`. Light keeps current values; dark gets its own table (draft: `0 1px 2px rgba(0,0,0,.4)` / `0 4px 12px rgba(0,0,0,.45)` / `0 12px 32px rgba(0,0,0,.55)` — tune at build).
- **New radius channels** (for shape presets; compositions read these, utilities stay literal):
  `--radius-sm`, `--radius-md`, `--radius-lg`. Defaults = curved: `6 / 8 / 12`.
- **New motion tokens**: `--motion-fast`, `--motion-base`, `--motion-slow`, `--ease-out`, `--ease-spring`. Defaults = active: `120ms / 160ms / 240ms`, standard out. Components stop hardcoding `0.15s`.
- **New layout tokens**: `--page-gutter` (fluid page padding), `--sidebar-width`, `--breakpoint: 768px`. `--header-height` already exists and stays.
- Status text colors map from existing tokens: `--success`, `--warning`, `--danger`, `--info` (no new `--text-*` tokens needed).

## L1 — Dimensions

**Space families (17)** — identical suffix table on each:

| Family | Property | | Family | Property |
|---|---|---|---|---|
| `.gap-` | `gap` | | `.marg-` | `margin` |
| `.rgap-` | `row-gap` | | `.marg-x-` | `margin-inline` |
| `.cgap-` | `column-gap` | | `.marg-y-` | `margin-block` |
| `.pad-` | `padding` | | `.marg-top-` | `margin-top` |
| `.pad-x-` | `padding-inline` (renames `+px`) | | `.marg-right-` | `margin-right` |
| `.pad-y-` | `padding-block` (renames `+py`) | | `.marg-bottom-` | `margin-bottom` |
| `.pad-top-` | `padding-top` | | `.marg-left-` | `margin-left` |
| `.pad-right-` | `padding-right` | | | |
| `.pad-bottom-` | `padding-bottom` | | | |
| `.pad-left-` | `padding-left` | | | |

- Presets: `3xs 2xs xs sm md lg xl 2xl 3xl` → `var(--space-*)`.
- Extensible: `1…256` → literal px. Docs recommend 4/8/16/32 steps.
- **Negatives** (margin families only): `--` infix. `.marg-x--8` → `-8px`; `.marg-top--sm` → `calc(var(--space-sm) * -1)`.
- Every class above accepts `-mob` / `-desk`.

**Radius**: `.radius-{0…256}` literal px (0 = the reset). `.radius-full` → `var(--radius-full)`. Radius never rides shape presets (literal by ruling).

**Size**: `.w-{1…256}`, `.h-{1…256}`, `.square-{1…256}` literal. `.wfull` `.hfull` `.full` `.min0`.

**Viewport heights (new)**:
- `.hfull-vh`: `min-height: 100vh`
- `.hfull-vh-fitted`: `min-height: calc(100vh - var(--header-height))`
- Scoped variants via the general mechanic: `.hfull-vh-fitted-desk`, etc.

**Shadows**: `.shadow-sm` `.shadow-md` `.shadow-lg` → `var(--shadow-*)` (token channels; per-mode values).

## L2 — Containers, flow & alignment

**Bases**:
- `.box`: `display:flex; flex-direction:column`
- `.row`: `display:flex; flex-direction:row`
- `.grid`: `display:grid`
- `.wrap`: `flex-wrap:wrap`
- `.grow`: `flex: 1 1 0%` (fill remaining)
- `.shrink-0`: `flex-shrink: 0`
- `.relative` `.absolute` `.fixed` `.sticky`: position only — offsets stay yours

**Alignment universe** (nested under their base — never standalone):

```
.box                                    .row
  &.xcenter   align-items: center        &.xcenter?   — (not registered; row default)
  &.xleft     align-items: flex-start    &.xleft      justify-content: flex-start
              text-align: left           &.xright     justify-content: flex-end
  &.xright    align-items: flex-end      &.xbetween   justify-content: space-between
              text-align: right          &.xevenly    justify-content: space-evenly
  &.ycenter   justify-content: center    &.xaround    justify-content: space-around   (completed)
  &.ytop      justify-content: flex-start
  &.ybot      justify-content: flex-end  &.ycenter    align-items: center
  &.ybetween  justify-content: space-between   (completed)   &.ytop   align-items: flex-start
  &.yevenly   justify-content: space-evenly    (completed)   &.ybot   align-items: flex-end
  &.yaround   justify-content: space-around    (completed)
```

`.grid` alignment (full matrix, per author spec):
- `&.center` → `place-items: center`
- `&.xcenter` → `justify-items: center`; `&.xleft` → `justify-items: start` + `text-align: left`; `&.xright` → `justify-items: end` + `text-align: right`; `&.xstretch` → `justify-items: stretch`
- `&.ycenter` → `align-items: center`; `&.ytop` → `align-items: start`; `&.ybot` → `align-items: end`; `&.ystretch` → `align-items: stretch`
- `&.xbetween` → `justify-content: space-between`; `&.xevenly` → `space-evenly`; `&.xaround` → `space-around`
- `&.ybetween` → `align-content: space-between`; `&.yevenly` → `space-evenly`; `&.yaround` → `space-around`

Naming note: `ybot`, not `ybottom` — three-letter consistency with `xleft`/`xright`.

**Pared**: `.stack` → `.box` + `.gap-*`; `.cluster` → `.row.wrap` + `.gap-*`; `.center-column`, `.cover` — dropped. Aliases ship during migration, die at v2. `.frame` mixin → preset classes below. `.reel` kept.

## L3 — Layouts & templates

**Grids** (each self-sufficient, includes `display:grid`):

| Class | Stepping | Governing rule |
|---|---|---|
| `.grid-1` | 1 | — |
| `.grid-2` | 2 → 1 | — |
| `.grid-3` | 3 → 1 | **Gridding Golden Rule 1**: exactly 3 items never renders 2+1 |
| `.grid-4` | 4 → 2 → 1 | **Gridding Golden Rule 2**: count = 4 or multiples of 4, never 3+1 |
| `.grid-6` | 6 → 3 → 2 → 1 | both rules hold at every step |

Docs teach: pick the grid class whose step pattern matches the item count.

- `.card-grid`: auto-fit repeatable cards, min-width from config.
- `.prose`: reading measure ≤ 760px + typographic rhythm.
- **Frame presets** (replaces `=frame`): `.frame-16-9` `.frame-9-16` `.frame-4-3` `.frame-3-4` `.frame-3-2` `.frame-2-3` `.frame-1-1` — `aspect-ratio` + `overflow:hidden; position:relative`, children `width/height: 100%`, `img/video/iframe` get `object-fit: cover`.
- `.reel`: horizontal scroll-snap rail (the filmstrip; human-driven). Stays open for carousel duty.

## L4 — Shells, overlays & canonical markup

> Ruling: at the highest fractal level, markups are canon. An L4 class without a canonical markup is an incomplete definition.

**The holy-grail app-shell — the master template:**

```html
<div class="app-shell">
	<header class="app-header"></header>
	<main class="app-main">
		<aside class="sidebar-left"></aside>
		<section class="main-section">
			<article class="content-shell"></article>
		</section>
		<aside class="sidebar-right"></aside>
	</main>
	<footer class="app-footer"></footer>
</div>
```

- `.app-shell`: min-height fill; column; `--header-height` published here.
- `.app-header`: fixed-height bar; publishes `--header-height`.
- `.app-main`: the row below the header; `min-height: calc(100vh - var(--header-height))`.
- `.sidebar-left` / `.sidebar-right`: sticky columns (`top: var(--header-height)`, `height: calc(100vh - var(--header-height))`), width from `--sidebar-width`, bg-capable (dress your own).
- `.main-section`: `min-width: 0`; owns horizontal padding via `.page-main` semantics below.
- `.content-shell`: max-width content column inside main-section.
- `.app-footer`: full-width footer bar.

**Roles within the canon** (registered today, definitions transcribed from `_10_layouts.sass` at build — they work in fractalcodex now):
- `.docs` — config modifier on `.app-shell`: left sidebar retracts below breakpoint (header menu button toggles `.open`), right TOC contracts to `.docs-mobile-toc` dropdown.
- `.navtree` `+ .navtree-group .navtree-title .navtree-link .navtree-sub` — the left tree; lives in `.sidebar-left`.
- `.toc` `+ .toc-list .toc-title .toc-link .toc-footer` — the right TOC; lives in `.sidebar-right`.
- `.docs-mobile-toc` — mobile dropdown TOC.
- `.tab-list` / `.tab-trigger` — current tab = `.active`.

**Page frames** (the page-shell physics, resolved):

Padding ownership moves with full-bleed chrome: a shell with a sidebar cannot carry inline padding (sidebar bg would gap at the viewport edge), so the two concerns are two classes.

```html
<!-- plain page: padded content frame -->
<section class="page-shell"> … </section>

<!-- sidebar page: full-bleed split, padding lives in .page-main -->
<section class="page-split">
	<aside class="page-sidebar"></aside>
	<main class="page-main"></main>
</section>
```

- `.page-shell`: `padding-inline: var(--page-gutter)`; responsive `padding-top/bottom` — content never butts header/footer.
- `.page-split`: full-bleed grid `[--sidebar-width | 1fr]`; no padding.
- `.page-sidebar`: sticky, `top: var(--header-height)`, `height: calc(100vh - var(--header-height))`, `min-width: 0`, bg-capable.
- `.page-main`: carries `padding-inline: var(--page-gutter)` + responsive pad-y; `min-width: 0`.

**Overlays** (shown via `.open`; triggers carry `aria-expanded` where interactive):
- `.drawer`: slide-in panel.
- `.dialog`: overlay mechanics + `var(--bg-dialog)` + radius/shadow.
- `.popover`: anchored overlay mechanics + `var(--bg-popover)`.
- `.accordion` `+ .accordion-item .accordion-trigger .accordion-content`: `.open` on item.

**Hero (resolved)**: hero-with-props is component-library territory. Here, `.hero` is documented sugar: `.box.ycenter` + `gap-lg` + `pad-y-xl`. Canonical markup:

```html
<section class="hero">
	<h1 class="text-3xl"></h1>
	<p class="text-lg text-muted"></p>
</section>
```

## L5 — Dress & compositions

**Backgrounds (bare, one declaration)**: `.bg` → `var(--bg)`; `.surface`; `.raised`; `.panel`; `.footer`; `.canvas`; `.terminal` — each → its `--bg-*` token. (`.input` / `.dialog` / `.popover` are compositions, not bare bg classes.)

**Ink**: `.text-primary` `.text-secondary` `.text-muted` `.text-inverse` → tokens. `.text-theme` → `var(--theme-color)` (renamed from `.text-brand`). Status: `.text-success` → `var(--success)`, `.text-warning` → `var(--warning)`, `.text-danger` → `var(--danger)`, `.text-info` → `var(--info)` (locked for v1).

**Lines**: `.border` (1px `var(--border)`), `.border-subtle`, `.border-top`, `.border-right`, `.border-bottom`, `.border-left` (the partition-law set).

**Typography**: `.text-xs/sm/md/lg/xl/2xl/3xl/4xl` → `var(--text-*)`; `.weight-400/500/600/700`; `.mono` → `var(--font-mono)`; `.tt-u` (uppercase — new); `.truncate`; `.clamp-1/2/3` (card descriptions, search snippets, navtree/toc titles, article decks).
- `.eyebrow` (defined, no more per-context redefinitions; current definition retained by ruling): `font-size: var(--text-sm)`; `text-transform: uppercase`; `letter-spacing: 0.06em`; `font-weight: 500`; `color: var(--text-muted)`.

**Hover & motion ruling**: no standalone `.hover` — components own their `&.hover` states. No standalone `.transition` — motion is governed by the motion language presets (below).

**The button quartet** (nested — never standalone):

```
.button        reset, type baseline, inline-flex, height, pad-x, radius,
               text-decoration: none, &:focus-visible ring
	&.primary   background: var(--theme-color); ink inverse
	&.ghost     transparent bg; border: 1px var(--border); ink primary
	&.is-icon   square; centered; text-decoration: none
```

`<a class="button is-icon">` = an icon anchor. Native semantics stay native.

**The link family (new)**:

```html
<a class="link" href="…">brand-colored text, underline on hover</a>
<a class="link-plain" href="…">inherit ink, no decoration — the card-as-anchor</a>
<a class="link-parent" href="…">
	<span class="text-primary">hovering the parent shifts me to theme-color-alt</span>
</a>
```

- `.link`: `color: var(--theme-color)`; `&:hover` underline.
- `.link-plain`: `color: inherit; text-decoration: none`.
- `.link-parent`: `&:hover` → descendant `.link`/`.link-plain` shift to `var(--theme-color-alt)`.

**Compositions** (plain classes over the vocabulary, yours to restyle): `.input` `.select` `.field` `.field-label` `.field-error` `.card` `.badge` `.avatar` `.divider` `.kbd` `.switch-track` `.switch-thumb`. All read `--radius-*` channels so shape presets reach them.

**Responsive visibility**: `.hide-mobile` `.hide-desktop` `.only-mobile`.

**Marquee (ruled)**: `.reel` ≠ marquee — reel is a human-driven scroll-snap rail; marquee is an auto-scrolling animation loop. Current `_08` marquee is `[data-slot]`-structured = component territory. Ruling confirmed: fs2 keeps `.reel` only; marquee graduates to the component library.

---

## Presets — the wireframe

Four orthogonal languages. Mechanism is identical for all: **token remaps on html-level attributes** — the class system needs zero changes; preset classes ride the remap, `-N` literals opt out by design. fractalthemer owns application, persistence, anti-flicker. Attribute/value names are downstream; the "what" is below.

### 1. Layout language — `data-layout`: tight / comfortable / sprawling

Remaps the full `--space-*` clamp table (values shown min→max viewport). Comfortable = current tables, verbatim.

| Step | tight | comfortable (current) | sprawling |
|---|---|---|---|
| 3xs | 3/3 | 5/5 | 8/8 |
| 2xs | 6/7 | 9/10 | 14/16 |
| xs | 9/10 | 14/15 | 21/24 |
| sm | 12/13 | 18/20 | 27/32 |
| md | 18/20 | 27/30 | 40/48 |
| lg | 24/27 | 36/40 | 54/64 |
| xl | 36/40 | 54/60 | 80/96 |
| 2xl | 48/53 | 72/80 | 108/128 |
| 3xl | 72/80 | 108/120 | 160/192 |

Control heights ride the preset (locked for v1): ±4px shift on `--control-h-*` — tight −4, sprawling +4, comfortable as-defined.

### 2. Shape language — `data-shape`: round / curved / pro / sharp

Remaps the radius channels only (utilities stay literal; `.radius-full` always stays full).

| Channel | round | curved (default) | pro | sharp |
|---|---|---|---|---|
| `--radius-sm` | 12 | 6 | 2 | 0 |
| `--radius-md` | 16 | 8 | 3 | 0 |
| `--radius-lg` | 24 | 12 | 6 | 2 |

Sharp included — costs one column, completes the axis. Locked at four presets.

### 3. Color language — `data-color`: clean / general / vibrant

- **clean** (seamless): `--bg-surface/raised/panel/footer/input/canvas` → `var(--bg)`. Popover/dialog/terminal keep their own bg (floating chrome must separate). Borders and hover carry separation.
- **general** (default): the template as-defined; header/sidebar may dress in `panel`.
- **vibrant**: surface family tinted toward brand — e.g. `color-mix(in oklab, var(--bg), var(--theme-color) 4–8%)` — and theme-color/-alt backgrounds licensed for hero/header moments.

### 4. Motion language — `data-motion`: active / springy / heavy / reduced

| Token | active (default) | springy | heavy | reduced |
|---|---|---|---|---|
| `--motion-fast` | 120ms | 120ms | 240ms | 0ms |
| `--motion-base` | 160ms | 160ms | 400ms | 0ms |
| `--motion-slow` | 240ms | 240ms | 640ms | 0ms |
| `--ease-out` | standard out | standard out | gentle out | linear |
| `--ease-spring` | — | `cubic-bezier(.34,1.56,.64,1)` | — | — |

`prefers-reduced-motion: reduce` is honored globally regardless of preset.

---

## Authors' dialogue — v1 answers

**Q: Are "stack"/"cluster" industry standards for .box/.row?**
A: Yes — EveryLayout's names for exactly these primitives, and Chakra/Bootstrap carry Stack/HStack/hstack. Industry-recognized, but in our vocabulary they're 1:1 redundant with `.box`/`.row` + `.gap-*`; their only content was a default gap, which is an opinion the system shouldn't hold. Clinical verdict: pare (die at v2, aliases until).

**Q: What is "vertical rhythm"?**
A: Consistent vertical cadence down a page — sections and blocks separated by even steps. The proposal was a `.section` class giving pad-y from the scale. Verdict: unnecessary — the physics already provide it (`pad-y-*`, `gap-*`, page frames). Dropped from the registry.

**Q: What is a "hero template"?**
A: Your third option is the right one — hero-with-props is a preconfigured component, i.e. component-library territory. fs2 keeps `.hero` as five lines of documented sugar (`.box.ycenter` + `gap-lg` + `pad-y-xl`) with canonical markup. If it ever needs props, it graduates to fractalcodex.

**Q: clamp-1/2/3 use cases?**
A: Card descriptions (2), search-result snippets (2–3), navtree/toc long titles (1), article decks (3), badge labels (1). Kept.

**Q: Is .marquee just .reel by another name?**
A: No — reel is scroll-snap (human-driven), marquee is a keyframe auto-loop (ambient). Also: current marquee is `[data-slot]`-structured, which is component territory under the new physics. Ruling registered: fs2 keeps `.reel`; marquee graduates to the component library. Confirm.

**Q: The status/attention question, re-explained.**
A: It was two sub-questions: (1) ship four one-line status text classes (`.text-success` → `var(--success)`, etc.) in v1 or defer? (2) ship generic `.hover`/`.transition`? You've answered (2) — no standalone definitions; components own `&.hover`, motion presets own timing. For (1): tokens exist, the classes are four one-liners, registered as shipping unless you veto.

**Q: .eyebrow — text-3xs? 2xs?**
A: Text steps start at `xs` (taxonomy keeps text at xs…4xl; there is no `--text-3xs`). Defined as: `text-xs + uppercase + 0.08em + weight-600 + text-muted`. Current `_09` uses `text-sm/500/0.06em` — pick one and it's frozen. Also registered `.tt-u` since you reached for it.

**Q: page-shell physics.**
A: Two classes, per your instinct. `.page-shell` = padded content frame (no sidebar). `.page-split` + `.page-sidebar` + `.page-main` = full-bleed sidebar layout where padding lives in `.page-main`, because a full-bleed sidebar cannot tolerate shell padding (bg gap at the edge) and sticky sidebars need `calc(100vh - var(--header-height))` math that belongs in one place. Canonical markups registered.

**Q: Responsive locking (mob:/desk:/companion classes).**
A: Suffix wins: `-mob` / `-desk` on any registry class, generated wholesale. `mob:` prefixes rejected (CSS needs `.mob\:gap-sm` escaping; grep-hostile). Companion `.mob`/`.desk` classes rejected on physics: media queries cannot read sibling classes, and ancestor-scoping would need JS on `<html>` — breaking the vanilla-CSS contract. Cost: ~2× registry volume of one-liners; gzip-cheap; loop-generated.

**Q: Negative margins.**
A: Added, minimally: `--` infix on margin suffixes. `.marg-x--8` → `-8px`; `.marg-top--sm` → `calc(var(--space-sm) * -1)`. Margin families only.

**Q: Alignment universe.**
A: Registered verbatim, with symmetry completions marked: `.box` gains `ybetween/yevenly/yaround` (its main axis is vertical); `.row` gains `xaround`. Naming: `ybot` (your code), not `ybottom` (your prose). Semantics note added to the Contract: x/y are physical, never main/cross.

**Q: Steps taxonomy.**
A: Adopted wholesale. Renames: `--space-s/m/l` → `sm/md/lg`; `--space-s-l` deleted (blast radius audited: one config line + one token line; usages migrate to lg/xl at build). Shadows moved per-mode with draft dark values. Consequence named: breaking rename — fractalcodex's scaffold copy migrates in the same wave.

**Q: Shape presets × literal radius — the one real collision.**
A: Surfaces it: `.radius-N` is literal by your ruling, so shape presets cannot ride utilities. Registered fix: compositions read new `--radius-sm/md/lg` channels; shape presets remap those. Utilities untouched. Sharp included pending your confirm.

## Rulings log (2026-08-29 — all open items closed)

1. `.eyebrow`: keep current definition (sm / 500 / 0.06em).
2. Status text classes: ship as registered.
3. Marquee: removed from fs2 — graduates to the component library. `.reel` stays.
4. Shape presets: four, `sharp` included.
5. Control heights: ride layout presets in v1 (±4px).
6. `--page-gutter` / `--sidebar-width` / `--breakpoint`: defaults proposed at build (approved).

The registry is frozen. Next: **geography** — files, names, what "atoms/molecules" become. The registry's layer boundaries propose themselves as file boundaries; that decision is now unblocked.
