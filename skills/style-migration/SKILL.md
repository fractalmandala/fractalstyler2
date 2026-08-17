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
| `gap8`, `gap16`, `gap24` | Dynamic JIT classes removed in v2 | Markup: `.gap-xs`, `.gap-s`, `.gap-m`<br>SASS: `+gap(8)` or `+gap(s)` |
| `pad8`, `pad16`, `pad24` | Dynamic JIT classes removed in v2 | Markup: `.pad-xs`, `.pad-s`, `.pad-m`<br>SASS: `+pad(16)` or `+pad(m)` |
| `<div class="center">` (as reading text column) | In v2, `.center` dead-centers items in a grid | SASS: `.reading-col { +center-column }` |
| `<div class="stack">` | Markup class `.stack` does not exist | SASS: `.container { +stack(s) }` |
| `<div class="cluster">` | Markup class `.cluster` does not exist | SASS: `.tag-row { +cluster(xs) }` |
| `w100`, `h100` | Removed aliases | `.wfull`, `.hfull` |
| `min-w-0`, `min-h-0` | Removed utilities | `.min0` |
| `[data-variant='quiet']` | Renamed on button | `[data-variant='ghost']` |
| `.appshell` | Renamed layout | `.app-shell` |

---

## 2. Refactoring Procedure

1. **Identify the Container**: Is it a card, panel, button, reading column, or grid?
2. **Select the Molecule**:
   - Vertical list of items → `+stack(s)`
   - Tag list / button row → `+cluster(xs)`
   - Box with border/radius/padding → `+surface(surface, s, 12)`
   - Full height hero → `+cover(80vh, xl)`
3. **Strip Utility Soup from Markup**: Replace long class strings (`class="box pad16 gap12 w100 min-w-0 radius12 border"`) with a single semantic class (`class="card"` or `class="feed-item"`).
4. **Move Decisions to `<style lang="sass">`**:
   ```sass
   @use '$lib/styles/fractals' as *

   .feed-item
     +surface(surface, s, 12)
     +stack(s)
   ```
5. **Verify**: Use the MCP tool `validate_recipe` or `npx sass src/lib/styles/index.sass /tmp/check.css`.
