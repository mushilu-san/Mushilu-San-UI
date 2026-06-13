# @mushilu-san/ui

## 0.2.0

### Minor Changes

- a0252d7: Add `@mushilu-san/ui/data-display` entry point with four new components:
  - **Card** — content container with `flat` / `elevated` / `outlined` variants; optional `clickable` mode adds `role="button"`, `tabindex`, and keyboard activation (Enter/Space).
  - **Accordion** — compound widget (`AccordionGroup` + `AccordionItem`); single or multiple open mode; full keyboard support (Arrow keys, Home, End); each panel has `role="region"` with `aria-labelledby`.
  - **Table** — data-driven sortable table; `caption` provides the accessible region name; per-column `sortable` flag cycles `asc → desc → none`; emits `sortChange`; sticky-header option.
  - **Tooltip** — attribute component `[muiTooltip]` appended to `document.body`; shows on hover and focus; `aria-describedby` wired automatically; Escape dismisses; four placement options.

  All components satisfy WCAG AA (contrast, ARIA roles, keyboard, focus rings, touch targets, reduced motion).

- e081e6e: Add `@mushilu-san/ui/feedback` entry point with five new components:
  - **Alert** — inline status banner (`info`/`success`/`warning`/`danger`), dismissible, `role="alert"` / `role="status"` live region, Escape-to-dismiss.
  - **Progress** — `linear` and `circular` variants, indeterminate mode (`aria-busy`, no `aria-valuenow`), reduced-motion pulse fallback.
  - **Skeleton** — decorative loading placeholder (`text` / `rect` / `circle`), `aria-hidden="true"`, shimmer animation with reduced-motion static fallback.
  - **Toast** — notification toasts via `ToastService` (`info`/`success`/`warning`/`danger`); `ToastContainer` hosts polite + assertive live regions; timer pauses on hover/focus; Escape-to-dismiss; six placement variants.
  - **Dialog** — native `<dialog>`-based modal; focus trap + focus return; two-way `[(open)]`; `aria-labelledby` from `heading`; backdrop-click and Escape configurable.

  All components satisfy WCAG AA (contrast, ARIA roles, keyboard, focus rings, touch targets, reduced motion).

### Patch Changes

- e280b24: Accessibility & UX polish across primitives, forms, and navigation: button/ghost/destructive/secondary `:active` states, `aria-busy`-driven loading, `touch-action: manipulation` and tap-highlight resets on form controls, dark-mode select arrow contrast, Avatar `aria-label` fallback to `name`, vertical Tab active indicator, and reduced-motion spinner fallbacks (pulse instead of freeze). Fixes Badge danger-variant text contrast to meet WCAG AA on its subtle background.
