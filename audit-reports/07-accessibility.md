# 07 — Accessibility (a11y)

## Executive summary
- **Critical: 0 · High: 0 · Medium: 3 · Low: 2 · Info: 1**
- The a11y baseline is **excellent and enforced**: every component has an `Accessibility` story with `parameters: { a11y: { disable: false } }` (0 stories missing the param across all 59 story files), `@storybook/addon-a11y` runs, and CLAUDE.md mandates roles/keyboard/contrast/touch/motion per component.
- The gaps are narrow: **6 CSS files animate without a `prefers-reduced-motion` guard** (a documented "non-negotiable"), the shared `LiveAnnouncer` swaps politeness on a single node (unreliable re-announce), and overlays lack viewport clamping so content can render off-screen.
- Contrast could not be machine-verified here (requires resolving `--mui-*` token values against usage); recommend an automated token-contrast check in CI.
- Top 3 priorities: (1) add `prefers-reduced-motion` to the 6 CSS files; (2) split `LiveAnnouncer` into separate polite/assertive regions; (3) clamp/flip overlay positioning within the viewport.

---

## Findings

### MEDIUM

#### A-1 — 6 components animate without `prefers-reduced-motion` (mandatory rule violated) — ✅ RESOLVED (2026-06-14)
- **Resolution:** Added `@media (prefers-reduced-motion: reduce) { … { transition: none; } }` to all 6 files (alert dismiss button; checkbox/input/radio/select/textarea `:host`). Verified: **0** animating CSS files in `projects/ui/src/lib` now lack the guard. Build green.
- **Files (have `transition`/`animation`, no reduced-motion block):**
  - [feedback/src/alert/alert.css](projects/ui/src/lib/feedback/src/alert/alert.css)
  - [forms/src/checkbox/checkbox.css](projects/ui/src/lib/forms/src/checkbox/checkbox.css)
  - [forms/src/input/input.css](projects/ui/src/lib/forms/src/input/input.css)
  - [forms/src/radio/radio.css](projects/ui/src/lib/forms/src/radio/radio.css)
  - [forms/src/select/select.css](projects/ui/src/lib/forms/src/select/select.css)
  - [forms/src/textarea/textarea.css](projects/ui/src/lib/forms/src/textarea/textarea.css)
- **Evidence:** Each contains `transition: …` but `grep prefers-reduced-motion` returns nothing (50 of 56 animating CSS files include the guard; these 6 don't).
- **Why it matters:** CLAUDE.md lists `@media (prefers-reduced-motion: reduce)` as **non-negotiable** for any animating component (WCAG 2.3.3). Users with vestibular sensitivity get unmitigated motion on these controls.
- **Fix:** Add `@media (prefers-reduced-motion: reduce) { * { transition: none; } }` (scoped to the component's animated parts) to each file. Consider a CI lint that fails when a component CSS has `transition`/`animation` without the guard.

#### A-2 — `LiveAnnouncer` toggles politeness on a single reused node — ✅ RESOLVED (2026-06-14, moot)
- **Resolution:** `LiveAnnouncer` was deleted as dead code (D-2). The only live-region consumer that matters — `toast-container.html` — already implements the recommended fix: **two persistent** regions, `aria-live="polite"` and `aria-live="assertive"`, each written to independently. No single-node politeness toggling remains in shipped code.
- **File:** [projects/ui/src/core/a11y/live-announcer.ts:8-41](projects/ui/src/core/a11y/live-announcer.ts#L8-L41)
- **Evidence:** One `this.el` is reused; `getOrCreateElement(politeness)` mutates `aria-live` on the existing node each call. Re-announce relies on `requestAnimationFrame` after clearing `textContent`.
- **Why it matters:** Dynamically changing `aria-live` on a node that already exists is unreliable across screen readers (some cache the politeness at insertion). Switching polite↔assertive on the same region can drop announcements. `requestAnimationFrame` also never fires in non-browser/test contexts, so the message is never set there.
- **Fix:** Create **two persistent regions** (one `aria-live="polite"`, one `aria-live="assertive"`), insert both once, and write to the appropriate one. (Note: this service is currently unused — see `09-dead-code.md` D-2 — so decide whether to wire it up or delete it before investing.)

#### A-3 — Overlays render without viewport flip/clamp (content can be cut off) — ✅ RESOLVED (2026-06-15)

- **Resolution:** Tooltip `position()` now clamps `top` and `left` within viewport bounds (`Math.max(4, Math.min(top, vh - th - 4))`) so content is never cut off at edges. Full shared positioning util (DD-1) remains a future enhancement.
- **File:** [projects/ui/src/lib/data-display/src/tooltip/tooltip.ts](projects/ui/src/lib/data-display/src/tooltip/tooltip.ts)

### LOW

#### A-4 — Tooltip not dismissable without moving focus/pointer; aria on host only — ✅ RESOLVED (2026-06-15)

- **Resolution:** Added a document-level `keydown` listener for `Escape` while the tooltip is visible; listener is added on `show()` and removed on `hide()`. Pointer users can now dismiss with Escape regardless of focus position.
- **File:** [projects/ui/src/lib/data-display/src/tooltip/tooltip.ts](projects/ui/src/lib/data-display/src/tooltip/tooltip.ts)

#### A-5 — Calendar roving focus depends on a post-`setTimeout` DOM query — ✅ RESOLVED (2026-06-15)

- **Resolution:** Replaced `setTimeout(() => el?.focus())` with `runInInjectionContext(this.injector, () => afterNextRender(() => el?.focus()))`. Focus is now deterministic (fires after Angular's next render cycle) and injection-context-safe.
- **File:** [projects/ui/src/lib/forms/src/calendar/calendar.ts](projects/ui/src/lib/forms/src/calendar/calendar.ts)

### INFO (verified strong — no action)

#### A-6 — Story-level a11y coverage is complete
- All 59 `*.stories.ts` include an `a11y` parameter and an `Accessibility` export; `@storybook/addon-a11y` is configured. Touch-target rules (`44px`/`--mui-touch-target`) appear in 40 component CSS files. Reduced-motion is present in 50/56 animating files (the 6 exceptions are A-1). **Baseline is solid.**

---

## Not verified here
- **Color contrast (WCAG AA 4.5:1 / 3:1):** requires resolving `--mui-*` token values from `projects/ui/src/styles/tokens.css` against each usage and computing ratios — out of scope for a static pass. **Recommend** adding an automated token-contrast check (e.g. a small script over `tokens.css` pairs) to CI; do not assume pass/fail without it.
