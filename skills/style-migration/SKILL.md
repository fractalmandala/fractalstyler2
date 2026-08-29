---
name: style-migration
description: Migrate legacy CSS, Tailwind utilities, or fractals-styler (v1) classes into modern fractalstyler2 SASS mixin recipes and token scales. Use when refactoring stylesheets, updating legacy components, or cleaning up utility class soup.
---

# Style Migration & Refactoring Skill

This skill guides the refactoring and migration of existing styles into idiomatic `fractalstyler2`.

---

## 1. Quick Replacement Matrix

| Legacy Pattern | Problem | fractalstyler2 Replacement |
| :--- | :--- | :--- |
| `gap8`, `gap16`, `gap24` | Dynamic JIT classes removed in v2 | Markup: `.gap-xs`, `.gap-sm`, `.gap-md`, or literal `.gap-8`<br>SASS: `+gap(sm)` |
| `pad8`, `pad16`, `pad24` | Dynamic JIT classes removed in v2 | Markup: `.pad-xs`, `.pad-sm`, `.pad-md`, or literal `.pad-16`<br>SASS: `+pad(md)` |
| `<div class="center">` (as reading text column) | In v2, `.center` dead-centers items in a grid | SASS: `.reading-col { +center-column }` |
| `<div class="stack">` | Deprecated alias (dies at v2) | Keep for now, or SASS: `.container { +stack(sm) }` |
| `<div class="cluster">` | Deprecated alias (dies at v2) | Keep for now, or SASS: `.tag-row { +cluster(xs) }` |
| `w100`, `h100` | Removed aliases | `.wfull`, `.hfull` |
| `min-w-0`, `min-h-0` | Removed utilities | `.min0` |
| `[data-variant='quiet']` | Variants are classes in registry v1 | `class="button ghost"` |
| `.appshell` | Renamed layout | `.app-shell` |

---

## 2. Refactoring Procedure

1. **Identify the Container**: Is it a card, panel, button, reading column, or grid?
2. **Select the Molecule**:
   - Vertical list of items → `+stack(sm)`
   - Tag list / button row → `+cluster(xs)`
   - Box with border/radius/padding → `+surface(surface, sm, 12)`
   - Full height hero → `+cover(80vh, xl)`
3. **Strip Utility Soup from Markup**: Replace long class strings (`class="box pad16 gap12 w100 min-w-0 radius12 border"`) with a single semantic class (`class="card"` or `class="feed-item"`).
4. **Move Decisions to `<style lang="sass">`**:
   ```sass
   @use '$lib/styles/fractals' as *

   .feed-item
     +surface(surface, sm, 12)
     +stack(sm)
   ```
5. **Verify**: Use the MCP tool `validate_recipe` or `npx sass src/lib/styles/index.sass /tmp/check.css`.
