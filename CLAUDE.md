# Mushilu-San-UI — Claude Context

## Project overview

Angular 21 component library published to npm as `@mushilu-san/ui`.  
Mobile-first, token-themed, zero runtime dependencies beyond Angular itself.

## Key facts Claude must know

- **Node version required:** 22.x (≥22.12). Node 20.16 ships on this machine — always activate nvm first.
- **Angular CLI:** not installed globally at v21; use `npx @angular/cli@21` or the local `node_modules/.bin/ng`.
- **Package manager:** npm (not pnpm, despite plan references to `pnpm changeset` — use `npm run changeset`).
- **Component prefix:** `mui-` — all selectors start with `mui-` or use `[muiX]` attribute form.
- **No zone.js** — library is fully zoneless. Never import `fakeAsync`/`tick` in tests.
- **Storybook version:** 10.4.2 (at `projects/ui/.storybook/`). Config is NOT at workspace root.

## Activating the correct Node version

Every shell command that runs Angular/npm/npx must be prefixed with nvm activation:

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
```

Or use the `./dev.sh` helper — it does this automatically.

## Common commands

```bash
# Build the library (all 8 entry points)
./dev.sh build

# Run all tests with coverage
./dev.sh test

# Start Storybook dev server (port 6006)
./dev.sh storybook

# Build Storybook static output
./dev.sh storybook:build

# Add a changeset before merging a PR
./dev.sh changeset

# Bump versions + update CHANGELOG
./dev.sh version-packages

# Publish to npm (build + changeset publish)
./dev.sh release
```

## Directory map

```
projects/ui/
├── src/
│   ├── styles/           tokens.css + reset.css (shipped in dist/ui/styles/)
│   ├── core/
│   │   ├── a11y/         IdGenerator, LiveAnnouncer (internal)
│   │   ├── tokens/       provideMushiluUi(), MUSHILU_UI_CONFIG token
│   │   └── testing/      renderComponent(), renderTemplate() — also published as /testing entry
│   ├── lib/
│   │   ├── primitives/src/   Button (done) | Icon Badge Spinner Divider Avatar (planned)
│   │   ├── forms/src/        (planned)
│   │   ├── layout/src/       (planned)
│   │   ├── navigation/src/   (planned)
│   │   ├── feedback/src/     (planned)
│   │   ├── data-display/src/ (planned)
│   │   └── mobile/src/       (planned)
│   └── public-api.ts     PRIMARY entry — exports only provideMushiluUi()
├── primitives/ng-package.json   → @mushilu-san/ui/primitives
├── forms/ng-package.json        → @mushilu-san/ui/forms
├── layout/ng-package.json       → @mushilu-san/ui/layout
├── navigation/ng-package.json   → @mushilu-san/ui/navigation
├── feedback/ng-package.json     → @mushilu-san/ui/feedback
├── data-display/ng-package.json → @mushilu-san/ui/data-display
├── mobile/ng-package.json       → @mushilu-san/ui/mobile
├── .storybook/           main.ts, preview.ts, preview-head.html
├── docs/                 MDX group pages
└── tsconfig.spec.json    types: vitest/globals + @testing-library/jest-dom
```

## Per-component checklist (§4 of the plan)

1. Scaffold: `mui-` selector, `OnPush`, standalone, `.ts/.html/.css/.types.ts`
2. Signal inputs via `input()` / `input.required()` with `booleanAttribute`/`numberAttribute` transforms
3. Signal outputs via `output()`, two-way state via `model()`
4. CVA (forms only): `ControlValueAccessor` + `NG_VALUE_ACCESSOR` provider
5. A11y: correct role, aria-*, keyboard (Tab/Enter/Esc/Arrows), 44px touch target
6. Security: no `[innerHTML]`, no `bypassSecurityTrust*`
7. Styling: semantic `--mui-*` tokens only, `:host`-scoped, `part` attributes exposed
8. Tests: all cases passing, ≥80% coverage
9. Stories: Default, variants, Interactive, Accessibility, MobilePreview
10. MDX: add to group docs file
11. Export from group `public-api.ts`
12. Bundle check: < 5KB gzipped per component

## Known issues & workarounds

### 1. `@HostListener` `$event` type narrowing (TS strict mode)
Angular types `$event` from `@HostListener` as `Event`, not the more specific subtype.
**Fix:** accept `Event` as parameter, cast inside: `event as MouseEvent`.

### 2. Attribute-selector components in tests (e.g. `button[muiButton]`)
`renderComponent(Button)` wraps the component in a generic `<div>` host, losing the native
`button` role. `screen.getByRole('button')` will find nothing.
**Fix:** always use `renderTemplate('<button muiButton>…</button>', { imports: [Button] })` for
attribute-selector components.

### 3. `disabled` / `loading` buttons have `pointer-events: none`
`userEvent.click()` throws `pointer-events: none` error when clicking disabled/loading buttons.
**Fix:** use `fireEvent.click(element)` for tests asserting that a click is blocked — `fireEvent`
bypasses CSS; `userEvent` respects it.

### 4. Secondary entry point `ng-package.json` location
`ng-packagr` discovers secondary entries from direct subdirectories of `projects/ui/`.
DO NOT put `ng-package.json` inside `src/lib/<group>/` — it produces the wrong entry name.
Correct locations: `projects/ui/<group>/ng-package.json` with entryFile pointing back into `src/lib/`.

### 5. Empty stub entry points
Each group's `public-api.ts` must contain at least `export {};` — a comment-only file causes
ng-packagr to fail with `Internal error: failed to get symbol for entrypoint`.

### 6. `thresholds` is not a valid `@angular/build:unit-test` option
Coverage thresholds go in a separate `vitest.config.ts` or are enforced externally. Putting
`thresholds` in `angular.json` causes schema validation failure.

### 7. `test-setup.ts` TypeScript warning
Include `src/test-setup.ts` in `tsconfig.spec.json`'s `include` array to suppress the
`File not found in TypeScript compilation` warning.

### 8. Node version
Angular 21 requires Node ≥ 20.19 or ≥ 22.12. The machine has Node 20.16 as default.
nvm must be sourced and `nvm use 22` called before any Angular command.

## Adding a new component — quick recipe

```bash
# 1. Create files (example: Badge in primitives group)
mkdir -p projects/ui/src/lib/primitives/src/badge

# 2. Create: badge.types.ts, badge.ts, badge.html, badge.css, badge.spec.ts, badge.stories.ts

# 3. Export from the group barrel
echo "export { Badge } from './badge/badge';" >> projects/ui/src/lib/primitives/src/public-api.ts

# 4. Build & test
./dev.sh build
./dev.sh test

# 5. Verify Storybook
./dev.sh storybook
```

## Design tokens reference

All components consume `--mui-*` semantic tokens — never raw palette tokens.

| Category  | Key tokens |
|-----------|-----------|
| Color     | `--mui-color-primary`, `--mui-color-danger`, `--mui-color-text`, `--mui-color-surface`, `--mui-color-border` |
| Spacing   | `--mui-space-1` (4px) … `--mui-space-12` (48px) |
| Type      | `--mui-font-size-base` (16px), `--mui-font-weight-medium` |
| Radius    | `--mui-radius-sm` (4px), `--mui-radius-md` (8px), `--mui-radius-full` |
| Shadow    | `--mui-shadow-1` … `--mui-shadow-5` |
| Z-index   | `--mui-z-sticky:100`, `--mui-z-modal:300`, `--mui-z-toast:400` |
| Touch     | `--mui-touch-target: 44px` — enforce on all interactive elements |
| Focus     | `--mui-color-focus-ring`, `--mui-focus-ring-width`, `--mui-focus-ring-offset` |

## Testing patterns

```typescript
// Attribute-selector component (button[muiButton], etc.)
await renderTemplate('<button muiButton variant="secondary">Btn</button>', {
  imports: [Button],
});

// Element-selector component (mui-badge, etc.)
await renderComponent(Badge, {
  inputs: { variant: 'success', label: 'New' },
});

// Output testing
await renderTemplate('<button muiButton (clicked)="handler($event)">Btn</button>', {
  imports: [Button],
  componentProperties: { handler: vi.fn() },
});

// Blocked-click testing (pointer-events: none elements)
fireEvent.click(screen.getByRole('button'));   // not userEvent.click()
```

## Publishing checklist

1. `./dev.sh test` — all green
2. `./dev.sh build` — dist/ clean
3. `npm run changeset` — describe changes
4. Push PR → merge → Changesets bot opens "Version Packages" PR
5. Merge version PR → `changesets/action` publishes to npm automatically
