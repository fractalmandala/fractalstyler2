---
title: Agent Plugin Specification & Architecture
description: Complete architecture guide for fractalstyler2 as an Agent Plugin conforming to agent-plugins.org v1.0.0 — skills, MCP runtime, references, and client compatibility.
---

# Agent Plugin Specification & Architecture

`fractalstyler2` is packaged and distributed as a conformant **Agent Plugin** implementing the [Agent Plugins v1.0.0 Specification](https://agent-plugins.org/specification).

This standard enables AI coding assistants, canvas tools, and agent runtimes to automatically discover the design system's skills, mixin references, token tables, and MCP server tools without requiring custom manual configuration.

---

## 1. Package Structure & Specification Layout

```
fractalstyler2/
├── plugin.json                       # Canonical Agent Plugin v1 Manifest (§5)
├── mcp.json                          # Canonical MCP Server Configuration (§7.2)
├── skills/                           # Discovered Agent Skills (§7.1)
│   ├── fractal-styler/               # Core design system & component skill
│   │   ├── SKILL.md                  # YAML frontmatter + prompt guidelines
│   │   └── references/
│   │       ├── tokens.md             # Fluid Utopia scales & clamp tables
│   │       └── fractals.md           # Atom & molecule mixin cheat sheet
│   └── style-migration/              # Migration & refactoring skill
│       └── SKILL.md                  # Replacement matrix & procedures
├── src/lib/mcp/                      # Model Context Protocol runtime
│   ├── server.ts                     # Stdio JSON-RPC server
│   ├── export.ts                     # Schema export & auto-installers
│   └── schemas/                      # Bundled static JSON tool schemas
│       ├── compile_fractals.json
│       ├── get_design_tokens.json
│       ├── snap_to_tokens.json
│       ├── css_to_fractals.json
│       ├── generate_component.json
│       ├── validate_recipe.json
│       ├── list_fractals.json
│       └── instructions.md
└── package.json                      # NPM package descriptor
```

---

## 2. The Plugin Manifest ([`plugin.json`](file:///Users/amrit/fractalmandala/fractalstyler2/plugin.json))

The root `plugin.json` validates against `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`.

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "fractalstyler2",
  "version": "0.1.0",
  "description": "Fractal-composition styling system and design token engine for SvelteKit and AI design tools (OpenDesign, Pencil, Cursor).",
  "author": {
    "name": "Amrit",
    "url": "https://github.com/fractal-mandala"
  },
  "license": "MIT",
  "keywords": [
    "svelte",
    "sveltekit",
    "sass",
    "css",
    "design-system",
    "mcp",
    "tokens",
    "fractals"
  ],
  "homepage": "https://github.com/fractal-mandala/fractalstyler2",
  "repository": "https://github.com/fractal-mandala/fractalstyler2"
}
```

---

## 3. MCP Runtime Configuration ([`mcp.json`](file:///Users/amrit/fractalmandala/fractalstyler2/mcp.json))

Conforms to `https://agent-plugins.org/schemas/1.0.0/mcp.schema.json`. When loaded by an agent plugin client, the `${PLUGIN_ROOT}` placeholder expands automatically to the absolute package root:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "fractalstyler2": {
      "type": "stdio",
      "command": "node",
      "args": [
        "${PLUGIN_ROOT}/dist/mcp/server.js"
      ]
    }
  }
}
```

---

## 4. Discovered Agent Skills

Skills live under `skills/` and conform to the [Agent Skills Specification](https://agentskills.io/specification).

### Skill 1: `fractal-styler` ([`skills/fractal-styler/SKILL.md`](file:///Users/amrit/fractalmandala/fractalstyler2/skills/fractal-styler/SKILL.md))
* **Primary Role**: Instructs agents on authoring Svelte 5 runes components (`$props`, `$state`) using scoped indented SASS (`<style lang="sass">`) with fractal mixins.
* **Included References**:
  * [`tokens.md`](file:///Users/amrit/fractalmandala/fractalstyler2/skills/fractal-styler/references/tokens.md): Complete fluid Utopia token scales (`3xs..3xl`), approximate pixel conversions, clamp formulas, radii, shadows, and color roles.
  * [`fractals.md`](file:///Users/amrit/fractalmandala/fractalstyler2/skills/fractal-styler/references/fractals.md): Signatures and descriptions for all atoms (`+box`, `+row`, `+gap`, `+pad`, `+type`, etc.) and molecules (`+surface`, `+stack`, `+cluster`, `+cover`, `+frame`, `+with-sidebar`, `+cols`).

### Skill 2: `style-migration` ([`skills/style-migration/SKILL.md`](file:///Users/amrit/fractalmandala/fractalstyler2/skills/style-migration/SKILL.md))
* **Primary Role**: Teaches agents how to refactor raw CSS, Tailwind utility soups, or legacy `fractals-styler` (v1) code (`gap8`, `pad16`, `w100`, `.stack` markup classes) into idiomatic `fractalstyler2` SASS mixins.
* **Golden Rules**:
  1. Never hardcode token values in raw CSS (`padding: 16px` → `+pad(m)`).
  2. Use semantic tags and custom class names; never spam utility classes in markup.
  3. Express component state on `data-*` / `aria-*` attributes (never modifier classes like `.is-active`).

---

## 5. Client Compatibility & Setup

| Agent Host / Client | Protocol Support | Installation Method |
| :--- | :--- | :--- |
| **OpenCode** | Native Agent Plugins & MCP | Configured in `~/.config/opencode/opencode.json` |
| **Google Antigravity / Gemini** | Native MCP & Skills Plugin | Auto-installed via `npx fractalstyler2 mcp:install` |
| **Claude Desktop / Claude Code** | MCP & Project Prompts | Add to `claude_desktop_config.json` |
| **Codex** | Plugin root discovery / MCP | Add `mcpServers` in Codex config or load plugin path |
| **OpenDesign / Pencil** | MCP stdio canvas tool | Connect via `npx fractalstyler2-mcp` |
| **Cursor** | Native MCP client | Add to `.cursor/mcp.json` |

---

## 6. How to Install as a Plugin in Each Host

### A. OpenCode
Add to `~/.config/opencode/opencode.json`:

```json
{
  "mcp": {
    "fractalstyler2": {
      "type": "local",
      "command": ["npx", "-y", "fractalstyler2-mcp"],
      "enabled": true
    }
  }
}
```

### B. Gemini / Antigravity
Run the automated installer command:

```bash
npx fractalstyler2 mcp:install
```

This exports the schemas to `~/.gemini/antigravity/mcp/fractalstyler2/` and registers the server in `~/.gemini/antigravity/mcp_config.json`.

### C. Claude (Claude Desktop & Claude Code)
Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "fractalstyler2": {
      "command": "npx",
      "args": ["-y", "fractalstyler2-mcp"]
    }
  }
}
```

### D. Codex
In your Codex project or global configuration (`~/.codex/config.json` or equivalent):

```json
{
  "mcpServers": {
    "fractalstyler2": {
      "command": "npx",
      "args": ["-y", "fractalstyler2-mcp"]
    }
  }
}
```
Or point Codex directly to the plugin directory to load `plugin.json`, `mcp.json`, and `skills/`.
