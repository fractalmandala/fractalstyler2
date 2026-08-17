---
title: Model Context Protocol (MCP) Server
description: How to configure and use the fractalstyler2 MCP server with OpenDesign, Claude Desktop, Cursor, and AI agents.
---

# Model Context Protocol (MCP) Server

`fractalstyler2` includes a built-in Model Context Protocol (MCP) server. It enables AI canvas tools (such as **OpenDesign** and **Pencil**), IDEs (like **Cursor** and **Antigravity**), and agents (**Claude Desktop**) to natively query design tokens, compile fractal mixins to CSS in real-time, snap canvas graphics to tokens, and generate production-ready Svelte 5 + SASS components.

---

## 1. Quickstart

Run the MCP server directly via `npx` or `pnpm dlx`:

```bash
# Using npx
npx fractalstyler2-mcp

# Or via the CLI subcommand
npx fractalstyler2 mcp

# Using pnpm
pnpm dlx fractalstyler2-mcp
```

The server operates over standard I/O (`stdio`) using JSON-RPC.

---

## 2. Configuration for AI Hosts

### OpenDesign / Canvas Tools
Add `fractalstyler2` to your OpenDesign or canvas tool configuration:

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

### Claude Desktop (`claude_desktop_config.json`)
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

### Cursor (`.cursor/mcp.json`)
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

---

## 3. Available MCP Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| **`compile_fractals`** | `sassCode` *(required)*, `className` *(optional)* | Compiles an indented SASS snippet containing fractal mixins (`+surface`, `+stack`, `+gap`, etc.) into live CSS. |
| **`get_design_tokens`** | `category` *(optional: space, typography, radius, shadows, surfaces, ink, breakpoints)* | Returns structured JSON containing all active design tokens (fluid Utopia scales, clamp formulas, pixel approximations). |
| **`snap_to_tokens`** | `gap`, `padding`, `radius`, `fontSize` | Snaps arbitrary pixel measurements from canvas layers to the nearest `fractalstyler2` token, CSS variable, and suggested mixin. |
| **`css_to_fractals`** | `css` *(required)* | Converts raw CSS declarations or Figma inspection properties into an idiomatic SASS mixin recipe. |
| **`generate_component`**| `name` *(required)*, `type` *(card, panel, button, badge, modal, hero, nav)*, `elevation`, `description` | Generates a complete Svelte 5 component (`.svelte`) with runes (`$props`, `$state`) and scoped `<style lang="sass">`. |
| **`validate_recipe`** | `code` *(required)* | Lints SASS or Svelte code against the design system rules (flags legacy v1 classes like `gap8`/`pad16`, hardcoded pixels, modifier classes). |
| **`list_fractals`** | `tier` *(optional: atoms, molecules, layouts)* | Catalogs all available atom and molecule mixins, signatures, and descriptions. |

---

## 4. MCP Resources

The MCP server exposes read-only dynamic resources:

* **`fractalstyler2://tokens`**: Live JSON schema of the fluid space scale, typography, radii, shadows, and color roles.
* **`fractalstyler2://fractals`**: Complete catalog of all atom & molecule mixins.
* **`fractalstyler2://guidelines`**: Design system golden rules and conventions for AI generators.

---

## 5. MCP Prompts

* **`design_system_review`**: Directs the AI to inspect and refactor existing UI code or canvas elements into `fractalstyler2` SASS mixins.
* **`generate_ui`**: Directs the AI to build a full responsive screen using Svelte 5 runes and scoped fractal mixins.

---

## 6. Bundled Schema Export & Auto-Installer

The package bundles all static JSON tool schemas and provides dedicated CLI commands:

```bash
# Automatically install schemas & configure Antigravity and OpenCode:
npx fractalstyler2 mcp:install

# Export raw static JSON schemas to any custom directory:
npx fractalstyler2 mcp:export ./my-agent-mcp-folder
```

