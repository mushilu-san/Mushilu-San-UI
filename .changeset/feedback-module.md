---
"@mushilu-san/ui": minor
---

Add `@mushilu-san/ui/feedback` entry point with five new components:

- **Alert** — inline status banner (`info`/`success`/`warning`/`danger`), dismissible, `role="alert"` / `role="status"` live region, Escape-to-dismiss.
- **Progress** — `linear` and `circular` variants, indeterminate mode (`aria-busy`, no `aria-valuenow`), reduced-motion pulse fallback.
- **Skeleton** — decorative loading placeholder (`text` / `rect` / `circle`), `aria-hidden="true"`, shimmer animation with reduced-motion static fallback.
- **Toast** — notification toasts via `ToastService` (`info`/`success`/`warning`/`danger`); `ToastContainer` hosts polite + assertive live regions; timer pauses on hover/focus; Escape-to-dismiss; six placement variants.
- **Dialog** — native `<dialog>`-based modal; focus trap + focus return; two-way `[(open)]`; `aria-labelledby` from `heading`; backdrop-click and Escape configurable.

All components satisfy WCAG AA (contrast, ARIA roles, keyboard, focus rings, touch targets, reduced motion).
