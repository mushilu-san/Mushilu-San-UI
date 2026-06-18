# @mushilu-san/ui Wiki

Welcome to the **@mushilu-san/ui** wiki — the home for guides, architecture notes, and
contribution docs for the mobile-first, token-themed Angular component library.

> Looking for the published API? Run Storybook locally (see [Getting Started](#getting-started))
> or browse the [README]. This wiki covers the *how* and *why* behind the library.

---

## Project Overview

`@mushilu-san/ui` is a **mobile-first, fully zoneless Angular 22 component library** with
zero runtime dependencies beyond Angular itself. Components ship across **eight
tree-shakable entry points** (primitives, forms, layout, navigation, feedback,
data-display, mobile, overlays) and every component meets a strict accessibility contract
(WCAG AA contrast, full keyboard support, 44px touch targets, reduced-motion).

- **Package:** `@mushilu-san/ui`
- **Selector prefix:** `mui-` (or the `[muiX]` attribute form)
- **Stack:** Angular 22 · zoneless · Vitest · Storybook 10
- **Status:** Pre-1.0 — under active development.

## Getting Started

### Prerequisites

- **Node.js** `^22.12.0 || >=24.0.0` (version pinned in `.nvmrc`; run `nvm use` first)
- **npm** (the project uses npm + `package-lock.json`, not pnpm/yarn)
- An **Angular 22** application as the host project

### Installation

```bash
npm install @mushilu-san/ui
```

Import the design tokens and reset once in your global stylesheet:

```css
@import '@mushilu-san/ui/styles/reset.css';
@import '@mushilu-san/ui/styles/tokens.css';
```

Provide the library config once at bootstrap:

```ts
import { provideMushiluUi } from '@mushilu-san/ui';

bootstrapApplication(App, {
  providers: [provideMushiluUi()],
});
```

Then import components from their group entry point and use them standalone:

```ts
import { Button } from '@mushilu-san/ui/primitives';
```

### Browsing the components

Storybook is not publicly deployed yet. Run it locally to explore every component:

```bash
./dev.sh storybook   # serves at http://localhost:6006
```

## Architecture

- **Entry points** — eight tree-shakable secondary entry points so consumers only bundle
  what they import: `@mushilu-san/ui/primitives`, `/forms`, `/layout`, `/navigation`,
  `/feedback`, `/data-display`, `/mobile`, `/overlays`. The primary `@mushilu-san/ui`
  entry exports `provideMushiluUi()` and shared config.
- **Theming** — components consume only semantic `--mui-*` CSS custom properties (e.g.
  `--mui-color-primary`, `--mui-space-4`, `--mui-radius-md`), never raw palette values.
  Override the tokens in your own stylesheet to re-theme the whole library.
- **Zoneless** — the library runs without `zone.js`; signal writes (`signal`, `computed`,
  `effect`) are the sole change-detection mechanism. No `NgZone`, no `fakeAsync`/`tick`.
- **Accessibility** — every component satisfies a fixed contract: correct ARIA roles,
  full keyboard operability, WCAG AA contrast, visible `:focus-visible` rings, 44px touch
  targets, and `prefers-reduced-motion` handling.
- **Build & publish** — built with **ng-packagr** (one pass per entry point) and released
  to npm via **Changesets** (`npm run changeset` → version PR → publish).

## Contribution Guidelines

This is currently a solo-maintained project. If you'd like to contribute:

1. **Fork & branch** — create a feature branch from `main`.
2. **Set up** — `nvm use && npm install`.
3. **Develop** — follow the per-component checklist (scaffold → a11y → tests → stories → export).
4. **Verify** — run `./scripts/ci-verify.sh` (lint → test → build → storybook) before pushing.
5. **Changeset** — run `npm run changeset` to describe your change.
6. **Open a PR** — ensure CI is green.

## FAQ

**Q: Which Node version do I need?**
A: `^22.12.0 || >=24.0.0`. Use `nvm use` to match `.nvmrc`.

**Q: Do I need `zone.js`?**
A: No — the library is fully zoneless.

**Q: How do I theme components?**
A: Override the `--mui-*` design tokens (e.g. `--mui-color-primary`) in your own global
stylesheet, loaded after `@mushilu-san/ui/styles/tokens.css`.

**Q: Why are there eight import paths?**
A: Components are grouped into tree-shakable entry points so your bundle only includes the
groups you actually import.

**Q: Where do I report a security issue?**
A: Through a private [GitHub Security Advisory](https://github.com/mnmz81/Mushilu-San-UI/security/advisories/new) —
please do **not** open a public issue. See the [Security Policy].

---

[README]: https://github.com/mnmz81/Mushilu-San-UI#readme
[Security Policy]: https://github.com/mnmz81/Mushilu-San-UI/blob/main/.github/SECURITY.md
