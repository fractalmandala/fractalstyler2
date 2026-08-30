---
id: 12-agent-plugin
title: Agent Plugin & Coding Skills
type: design
tags: [agent-plugin, skills, ai-agents, automation, opencode, codex, claude]
summary: Reference guide for the Fractalstyler2 Agent Plugin, bundled coding skills (fractal-styler, style-migration), and automated design system integration for AI agents.
updated: 2026-08-30
---

# Agent Plugin & Coding Skills

Fractalstyler2 is built from the ground up for the agentic era, fully conforming to the [agent-plugins.org](https://agent-plugins.org/specification) standard. It equips AI coding agents with deep domain knowledge of fractal composition, fluid token scaling, and automated design migration.

---

## 1. Bundled Skills

The plugin includes two core agent skills located under `skills/`:

### 1. `fractal-styler`
Provides autonomous agents with comprehensive rules and recipes for authoring new Svelte 5 components and layouts:
- **Token Discipline**: Prevents agents from introducing arbitrary pixel measurements or foreign custom properties.
- **Semantic Layering**: Guides composition from L1 dimensions up to L4 canonical shells.
- **Svelte 5 Runes Integration**: Combines `$state`, `$derived`, and `$props` with Fractalstyler2 markup classes.

### 2. `style-migration`
Guides automated refactoring of legacy stylesheets, Tailwind utility classes, or older CSS into idiomatic Fractalstyler2 recipes:
- Replaces legacy JIT utilities (`gap16`, `pad24`, `w100`) with token-routed classes (`.gap-sm`, `.pad-md`, `.wfull`).
- Refactors utility class soup into clean semantic container recipes.
- Migrates old layout abstractions into the canonical L4 shells.

---

## 2. Supported AI Agent Hosts

### OpenCode
Install the plugin manifest directly into OpenCode:

```json
// ~/.config/opencode/opencode.json
{
  "plugins": ["fractalstyler2"],
  "mcp": {
    "fractalstyler2": {
      "type": "local",
      "command": ["npx", "-y", "fractalstyler2-mcp"],
      "enabled": true
    }
  }
}
```

### Claude Code & Claude Desktop
Add the skill paths to your agent configuration or link `skills/` to your workspace.

### Gemini Antigravity
The plugin is natively recognized via `plugin.json` and automatically registers skills and MCP tools upon project discovery.

### Codex & Cursor
Agents running in Codex or Cursor can query MCP tools (`get_design_tokens`, `compile_fractals`, `validate_recipe`) directly during code generation and editing.

---

## 3. Golden Rules for AI Coding Agents

When generating or editing styles in a Fractalstyler2 project, agents must adhere to the following contract:

1. **Strict Token Resolution**: Never invent new CSS variables or hardcode hex colors when a semantic token exists in `_00_tokens.sass`.
2. **Indented SASS Syntax**: Author new styles in single-tab indented `.sass` without curly braces or semicolons.
3. **No Component `<style>` Blocks**: In strict project configurations, author styles in `_08_own.sass` or shared SASS modules rather than in-component style tags.
4. **Zero Border-Radius Discipline**: When projects configure `data-shape="sharp"`, ensure all cards, modals, and buttons respect sharp $90^\circ$ corners.
5. **Physical Alignment**: Use `.xleft`/`.xcenter`/`.xright` for horizontal alignment and `.ytop`/`.ycenter`/`.ybot` for vertical alignment.

---

## Next Steps

- Explore the complete [04-tokens.md](./04-tokens.md) scale.
- Review [08-shells-and-markups.md](./08-shells-and-markups.md) for canonical HTML structures.
