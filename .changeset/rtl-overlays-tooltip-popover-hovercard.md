---
"@mushilu-san/ui": patch
---

RTL support for Tooltip, Popover and HoverCard: the Tooltip overlay (appended to `<body>`) now carries its trigger's `dir` and resolves logical `start`/`end` placements via `computePosition({ rtl })`; Popover and HoverCard accept logical `start`/`end` placements, and their `*-start`/`*-end` placements now use `inset-inline-start`/`inset-inline-end` so they flip in right-to-left layouts (LTR unchanged).
