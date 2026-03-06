# Character Generator - Copilot Instructions

## Scope
These instructions apply to all files in this workspace.

## Core Architecture Principle
- Keep the character generator as an abstract, RPG-agnostic shell.
- Implement RPG-specific behavior through configuration in `definitions.js` and `layout.js`, not through hardcoded rules in `app.js`, `index.html`, or `style.css`.
- Prefer extending generic render/state/calculation helpers over adding one-off logic for a single game system.
- New RPG support should be possible by swapping config content with minimal or no runtime code changes.

## Project Structure
- `index.html`: Single-page shell. Keep script order: `definitions.js`, `layout.js`, `js-yaml` CDN, then `app.js`.
- `definitions.js`: Contains `defText` as YAML-in-JS string for game data, formulas, sections, groups, and defaults.
- `layout.js`: Contains `layText` as YAML-in-JS string for page layout, table columns, visibility, and print/page rules.
- `app.js`: Main runtime logic (state, YAML parsing, normalization, rendering, recalc, save/load, visibility updates).
- `style.css`: All visual styles (screen + print). Keep print rules in the `@media print` block.

## Coding Style
- Use plain vanilla JavaScript, HTML, and CSS only. Do not add frameworks, TypeScript, build tools, or module bundlers.
- Keep functions small and focused. Reuse existing helpers (`parseNum`, `get`, key generation helpers) instead of duplicating logic.
- Prefer explicit, readable code over clever abstractions.
- Keep naming consistent with existing code (`snake_case` IDs from YAML, camelCase JS variables/functions).
- Preserve existing data contracts between YAML strings and runtime code.
- Avoid embedding game- or lore-specific terms in runtime logic; keep domain-specific naming in configuration labels/IDs.

## Data and Configuration Conventions
- Treat `definitions.js` and `layout.js` as source-of-truth config files represented as YAML text strings.
- Keep section/group/item IDs stable. Avoid renaming IDs unless all references are updated.
- When adding new fields/items in YAML, ensure matching key handling exists in `app.js` state initialization and rendering.
- For visibility rules, follow existing operator names and semantics (`equals`, `not_equals`, `in`, `has_value`, numeric comparisons).
- Keep formulas backward compatible. If adding a new formula ID, add handling in `total()` and safe fallback behavior.
- Any new mechanic should first be modeled as data (formula IDs, fields, sections, visibility rules) before changing runtime code.

## UI and Rendering Rules
- Keep the app fully client-side and offline-capable except for the existing js-yaml CDN include.
- Preserve layout-driven rendering: UI structure should come from `layout.js` and definitions from `definitions.js`.
- Do not hardcode section-specific behavior in many places; centralize in helpers where possible.
- Keep AP/stat calculations and visible counters synchronized after every relevant input change.
- UI components should remain generic enough to render equivalent concepts for different RPG systems (attributes, skills, resources, spells, etc.) from config alone.

## CSS and Print Rules
- Keep existing CSS variable usage under `:root`.
- Preserve compact print output and page break classes (`print-page-break-before`, `print-page-break-after`).
- Avoid broad CSS changes that can regress dense table layouts.
- Ensure desktop and mobile behavior remains usable when changing layout styles.

## Change Safety Checklist
Before finalizing changes:
- Verify app initializes without console errors.
- Verify inputs update totals/counters as expected.
- Verify visibility-driven sections show/hide correctly.
- Verify print mode still hides toolbar and keeps compact layout.
- If touching YAML IDs or keys, verify save/load compatibility for existing `.sav/.yaml/.yml` files.
- Confirm the change does not couple runtime logic to a single RPG setting and remains reusable for alternative configs.

## Preferred Response Behavior
- When implementing changes, reference the exact file(s) to edit and keep changes minimal.
- If a request conflicts with current architecture, prefer adapting within current patterns over introducing new architecture.
- For large refactors, suggest incremental steps and preserve current functionality first.
