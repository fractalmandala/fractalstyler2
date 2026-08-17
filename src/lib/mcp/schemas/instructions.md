# fractalstyler2 MCP Server

The fractalstyler2 MCP server provides tools to inspect design tokens, snap canvas pixel values to Utopia tokens, compile indented SASS fractal mixins to live CSS, generate Svelte 5 runes components with scoped SASS, and lint style recipes.

## Available Tools:
1. **compile_fractals**: Compiles indented SASS fractal mixins (+surface, +stack, +gap, etc.) into live CSS.
2. **get_design_tokens**: Returns structured JSON for fluid space scale (3xs..3xl), typography, radii, shadows, surfaces, and ink roles.
3. **snap_to_tokens**: Snaps raw pixel measurements (gap, padding, radius, fontSize) from canvas/inspection to the closest design tokens.
4. **css_to_fractals**: Converts raw CSS declarations into idiomatic fractal mixin recipes.
5. **generate_component**: Generates complete Svelte 5 components with runes and scoped SASS fractals.
6. **validate_recipe**: Lints code against golden rules (flags legacy v1 classes like gap8/pad16, hardcoded pixels, modifier classes).
7. **list_fractals**: Catalogs all atom & molecule mixins with signatures.

## Golden Rules:
- Never hardcode values that tokens cover; use `+gap(m)`, `+radius(12)`, `+bg(surface)`.
- Compose fractals (`+surface`, `+stack`, `+cluster`); write raw CSS only for unique lines.
- Express component state on `data-*` / `aria-*` attributes, never modifier classes.
- No legacy v1 classes (e.g. `gap8`, `pad16`, `w100`, `.stack` in markup).
