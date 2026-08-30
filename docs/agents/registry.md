---
id: registry
title: Agent Command Registry
type: design
tags: [agents, commands, registry, prompts, workflows, ai]
summary: Named, self-contained agent prompts that direct an AI agent to build pages, components, layouts, shells, and themes with Fractalstyler2.
updated: 2026-08-30
---

# Agent Command Registry

Each entry is a **command**: a reusable prompt directing an AI coding agent to perform standard design system tasks with `fractalstyler2`. Hosts can execute these directly during pairing sessions or wire them as IDE slash commands.

**Every command inherits the [Golden Rules & UI Invariants](#golden-rules--ui-invariants).**

---

## Command Index

| Command | Use when the user wants to… | Primary Documentation |
|:---|:---|:---|
| [`fs2:init`](#fs2init) | Scaffold the system into a project — CSS or SASS | [02. Getting Started](../02-getting-started.md) |
| [`fs2:page`](#fs2page) | Build a whole page, route, or marketing shell | [08. Shells & Canonical Markups](../08-shells-and-markups.md) |
| [`fs2:component`](#fs2component) | Build a reusable component block with Svelte 5 runes | [06. Containers](../06-containers.md), [09. Visuals](../09-visuals-and-interactions.md) |
| [`fs2:layout`](#fs2layout) | Build a responsive page-layout template or grid | [07. Layouts & Grids](../07-layouts.md) |
| [`fs2:preset`](#fs2preset) | Tune Layout, Shape, Color, or Motion presets | [10. Presets & Runtime Tuning](../10-presets.md) |
| [`fs2:refactor`](#fs2refactor) | Convert legacy CSS or utility soup to fractal recipes | [12. Agent Plugin & Skills](../12-agent-plugin.md) |
| [`fs2:review`](#fs2review) | Audit markup and SASS for fractal idiom and UI invariants | [04. Tokens](../04-tokens.md), [08. Shells](../08-shells-and-markups.md) |

---

## Golden Rules & UI Invariants

Applied to every command:

1. **Strict 31-Token Contract**: Never introduce foreign CSS variables (`--card`, `--primary`, `--border-strong`). All surfaces, ink, borders, brand, and status feedback must resolve from the 31-token contract in `_00_tokens.sass`.
2. **Never hardcode values that tokens cover**: Route through token-scale classes (`.gap-sm`, `.pad-md`, `.radius-8`, `.surface`, `.text-primary`). Exact pixel literals (`.gap-12`, `.pad-16`) are the sanctioned opt-out.
3. **Physical Alignment Law**: Always use `.xleft`/`.xcenter`/`.xright` for horizontal alignment and `.ytop`/`.ycenter`/`.ybot` for vertical alignment.
4. **Reading Column Max Columns Law**: Any grid placed inside a reading column (`.prose`, `.content-shell`, or container $\le 760\text{px}$) must **never exceed 2 columns** (`.grid-2` or `.card-grid`). 3, 4, and 6-column grids are strictly reserved for full-width views.
5. **Partition Breathing Room**: Every divider line (`border-top` or `border-bottom`) that partitions content MUST have reciprocal padding (`var(--space-xs)` or `var(--space-sm)`). Content text or action chips must never touch a divider line directly.
6. **Card Containment (Zero Overflow)**: Multiple-button rows, tag collections, or badge clusters within cards must use `.row.wrap`. Fixed controls (`.switch-track`, `.avatar`, `.button.is-icon`) must specify `flex-shrink: 0` (`.shrink-0`).
7. **Form Control Optical Baseline**: `<select>` and `<input>` must use `.select` / `.input` with optical line-height (`1.5`) and standard focus rings (`var(--ring)`). Never apply raw `.input` to `<select>`.
8. **Visual Toggles Ride Classes**: `.open`, `.active`, `.checked` for JS-toggled looks; native HTML attributes (`disabled`, `aria-expanded`, `aria-selected`) retain their semantic roles.

---

## fs2:init

> **Goal:** Scaffold the system into the user's project.
>
> **Procedure:**
> 1. Establish which flavour the project wants. **Ask if it is not obvious, and
>    do not assume a SASS toolchain** — most projects want the compiled CSS.
> 2. **CSS (the default):** run `npx fractalstyler2 init --css [dest]` (default
>    destination `src/styles`). Link `fractalstyler.css`, or import it if there
>    is a bundler. Nothing else is required — no preprocessor, no config.
> 3. **SASS (only if they want to retune the generators):** run
>    `npx fractalstyler2 init [dest]` (default `src/lib/styles`), ensure `sass`
>    is in `devDependencies`, import `index.sass` once globally, and verify the
>    preprocessor is enabled.
> 4. Either way, point the user at the scaffolded `canonical-markups.md` before
>    they build any shell.

---

## fs2:page

> **Goal:** Build a complete page or route using canonical shells and layout markups.
>
> **Procedure:**
> 1. Select a layout shell: `.app-shell` (desktop/web app), `.page-split` (master-detail with sidebar), or `.page-shell` (standard content page).
> 2. Structure content sections with layout fractals — `.grid-4`/`.grid-3` for full-width dashboards, `.grid-2`/`.card-grid` for reading views, `.hero` for leads.
> 3. Populate with canonical components (`.card`, `.field`, `.button`, `.badge`, `.select`).
> 4. Compose in markup. Do not invent class names, and do not tidy a composed
>    class string into a semantic one — that string is the finished state.

---

## fs2:component

> **Goal:** Author a reusable component block following the fractal composition pattern.
>
> **Procedure:**
> 1. Start from `.surface` / `.card` for container materials, or `.box` / `.row` for layout flow.
> 2. Add skin, spacing, and typography via atoms (`.bg`, `.surface`, `.text-primary`, `.pad-md`, `.gap-sm`).
> 3. Express variants and states with `.open`, `.active`, `[aria-expanded]`, and `[disabled]`.
> 4. In projects with strict stylesheet separation, place custom component rules in `src/lib/styles/_08_own.sass`.

---

## fs2:layout

> **Goal:** Build a page-layout template or grid stepping pattern.
>
> **Procedure:**
> 1. Mobile-first single-column base using `.box` or `.grid-1`.
> 2. Reshape at breakpoints following the Gridding Golden Rules ($3\to1$, $4\to2\to1$, $6\to3\to2\to1$).
> 3. Keep layouts skin-free — no colors, background fills, or borders (that is the container's role).

---

## fs2:preset

> **Goal:** Configure or tune Layout, Shape, Color, or Motion preset axes.
>
> **Procedure:**
> 1. Apply root data attributes (`data-layout`, `data-shape`, `data-color`, `data-motion`) on `<html>`.
> 2. Use `setPreset(axis, value)` from `fractalstyler2` to persist settings across sessions.
> 3. Ensure `getPresetScript()` is injected into `<svelte:head>` for zero-flicker rendering.

---

## fs2:refactor

> **Goal:** Convert legacy CSS or utility-soup markup into clean fractal recipes.
>
> **Procedure:**
> 1. Map raw CSS declarations to fractals (`display: flex; flex-direction: column` $\to$ `.box`, `border-radius: 8px` $\to$ `.radius-8`).
> 2. Collapse repetitive markup class strings into clean semantic classes or standard atoms.
> 3. Replace magic numbers with standard fluid tokens (`.gap-sm`, `.pad-md`).
> 4. Verify visual fidelity before and after refactoring.

---

## fs2:review

> **Goal:** Audit code for fractal-idiom compliance and UI invariants.
>
> **Checklist:**
> - [ ] **31-Token Contract**: Zero references to foreign tokens (`--card`, `--primary`, `--border-strong`).
> - [ ] **Reading Column Law**: No 3 or 4-column grids inside `.prose` or reading views ($\le 760\text{px}$).
> - [ ] **Partition Breathing Room**: Every `border-top` divider has reciprocal `padding-top: var(--space-xs)` / `var(--space-sm)`.
> - [ ] **Card Containment**: Action rows and tag clusters inside cards use `.row.wrap`. Fixed controls have `.shrink-0`.
> - [ ] **Form Control Optical Baseline**: `<select>` uses `.select` with optical alignment.
> - [ ] **Clean Build**: `pnpm build` passes with zero errors and zero warnings.
