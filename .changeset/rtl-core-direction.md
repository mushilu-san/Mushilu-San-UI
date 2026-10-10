---
'@mushilu-san/ui': patch
---

Adds RTL foundations: `resolveDirection()`, `Directionality` and `Direction` exports; `handleRovingFocus()` gains an `rtl` flag that swaps ArrowLeft/ArrowRight for horizontal/both orientations; `computePosition()` supports logical `start`/`end` placements with an `{ rtl }` option and returns `resolvedPlacement`. Tabs, Menubar and Dropdown Menu keyboard navigation now respects `dir="rtl"`.
