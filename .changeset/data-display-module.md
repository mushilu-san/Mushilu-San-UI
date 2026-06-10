---
"@mushilu-san/ui": minor
---

Add `@mushilu-san/ui/data-display` entry point with four new components:

- **Card** — content container with `flat` / `elevated` / `outlined` variants; optional `clickable` mode adds `role="button"`, `tabindex`, and keyboard activation (Enter/Space).
- **Accordion** — compound widget (`AccordionGroup` + `AccordionItem`); single or multiple open mode; full keyboard support (Arrow keys, Home, End); each panel has `role="region"` with `aria-labelledby`.
- **Table** — data-driven sortable table; `caption` provides the accessible region name; per-column `sortable` flag cycles `asc → desc → none`; emits `sortChange`; sticky-header option.
- **Tooltip** — attribute component `[muiTooltip]` appended to `document.body`; shows on hover and focus; `aria-describedby` wired automatically; Escape dismisses; four placement options.

All components satisfy WCAG AA (contrast, ARIA roles, keyboard, focus rings, touch targets, reduced motion).
