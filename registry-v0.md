# CSS Class Registry

## L1 — Dimensions (17 space families + radius + shadows)

- `.gap-`: gap; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.rgap-`: row-gap; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.cgap-`: column-gap; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.pad-`: padding; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.pad-x-`: padding-inline (renames +px); presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.pad-y-`: padding-block (renames +py); presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.pad-top-`: padding-top; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.pad-right-`: padding-right; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.pad-bottom-`: padding-bottom; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.pad-left-`: padding-left; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.marg-`: margin; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.marg-x-`: margin-inline; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.marg-y-`: margin-block; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.marg-top-`: margin-top; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.marg-right-`: margin-right; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.marg-bottom-`: margin-bottom; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.marg-left-`: margin-left; presets (3xs, 2xs, xs, s, m, l, xl, 2xl, 3xl, s-l) -> var(--space-*), extensible (-1...-256) -> literal px
- `.radius-{0...256}`: border-radius: literal px (0 included — the reset)
- `.radius-full`: border-radius: var(--radius-full)
- `.w-{1...256}`: width: literal px
- `.h-{1...256}`: height: literal px
- `.square-{1...256}`: width: literal px; height: literal px (width=height literal)
- `.wfull`: width: 100%
- `.hfull`: height: 100%
- `.full`: width: 100%; height: 100%
- `.min0`: min-width: 0; min-height: 0
- `.shadow-sm`: box-shadow: var(--shadow-sm) (token-routed channel, not literal)
- `.shadow-md`: box-shadow: var(--shadow-md) (token-routed channel, not literal)
- `.shadow-lg`: box-shadow: var(--shadow-lg) (token-routed channel, not literal)

## L2 — Containers & flow

- `.box`: display: flex; flex-direction: column
- `.row`: display: flex; flex-direction: row
- `.wrap`: flex-wrap: wrap
- `.xcenter`: main-axis justify-content: center; .box.xcenter -> align-items: center (horizontal in both directions)
- `.ycenter`: main-axis justify-content: center; .row.ycenter -> align-items: center (vertical in both directions)
- `.center`: both axes centered (justify-content: center; align-items: center)
- `.grow`: flex: 1 1 0% (fill remaining)
- `.shrink-0`: flex-shrink: 0 (card-containment workhorse; kept from current _09)
- `.relative`: position: relative (position only — offsets stay yours)
- `.absolute`: position: absolute (position only — offsets stay yours)
- `.fixed`: position: fixed (position only — offsets stay yours)
- `.sticky`: position: sticky (position only — offsets stay yours)

## L3 — Layouts & templates

- `.grid-1`: single column grid
- `.grid-2`: responsive grid: 2 -> 1 column
- `.grid-3`: responsive grid: 3 -> 1 column (or 3 -> 2 -> 1 — see open decisions)
- `.grid-4`: responsive grid: 4 -> 2 -> 1 columns (never 3)
- `.grid-6`: responsive grid: 6 -> 3 -> 2 -> 1 columns (never 5/4)
- `.card-grid`: auto-fit repeatable cards, min-width from config
- `.hero`: page/section hero template
- `.prose`: reading measure <= 760px + typographic rhythm
- `.toc`: right TOC; contracts to dropdown per docs config (composed with .toc-list, .toc-title, .toc-link, .toc-footer)
- `.toc-list`: right TOC item list container (composed within .toc)
- `.toc-title`: right TOC title header (composed within .toc)
- `.toc-link`: right TOC navigation item link (composed within .toc)
- `.toc-footer`: right TOC footer section (composed within .toc)
- `.navtree`: left sidebar tree; retracts to header menu button per docs config (composed with .navtree-group, .navtree-title, .navtree-link, .navtree-sub)
- `.navtree-group`: left sidebar nav tree category group (composed within .navtree)
- `.navtree-title`: left sidebar nav tree category title (composed within .navtree)
- `.navtree-link`: left sidebar nav tree item link (composed within .navtree)
- `.navtree-sub`: left sidebar nav tree nested sub-tree (composed within .navtree)
- `.docs`: the holy-grail docs config proper
- `.docs-mobile-toc`: mobile dropdown table of contents for docs layout
- `.active`: state indicator for active item (tab-list / tab-trigger mechanics live here-adjacent; current tab = .active)

## L4 — Shells & overlays

- `.app-shell`: application frame container (composed with .app-header, .app-main)
- `.app-header`: application frame header (composed within .app-shell)
- `.app-main`: application frame main content area (composed within .app-shell)
- `.holy-grail`: header/left/right/footer layout template (composed with .docs)
- `.drawer`: slide-in panel; shown via .open
- `.dialog`: modal dialog: overlay mechanics + var(--bg-dialog) + radius/shadow; shown via .open
- `.popover`: anchored overlay mechanics + var(--bg-popover); shown via .open
- `.open`: state class for open/visible state on drawer, dialog, popover, or accordion-item
- `.accordion`: accordion container; open/close via .open on item; trigger carries aria-expanded (composed with .accordion-item, .accordion-trigger, .accordion-content)
- `.accordion-item`: accordion item element; toggled open/closed via .open
- `.accordion-trigger`: accordion interactive header button/trigger; carries aria-expanded
- `.accordion-content`: accordion collapsible body content container

## L5 — Dress & compositions

- `.bg`: background: var(--bg) (bare, one declaration)
- `.surface`: background: var(--bg-surface) (bare, one declaration)
- `.raised`: background: var(--bg-raised) / raised surface background (bare, one declaration)
- `.panel`: background: var(--bg-panel) / panel background (bare, one declaration)
- `.footer`: background: var(--bg-footer) / footer background (bare, one declaration)
- `.canvas`: background: var(--bg-canvas) / canvas background (bare, one declaration)
- `.terminal`: background: var(--bg-terminal) / terminal background (bare, one declaration)
- `.text-primary`: color: var(--text-primary) (design token)
- `.text-secondary`: color: var(--text-secondary) (design token)
- `.text-muted`: color: var(--text-muted) (design token)
- `.text-inverse`: color: var(--text-inverse) (design token)
- `.text-brand`: color: var(--theme-color)
- `.text-success`: color: var(--text-success) / status token (optional set)
- `.text-warning`: color: var(--text-warning) / status token (optional set)
- `.text-danger`: color: var(--text-danger) / status token (optional set)
- `.text-info`: color: var(--text-info) / status token (optional set)
- `.border`: border: 1px var(--border)
- `.border-subtle`: border: 1px var(--border-subtle) (subtle border)
- `.border-top`: border-top: 1px var(--border) (the partition-law pair)
- `.border-bottom`: border-bottom: 1px var(--border) (the partition-law pair)
- `.text-xs`: font-size: var(--text-xs)
- `.text-sm`: font-size: var(--text-sm)
- `.text-md`: font-size: var(--text-md)
- `.text-lg`: font-size: var(--text-lg)
- `.text-xl`: font-size: var(--text-xl)
- `.text-2xl`: font-size: var(--text-2xl)
- `.text-3xl`: font-size: var(--text-3xl)
- `.text-4xl`: font-size: var(--text-4xl)
- `.weight-400`: font-weight: 400
- `.weight-500`: font-weight: 500
- `.weight-600`: font-weight: 600
- `.weight-700`: font-weight: 700
- `.mono`: font-family: monospace (token-backed mono family)
- `.eyebrow`: eyebrow typography style (small uppercase, tracking)
- `.truncate`: text-overflow: ellipsis; white-space: nowrap; overflow: hidden
- `.clamp-1`: display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden (line-clamp 1)
- `.clamp-2`: display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden (line-clamp 2)
- `.clamp-3`: display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden (line-clamp 3)
- `.hover`: &:hover { background: var(--state-hover) } (attention proposal)
- `.transition`: transition with the default duration/easing pair
- `.button`: reset, type baseline, inline-flex, height, pad-x, radius, text-decoration:none, :focus-visible ring
- `.primary`: background: var(--theme-color), ink inverse (works on any element)
- `.ghost`: transparent bg, border: 1px var(--border), ink primary
- `.is-icon`: square, centered, text-decoration:none (so <a class="is-icon"> stands alone)
- `.input`: form input composition (includes background; plain class over vocabulary, yours to restyle)
- `.select`: form select dropdown composition (plain class over vocabulary, yours to restyle)
- `.field`: form field container composition (plain class over vocabulary, yours to restyle)
- `.field-label`: form field label composition (plain class over vocabulary, yours to restyle)
- `.field-error`: form field error message composition (plain class over vocabulary, yours to restyle)
- `.card`: card container composition (plain class over vocabulary, yours to restyle)
- `.badge`: badge / pill indicator composition (plain class over vocabulary, yours to restyle)
- `.avatar`: avatar media composition (plain class over vocabulary, yours to restyle)
- `.divider`: divider line separator composition (plain class over vocabulary, yours to restyle)
- `.kbd`: keyboard shortcut tag composition (plain class over vocabulary, yours to restyle)
- `.tab-list`: tab list header container composition (plain class over vocabulary, yours to restyle)
- `.tab-trigger`: tab trigger button composition (plain class over vocabulary, yours to restyle)
- `.switch-track`: toggle switch track composition (plain class over vocabulary, yours to restyle)
- `.switch-thumb`: toggle switch thumb composition (plain class over vocabulary, yours to restyle)
- `.marquee`: marquee scrolling container composition (plain class over vocabulary, yours to restyle)
- `.link`: hyperlink text composition (plain class over vocabulary, yours to restyle)

---

## authors' dialogue

glm:
Side-axis names: full words pad-top/right/bottom/left (recommended, legible) vs pad-t/r/b/l (shorter)?
Negative margins: the one legit use-case (pulling). Defer to v1.1, or adopt now (syntax TBD)?

human:
yes full words with hyphen 
negative margins - add, constructing it in the new simple ways dont over engineer anything

glm:
.grid-3 stepping: 3→1 or 3→2→1?

human:
grid stepping comes into play only in few cases.
when count of items in grid is exactly 3, then 3 columns should just jump to 1 column, so no instance of uneven count of items in 2 rows. call this "gridding golden rule 1" 😉 
when count of items in grid is exactly 4, then 4 columns should just jump to 2 columns then 1, so that there is no instance of 3 items in 1 row and 1 item in 2nd row. "gridding golden rule 2" 😁 -> -> when no. of items are known and are exactly multiples of 4, this rule applies. 

glm:
Pare list: confirm .stack .cluster .center-column .cover .frame .reel die at v2 (aliases until then).

human:
pare list - lets be clinical. are "stack" and "cluster" any kind of industry standards for what i define with .box and .row?
center-column, cover - drop
.frame - just define i think some generics - .frame-16-9, .frame-9-16, and similar for 2-3, 3-4. or some smarter way, but cover the presets without = and + abstractions. 
.reel is quite near to being a nice starter class for carousels. remove the + and = , but keep .reel open for now it might show utility

glm:
Status/attention set: .text-success…info + .hover + .transition — in v1 or deferred?

human:
i understood no part of that question at all.

glm:
L3 additions: .section (vertical rhythm), .with-sidebar (sidebar→menu), .page-shell — in v1?

human:
what is "vertical rhythm"> 
let us answer the question top-down.

what is our markup for page-shell, with and without sidebar?
sample proposal:

```html
<section class="page-shell">

</section>

<!-- and-->
<section class="page-shell">
	<aside class="page-sidebar">
	</aside>
	<main class="page-main">
	</main>
</section>
```

questions we have to answer (these are the physics of our styling universe):
- what does "page-shell" actually do?
	- i've been using it to set a padding-inline, like 16px or 2 rem or something responsive; and a padding-top and padding-bottom, so that content doesnt butt against header/footer.
	- but, if there is a sidebar, then actually page-shell should NOT have padding, for number of reasons:
		- if it retains padding-inline, then sidebar can never have a background color else it will leave gap between that color and backround color on the page's left edge. 
		- padding top and bottom will need more complicated configs, to handle sidebars set at height 100vh - header height.
	- so, should there be .page-shell and .page-shelf, or 2 different classes basically? one is used for pure content padding on a page. other is used when there's sidebar and related styling to manage?

and on that note, 

- shadow-sm, -md, -lg: our system only defines 1 mode. there should at least be light mode variant and dark mode variant. 
- we must define 1 single steps taxonomy, and use that for --space, --text, -shadow, wherever steps are needed. i propose: 
	- -3xs, -2xs, xs, sm, md, lg, xl, 2xl, 3xl
	- this would means --text tokens are unchanged, just using 4xl also which is still same taxonomy
	- but --space-s, --space-m, --space-l need to change. i think 2 alphabets consistency is better. sm, not s, lg not l.
	- and `--space-s-l` must simply go, like it never existed. this must be done in this wave.
- useful height additions:
	- .hfull-vh: min-height: 100vh
	- .hfull-vh-fitted: min-height: calc(100vh - var(--header-height))
	- there can also be cases where we want to set that min-height but only on desktop views, not needing it in mobile views. 
		- now is the time for `_03_responsive.sass` to really shine. the config here should be such that either adding prefixes of `mob:`, `desk:` or suffixes `-mob` `-desk` or even just classes `.mob` `.desk` alongside any class in the markup should lock that class definition for the implied screen width. you get the logic im trying to drive here? 
- L2 needs additions:
	- alignment universe: .xcenter, .xleft, .xright, .xbetween, .xevenly, .ycenter, .ytop, .ybottom
	- this is how they need to function:

```
.box
	display: flex
	flex-direction: column
	&.xcenter
		align-items: center
	&.xleft
		align-items: flex-start
		text-align: left
	&.xright
		align-items: flex-end
		text-align: right
	&.ycenter
		justify-content: center
	&.ytop
		justify-content: flex-start
	&.ybot
		justify-content: flex-end

.row
	display: flex
	flex-direction: row
	&.ycenter
		align-items: center
	&.ytop
		align-items: flex-start
	&.ybot
		align-items: flex-end
	&.xbetween
		justify-content: space-between
	&.xevenly
		justify-content: space-evenly
	&.xright
		justify-content: flex-end
	&.xleft
		justify-content: flex-start

.grid
	display: grid
	&.center
		place-items: center
	&.xcenter
		justify-items: center
	&.xleft
		justify-items: start
		text-align: left
	&.xright
		justify-items: end
		text-align: right
	&.xstretch
		justify-items: stretch
	&.ycenter
		align-items: center
	&.ytop
		align-items: start
	&.ybot
		align-items: end
	&.ystretch
		align-items: stretch
	&.xbetween
		justify-content: space-between
	&.xevenly
		justify-content: space-evenly
	&.xaround
		justify-content: space-around
	&.ybetween
		align-content: space-between
	&.yevenly
		align-content: space-evenly
	&.yaround
		align-content: space-around
```

- for each of these, let us actually define the template/layout instead of just "referring" to it:
	- .hero. so for example, is .hero just a .box with .gap-xl? or does it actually only work with a markup:

```
<div class="hero">
	<h1 class="text-3xl">......</h1>
	<img />
</div>
```

- or what? what is a "hero template" ? or is this something the component library should handle, because > "hero" is not a css class at all but an extensible and preconfigured component with props?
- .toc, .toc-list, .toc-title, .toc-link, .toc-footer : what are their definitions? and let us have a canonical markup for these else they dont make sense fully. 
- .navtree, .navtree-group, .navtree-title, .navtree-sub
- .docs and .docs-mobile-toc definitely need canonical markup and full styling definition for record and source of truth

- at highest fractal level we actually need to canonize markups otherwise it doesnt have meaning or consistency

```
<div class="app-shell">
	<header class="app-header"></header>
	<main class="app-main">
		<aside class="sidebar-left"></aside>
		<section class="main-section">
			<article class="content-shell">
			</article>
		</section>
		<aside class="sidebar-right"></aside>
	</main>
	<footer class="app-footer"></footer>
</div>
```

something like the abve demo example IS the holy grail, and actually this single markup, with configurability, is the highest level. if we define this, or an equivalent, that's actually docs, navtree, toc already defined.

- `.text-brand` is a spillover from marketing dashboards taking over styling. its a theme color. `.text-theme`. 
- add border-left and border-right too. 
- `.eyebrow` also always trips me up. is it basically .text-3xs? or .text-2xs? or is it just `.text-3xs tt-u` ? i dont mind defining it. but lets define it. no point if a class named .eyebrow just becomes .docs-eyebrow and .app-eyebrow or .app-header > .eyebrow and is defined different in each instance. 
- what are use cases of clamp-1, -2, -3?
- .hover should not at all be ever defined independently. it is only a `&.hover` class, like all the xcenter and ybetween etc classes . same for .primary, .ghost, .is-icon they should not have a standalone definition. 
- is `.marquee` just `.reel` by another name?
- need some presets for `<a>`. basically a link where text has color, a link where text inherits color and displays no hint its inside an `<a>` tag (like when a card is `<a>` and has text inside), option to have that text change color/transform on hover over its parent, and so on. this is the `.link` family.
- `.transition` -> see my section below `### Presets`. 


### Presets

a prelim preset taxonomy and wireframe will be good to proceed with, as we work on all above matters of dialog and consensus. this is the wireframe that comes to mind. let us agree on the "what" first, what we call them is downstream.

1. layout presets : tight, comfortable, sprawling
at tight, gaps and pads are, say, 4px and 8px inside levels 2 and below, 8px and 12px above.(or our --space- equivalents)
at comfortable, 8px and 16px; 16px and 24px (or our --space- equivalents)
at sprawling...lets define

2. shape presets: round, curved, pro
round makes fractals with high border-radius, curved with medium. 
im undecided if pro should set border-radius of 2px/3px, and have an additional "sharp" preset for 0px, or keep 1 between them.

3. color language: clean, general, vibrant
clean - only on hover do items get a background different than --bg, or popovers/dialogs type of items do
general - set a template, for sidebar and/or header in a diff background
vibrant - maybe throw theme-color/-alt backgrounds in the mix?

4. motion language: heavy, reduced/off, active, springy -> you get the picture?