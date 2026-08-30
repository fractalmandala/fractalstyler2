# fractalstyler2 MCP Server

`fractalstyler2` is a composition styling system, shipped as plain CSS and as
editable SASS from one source. **The class registry is the entire public API.**
You compose in markup; you do not author CSS. Never assume the project has a
SASS toolchain.

The system defines no authoring mixins and no SASS functions. Reaching for
`+stack`, `+surface`, `+gap()` or `space()` means inventing an API — none of
them exist. Call `list_fractals` whenever you are unsure of a class name.

## Available Tools

1. **list_fractals** — the class registry, filterable by layer (`L0` tokens,
   `L1` dimensions, `L2` containers, `L3` layouts, `L4` shells, `L5` visuals
   and interactions). Query this before naming any class.
2. **get_design_tokens** — the fluid space scale (3xs..3xl), typography,
   radii, shadows, surfaces and ink roles as structured JSON.
3. **snap_to_tokens** — snaps raw pixel measurements (gap, padding, radius,
   fontSize) from canvas inspection to the nearest token step.
4. **css_to_fractals** — converts raw CSS declarations into a composed class
   string, and reports what the registry does not cover.
5. **generate_component** — a complete Svelte 5 component, composed from
   registry classes, with no style block.
6. **validate_recipe** — flags invented class names, component `<style>`
   blocks, and hardcoded pixel values.
7. **compile_fractals** — compiles indented SASS to CSS, for the rare custom
   declaration that genuinely does not compose.

## Golden Rules

- **Do not invent class names.** A composed string like
  `class="row ycenter xbetween gap-sm pad-md surface border"` is the finished
  state, not something to tidy into a semantic class.
- Never hardcode a value a token covers: `.gap-sm`, `.radius-md`, `.surface`.
  Literals (`.gap-16`) are the escape hatch when an exact pixel is
  load-bearing.
- `x` is always horizontal and `y` always vertical, in every container. Never
  reason about `justify-content` vs `align-items`.
- Grids step through divisors only: `.grid-6` goes 6 → 3 → 2 → 1 and never
  strands a row. Use `.grid-N` for a known count, `.card-grid` otherwise.
- Shell classes come with a canonical markup. Copy it verbatim; the responsive
  behaviour is a consequence of the structure.
- `_08_own.sass` is for third-party widget overrides only. Check the cookbook
  before writing any custom declaration.
