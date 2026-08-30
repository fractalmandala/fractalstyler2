---
title: Agent Instructions
description: Master rules, styling constraints, ecosystem contracts, and guidelines for AI agents working in fractalstyler2.
type: fractalstyler2
---

# AGENTS

> You cannot add ad-hoc CSS anywhere. Styles are added ONLY inside the system's designated files (`fractalstyler2` templates / the project's global SASS sections), always via fractal composition and existing tokens. No scoped `<style>` blocks anywhere, including components. 

> All colors, spacing, radii, and shadows resolve from the shared 30-token vocabulary. Source of truth: `fractalstyler2` `_00_tokens.sass` for the contract, `_00_themes.sass` for the 41 palettes that fill it. Never invent token names, never use legacy aliases (`--theme`, `--theme-hover`), never hardcode a value a token covers.

**You MUST understand and use the `fractalstyler2` styling system — it ships as plain CSS and as SASS, so never assume a preprocessor. Learn it here: [docs/README.md](./docs/README.md) and [REGISTRY.md](./REGISTRY.md).**

NPM link: https://www.npmjs.com/package/fractalstyler2

If you find existing violations of these rules, drop a comment to the user. The project is in flux and they might be known, temporary violations. The project is part of a core set that should always be in sync. You are never working in any one of these projects alone. You are working in a WIP ecosystem:

1. `fractalsvelte` — website to front various SvelteKit projects, docs, and resources.
2. `Fractalsvelte UI` — WIP components library at `/Users/amrit/fractalmandala/fractalcodex`.
3. `Fractalstyler2` — CSS/SASS styling system at `/Users/amrit/fractalmandala/fractalstyler2`. [NPM](https://www.npmjs.com/package/fractalstyler2) and [GitHub](https://github.com/fractalmandala/fractalstyler2).
4. `Fractalthemer` — OPTIONAL augment for Fractalstyler2: atmospheric auras, background patterns, gradients, a picker UI, and a custom-theme studio. The 41 palettes themselves live in `fractalstyler2`. At `/Users/amrit/fractalmandala/fractalthemer`. [NPM](https://www.npmjs.com/package/fractalthemer) and [GitHub](https://github.com/fractalmandala/fractalthemer).

Contract changes start and end in `fractalstyler2`: the token contract and the
41 palettes both live there, so there is nothing to mirror for colour. Then run
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

### The surface pass (fractalstyler2)

Every substantive change to the system leaks into surfaces that describe it.
After any change to classes, tokens, the CLI, or the packaging story, walk all
of these before calling it done — the ones marked *generated* need only a
`pnpm registry`:

| Surface | What goes stale |
|:---|:---|
| `README.md` | The tagline, the quick start, the layer summary |
| `docs/01`–`13` | Whichever chapter owns the layer you touched |
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

`pnpm check` runs `scripts/validate-deck.js`, which mechanically catches the
two failure modes that have actually happened here: a class name that is not in
the registry, and prose that teaches an API the system does not have. It cannot
catch a stale sentence — that is what the table is for.

**Two framing rules that keep getting broken:**

1. **This is not a SASS system.** It ships as plain CSS *and* as editable SASS,
   from one source, byte-identical. Never describe it as SASS-first, never
   assume a consumer has a preprocessor, and never make the CSS path read as a
   fallback. The validator asserts this for the four identity strings.
2. **There are no authoring mixins.** `+stack`, `+surface`, `space()` and
   friends do not exist. If a surface teaches them, it is wrong.
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