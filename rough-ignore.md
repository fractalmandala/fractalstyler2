# About Fractalstyler

Of the greatest, most deliberate design there ever has been - ṛta, or ऋत, the order of reality - it has been said in the sacred Upaniṣads:

**yathā piṇḍe tathā brahmāṇḍe | yathā brahmāṇḍe tathā piṇḍe**

As above, so below, and vice versa. It is the simplest, most elegant ordering principle of reality. The great design, ṛta, is fractal. And it got me thinking - can styling systems not be fractal too?

From tokens and dimensions, to layouts and shells, to colors and themes, Fractalstyler is a system built around the idea that all styling can be composed as a combination of "fractals" - unitary classes and styling definitions that configure into higher layers retaining the same modularity. It is inspired by responsive styling at [Utopia](https://utopia.fyi/) and by [EveryLayout](https://every-layout.dev/). But before we get into the good stuff, you are most likely asking the obvious:

**Why another styling system? And why in SASS?!**

1. I don't like Tailwind, period. And viable alternatives like StyleX or even Web Awesome don't do what I want my styling system to do.
2. This entire system is usable in vanila CSS. SASS is a personal preference this system does not force on you.

The system is opinionated about a few things -

1. Styling syntax should be human legible and avoid `__`, `&__`, `> *` kind of usage patterns.
2. To know the "value" of something, one should not have to chase upwards a series of variables like `--thisvar` is set to `(--this-other-var)` which is defined by `$this-token`. Reduce cognitive load always.
3. A styling system like this should ensure responsiveness, standards for size, padding, typography etc. and leave the rest- the actual front-end - to the user. Colors, fonts, fixed-configs vs. fully dynamic, these should not be set by the sytem. Maximum consistency with minimum opinionation.

**To jump straight into documentation and usage, [start here](/docs/fractalstyler/01-getting-started).**

## The Mental Frame

You'll get the feel for Fractalstyler quickly, with just one heuristic - everything is a fractal -> fractals group in layers -> one layer seeds the next layer of fractals -> from tokens to appshells.

### L0 fractals

Level 0 fractals are the tokens. colors, sizes, font-sizes, and the like. The color tokens may feel opinionated at first, but they already bloom with 20 preset themes, and are fully compatible with ShadCN themes. Text sizes and space tokens are fluid responsive. All are defined such that they enable various configurations of Level 1.

> `_tokens.sass` is well understood, no fundamental change in that.

### L1 fractals

The filling out of space, creating dimensions, is Level 1 of Fractalstyler. Gaps for flex-boxes and grids, padding for anything and everything, margins, heights, widths - all built from the elementary tokens, all structured for consistent presets and also fully extensible. 

> this should be definitions for gap, pad, margin, space, border-radius of the following configs
> .gap, .rgap, .cgap with 2 config types. preset sizing and extensible sizing. preset sizing is `-3xs` `-lg` etc. extensible is where the package should have config for generating valid and `-N` as a px sizing.

> i've realized we should pare down a lot of the `=xyz` definitions that get used as `+xyz` in classes. 
> because that actually locks up their usage at that level and they are no longer fractal.
> case study:

```
.gap-3xs
.gap-2xs
.gap-xs
...
till .gap-3xl -> corresponding to tokens --space-3xs to --space-3xl
⭐ if `+gap-3xs` exists, it has to be *articulated* under other classes to have salience. but if `.gap-3xs` exists, it's a fractal that lives even at the highest layers.
```

> and the fractals are .gap, .rgap, .cgap, .pad, .padtop, .padbot, .padleft, .padright, .pad-x (inline, or x axis), .pad-y (y-axis), .marg, .margtop, .margbot, .margleft, .margright, .marg-x, .marg-y
> ❓need to think of how border-radius is folded into this.
> AND, config it such that for all of these, any -N parses to that number's px value. for 1px to 256px
> docs will recommend a system, like pad-4, pad-8, pad-16, pad-32 etc. but system will also permit granular fractals.

What dimensions do is make genesis possible. Of actual space and volume and structure. In their spreading out, various containers become possible. And that takes us to Level 2.

### L2 Fractals

Everything in [web design is a box](https://www.smashingmagazine.com/2019/05/display-box-generation/), indeed, and boxes are just the fractals that dimensions spread out and create. 

A button is a box created by height, width, padding. 
A flexbox by gaps, padding, sizing. 
Cards, inputs, text areas - boxes all. 

And since they interact with each other, either as parents and children, or as siblings, there's some alignment to manage. That's precisely what a styling system should manage. 

So Fractalstyler provides aligners, calibrators, tuners - all from the same family of preceding fractals. 

> .xcenter, .ycenter, .box as flex-direction of column, .row as flex-direction of row, .wrap. Things to tell them whether to .grow or .shrink, or be .sticky or .absolute or .relative etc. ie - L2 fractals is how dimensions and containers fit and fill inside the universe - the web page.

> I feel this is the part we have currently over complicated and abstracted too much. We just need some class types, and those classes to carry the same -xs/-xl + -N kind of extensabilities.

When these containers learn their roles and inter-relationships, the system organically brings to life the next level.

### L3 Fractals

Stars and planets and nebulae form galaxies, galaxies cluster.
Dimensions and containers form layouts, layouts templatize.

Level 3 of Fractalstyler is the simple creation of consistent and responsive grids, sections, page types. 
A responsive grid is easy, but don't we all know that a grid of 6 cards should scale down from 6 columns to 3, then 2, then 1 - but never 5 or 4, for that breaks harmony.
A grid of 4 cards, or 8, or 12 - when scaling down should jump from 4 columns to 2, never 3 - for the same reason. 
These are ways a styling system is kept both responsive and intelligent. 
And operating here too are the lower fractals - leaving gaps, pads, alignments - all still in your control.

> Good example here of how `+gap-xs` would mean continuing to define it again and again under `.grid` or `.section` but `.gap-xs` could fit in alongside `.grid` without a missing a beat. Fractals. 
> Here we should define basic .grids, modular page components like sidebars that become menus, responsive tab rows, etc -> page elements and sections that can have some preset types for how tight, how wide etc but fundamentally ensure that user is neither reinventing the same things by writing new code and classes each time, nor being inconsistent page to page with different headers, different sidebar widths, different grid gaps etc.. modals, dialogs, popovers. 
> Case study:

```
between this:
=surface($bg: surface, $pad: null, $radius: 6, $elevation: none)
	+bg($bg)
	@if $radius != null
		+radius($radius)
	@if $pad != null
		+pad($pad)
	@if $elevation != none
		+shadow($elevation)

and this:
.surface
	+surface(surface, null, 6)
	+box(stretch, start)
	&[data-role='raised']
		+bg(raised)
	&[data-role='bg']
		+bg(bg)
	&[data-role='panel']
		+bg(panel)
	&[data-role='popover']
		+bg(popover)
	&[data-role='dialog']
		+bg(dialog)

have we simplified things, reduced cognitive load, and ensured consistency, or bloated a single concept of "surface" beyond recognition? And why is .surface hardcoded to be a +box? What if I just want the shortest line to have a row with background of --bg-surface? And if [data-role='popover'] makes a surface with --bg-popover then:

.popover
	+surface(popover, null, 6, md)

this poor guy does what?
just 1 example here, but this bloat spreads over out blocks, recipes, molecules etc.

instead, consider:

.surface
	background: var(--bg-surface)

that's it. That's all that it does. And this ensures that --bg-surface and .surface live as fractals at any layer.
```

> L3 is definitions for layouts and templates of how containers fit and align with each other into larger blocks, that's it!

## L4 Fractals

It should be evident enough by now. Once we have layouts and templates, and since we are in the business of making beautiful UI, there's only a couple of things left.

1. how it all looks put together.
2. how it all behaves.  

Level 4 resolves the first point here.
Our inherently responsive system and Sveltekit's native features manage the second point. 

To put it all together, we need shells, colors, and a clamp here or there. And the best part is, if we've been following the modular, fractal construct thus far, there's nothing new to process.

A .page-shell, to manage landing pages or section heroes. An .app-shell with .app-header and .app-main . A holy-grail docs config that just knows when to contract a right TOC into a dropdown menu, and when to retract a left sidebar nav into a header menu button. Accordions that open when you want them to, accordion parents that regulate what closes when what opens. 

At Level 4, our fractal structure mirrors itself. Tokens and dimensions filled out containers and layouts from within, and using the same syntax shells wrap them up from outside. And since everyone is finally getting together, they decide to dress up well.

## L5 Fractals

Enter backgrounds, text colors, borders - the looks. A `.surface` knows to dress in a background of `var(--bg-surface)`, a `.popover` pops over in `background: var(--bg-popover)`, and everyone responds well to attention, ie, reacts on hover or click or selection. All of it yoked by a themeing system you get to configure, and a studio for even that system for users that want greater control. Fractalstyler is in control at all times, but gracefully lets you have the wheel whenever and wherever you want. Various trims and accessories complete the look - classes to truncate, classes to transition, classes to toggle or expand. Ways for you to create an active, vibrant UI with smooth motion, and ways to keep it gentle and minimal. 

> all .text-primary type of text colors. .surface, .popover, .dialog etc., borders. hover state changes. transitions, and so on.

> I still can't figure where to bring in buttons and links in this schema.
> AND ONE MAJOR ISSUE. ive meant to contain this but its just gotten out of hand. I'm personally averse to a system using, say, `<button data-variant="icon">`. And then having things like `[data-variant='default']`, `[data-variant='primary']` etc. I feel the phrase "data-variant" and the square brackets are unnatural in styling and don't belong in it.
> Simple:

```
.button
	&.primary
		....
	&.is-icon
		....
	&.ghost
	&.active

...and so on
```