---
title: Agent Instructions
description: Master rules, styling constraints, ecosystem contracts, and guidelines for AI agents working in fractalstyler2.
type: fractalstyler2
---

> You cannot add ad-hoc CSS anywhere. Styles are added ONLY inside the system's designated files (`fractalstyler2` templates / the project's global SASS sections), always via fractal composition and existing tokens. No scoped `<style>` blocks anywhere, including components. 

> All colors, spacing, radii, and shadows resolve from the shared 30-token vocabulary. Source of truth: `fractalstyler2` `_00_tokens.sass` for the contract, `_00_themes.sass` for the 76 palettes that fill it. Never invent token names, never use legacy aliases (`--theme`, `--theme-hover`), never hardcode a value a token covers.

**You MUST understand and use the `fractalstyler2` styling system — it ships as plain CSS and as SASS, so never assume a preprocessor. Learn it here: [docs/README.md](./docs/README.md) and [REGISTRY.md](./REGISTRY.md).**

NPM link: https://www.npmjs.com/package/fractalstyler2

If you find existing violations of these rules, drop a comment to the user. The project is in flux and they might be known, temporary violations. The project is part of a core set that should always be in sync. You are never working in any one of these projects alone. You are working in a WIP ecosystem:

1. `fractalsvelte` — website to front various SvelteKit projects, docs, and resources.
2. `Fractalsvelte UI` — WIP components library at `/Users/amrit/fractalmandala/fractalcodex`.
3. `Fractalstyler2` — CSS/SASS styling system at `/Users/amrit/fractalmandala/fractalstyler2`. [NPM](https://www.npmjs.com/package/fractalstyler2) and [GitHub](https://github.com/fractalmandala/fractalstyler2).
4. `Fractalthemer` — OPTIONAL augment for Fractalstyler2: atmospheric auras, background patterns, gradients, a picker UI, and a custom-theme studio. The 76 palettes themselves live in `fractalstyler2`. At `/Users/amrit/fractalmandala/fractalthemer`. [NPM](https://www.npmjs.com/package/fractalthemer) and [GitHub](https://github.com/fractalmandala/fractalthemer).

Contract changes start and end in `fractalstyler2`: the token contract and the
76 palettes both live there, so there is nothing to mirror for colour. Then run
`pnpm tokens:generate` in `fractalcodex` if applicable, and check `fractalthemer`
only if the change touches what its auras or picker read. A change in one repo
usually means a version bump in another.

> `fractalcodex` is the folder name of the `fractalsvelte-ui` components library.

---

## Dev Servers

Always first check with user if they have a dev server active before starting your own. If they do, use that. Always kill servers that you have started when done. Do not leave them running in the background.

---

## Other Rules

- Always keep docs, `README.md`, and `AGENTS.md` up to date in any project.
- All documentation files should have structured YAML frontmatter:

```yaml
---
title: ...
description: ...
type: {project/site name}
---
```

- If you see a doc without frontmatter, add it.
- **"Done"** always means that for any fix/feature/mod the docs have been updated, the registry is regenerated via `pnpm registry`, package version has been bumped if applicable, and the build passes cleanly (`pnpm check && pnpm build`).

### Adding a class to the system

1. **Put it in the partial that owns its layer.** The layer is the file, not a
   label you choose:

   | File | Layer |
   |:---|:---|
   | `_00_tokens.sass`, `_01_config.sass` | L0 tokens |
   | `_02_dimensions.sass` | L1 dimensions |
   | `_03_containers.sass` | L2 containers |
   | `_04_layouts.sass` | L3 layouts |
   | `_05_shells.sass` | L4 shells |
   | `_06_visuals.sass`, `_07_interactions.sass` | L5 visuals |
   | `_08_own.sass` | **not the system** — third-party overrides only |

2. **Document it on the selector line.** A trailing `// …` comment becomes the
   description in `registry.json`, `REGISTRY.md`, and the skill reference an
   agent greps. Without it the class is indexed with a useless placeholder
   (`.foo component / container`) and an agent finding it learns nothing.

   ```sass
   .scroll-y // Vertical scroll inside a bounded height; needs an .h-*
   	overflow-y: auto
   ```

   The same works for `&.modifier` variants.

3. **Run `pnpm registry`.** Plain classes, `&.modifier` variants, and indented
   child classes are discovered automatically. It rewrites `REGISTRY.md`,
   `docs/REGISTRY.md`, `registry.json`, `src/lib/themes.ts`, `src/lib/version.ts`,
   both `skills/fractal-styler/references/*.md`, and syncs `plugin.json`'s version.

4. **Loop-generated and wildcard families are invisible to the parser.** A class
   emitted by an `@each` (`.gap-*`, `.frame-16-9`) never appears as a literal
   selector line, so it needs a hand-written `addEntry(...)` in
   `scripts/update-registry.js` alongside the existing ones.

5. **Run `pnpm check`.** `validate-deck.js` compiles the SASS fresh, so no build
   step is needed first — but it means a class you have not actually defined
   will fail wherever a doc mentions it.

6. **Walk the surface pass below**, and add the class to the doc chapter that
   owns its layer. The validator checks that a documented class *exists*; only
   the table below catches a class that exists and is documented nowhere.

---

### The surface pass (fractalstyler2)

Every substantive change to the system leaks into surfaces that describe it.
After any change to classes, tokens, the CLI, or the packaging story, walk all
of these before calling it done — the ones marked *generated* need only a
`pnpm registry`:

| Surface | What goes stale |
|:---|:---|
| `README.md` | The tagline, the quick start, the layer summary |
| `docs/01`–`14` | Whichever chapter owns the layer you touched; `14` for anything the package exports |
| `docs/specs/*` | The spec for whichever language moved — these are what a reviewer checks against |
| `docs/README.md`, root index tables | Chapter one-liners |
| `AGENTS.md` | How the project is described to agents |
| `skills/fractal-styler/SKILL.md` | The rules an agent is handed |
| `references/fractals.md`, `references/tokens.md` | *generated* |
| `REGISTRY.md`, `registry.json`, `version.ts` | *generated* |
| `src/lib/mcp/server.ts` | Tool descriptions, GUIDELINES, prompts |
| `src/lib/mcp/schemas/*.json`, `instructions.md` | Hand-copies of the tool defs — these ship to agent configs |
| `src/lib/cli.ts` | Usage banner and the post-init next steps |
| `package.json` / `plugin.json` | `description`, `keywords`, `exports` |
| `src/lib/styles/canonical-markups.md` | Shell structures, if L4 moved |

`pnpm check` runs `scripts/validate-deck.js`, which walks `docs/` (recursively —
`agents/` and `specs/` included), `skills/`, the components, and the MCP surface,
asserting six things mechanically:

1. **Class names** resolve against the *compiled stylesheet*, not `registry.json`.
   The registry carries wildcard families, and matching on those stems accepted
   `.radius-md` — a class that does not exist — everywhere it appeared.
2. **Links** resolve, and **anchors** match a real heading (GitHub's slug rules).
3. **Stated counts** match reality — token contract size, theme count.
4. **No phantom API**: nothing teaches the mixins that never shipped.
5. **No `>` combinators** in the stylesheet, one allowlisted exception.
6. **Framing**: the system is never described as SASS-only.

It still cannot catch a stale sentence — that is what the table is for.

**Two framing rules that keep getting broken:**

1. **This is not a SASS system.** It ships as plain CSS *and* as editable SASS,
   from one source, byte-identical. Never describe it as SASS-first, never
   assume a consumer has a preprocessor, and never make the CSS path read as a
   fallback. The validator asserts this for the four identity strings.
2. **There are no authoring mixins.** `+stack`, `+surface`, `space()` and
   friends do not exist. If a surface teaches them, it is wrong.
3. **No child combinators.** Opinion #1 in the introduction forbids `> *` and
   its relatives; selectors are plain descendants, and anything that needs to
   be targeted precisely gets a name instead. Exactly one exception exists —
   the `.reel` snap rail — and it is allowlisted by literal match in
   `scripts/validate-deck.js`. Reach for a name, not a combinator.
- For any icons, use the installed package `fractalicons` or install it from [NPM](https://www.npmjs.com/package/fractalicons).
- Do not use local reference file paths for package dependencies in production configuration; always use the NPM sources.

> If you find yourself using styling not in `fractalstyler2`, or using components not from `fractalsvelte-ui`, then either 1) you are being careless and non-compliant, or 2) you must notify the user for feature request(s) in those projects.

---

## Working Index

- **Fractalsvelte (site)**: not yet in GitHub, not live.
- **Fractalsvelte UI**: `/Users/amrit/fractalmandala/fractalcodex` | will overwrite the repo `https://github.com/fractalmandala/fractalsvelte` | will overwrite the package `https://www.npmjs.com/package/fractalsvelte`
- **Fractalthemer**: `/Users/amrit/fractalmandala/fractalthemer` | `https://github.com/fractalmandala/fractalthemer` | `https://www.npmjs.com/package/fractalthemer`
- **Fractalstyler2**: `/Users/amrit/fractalmandala/fractalstyler2` | `https://github.com/fractalmandala/fractalstyler2` | `https://www.npmjs.com/package/fractalstyler2`
- **Fractalicons**: `/Users/amrit/fractalmandala/fractalicons` | `https://github.com/fractalmandala/fractalicons` | `https://www.npmjs.com/package/fractalicons`

### WIP, Upcoming
- Svelte Animated Icons
- Acrolls, docs for SvelteKit
- Svelte Scaffold