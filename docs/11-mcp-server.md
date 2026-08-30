---
id: 11-mcp-server
title: Model Context Protocol (MCP) Server
type: design
tags: [mcp, tools, ai-agents, compilation, token-snapping, linting]
summary: Reference guide for the Fractalstyler2 Model Context Protocol server, covering tool schemas, compilation, snapping, and IDE agent configuration.
updated: 2026-08-30
---

# Model Context Protocol (MCP) Server

Fractalstyler2 includes a high-performance **Model Context Protocol (MCP)** server (`fractalstyler2-mcp`). The MCP server equips AI coding agents (such as Claude Code, Codex, Gemini Antigravity, and OpenCode) to query design tokens, compile indented SASS on the fly, snap raw pixel designs to token scales, and validate code against the design contract.

---

## 1. Available MCP Tools

### `compile_fractals`
Compiles an indented SASS snippet using Fractalstyler2 mixins and tokens into valid, clean CSS:

```json
{
  "sassCode": "+card(surface, sm, 8)\n+stack(xs)\n.title\n  +type(lg)\n  +ink(primary)",
  "className": "project-card"
}
```

### `get_design_tokens`
Returns structured JSON definitions for all token scales. Supports category filtering (`all`, `space`, `typography`, `radius`, `shadows`, `surfaces`, `ink`, `breakpoints`):

```json
{
  "category": "space"
}
```

### `snap_to_tokens`
Takes arbitrary pixel values (e.g. from Figma or screenshot inspection) and calculates the closest matching token steps and difference errors:

```json
{
  "gap": 15,
  "padding": 26,
  "fontSize": 19,
  "radius": 5
}
```
**Output**:
- `gap`: `15px` $\rightarrow$ `--space-xs` (14–15px)
- `padding`: `26px` $\rightarrow$ `--space-md` (27–30px)
- `fontSize`: `19px` $\rightarrow$ `--text-md` (18–20px)
- `radius`: `5px` $\rightarrow$ `6px` (`.radius-6`)

### `css_to_fractals`
Converts raw CSS declarations into idiomatic Fractalstyler2 markup classes or indented SASS mixins:

```json
{
  "css": "display: flex; flex-direction: column; gap: 16px; padding: 24px; border-radius: 8px; background-color: #141824;"
}
```
**Output**: `class="box gap-sm pad-md radius-8 surface border"`

### `generate_component`
Generates boilerplate Svelte components or SASS blocks using canonical markups:

```json
{
  "type": "card",
  "name": "TelemetryCard",
  "framework": "svelte"
}
```

### `validate_recipe`
Scans a code snippet for design system violations (such as hardcoded hex colors, missing token variables, or arbitrary pixel gaps) and suggests token-compliant replacements.

### `list_fractals`
Returns the complete registry of available fractals, mixins, containers, layouts, and shell classes with usage signatures.

---

## 2. Server Configuration

### Claude Code / Claude Desktop
Add to your `claude_desktop_config.json`:

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

### Gemini / Antigravity IDE
Add to `mcp.json` or run the setup command:

```json
{
  "mcpServers": {
    "fractalstyler2": {
      "command": "node",
      "args": ["/Users/amrit/fractalmandala/fractalstyler2/dist/mcp/server.js"]
    }
  }
}
```

### OpenCode
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

---

## Next Steps

- Learn about agent integration and skills in [12-agent-plugin.md](./12-agent-plugin.md).
- Review [08-shells-and-markups.md](./08-shells-and-markups.md) for canonical HTML structures.
