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

## Dependency & lockfile rules (MANDATORY — CI broke repeatedly because of this)

CI failed for days in June 2026 because `package-lock.json` drifted out of sync with
`package.json` and local Node didn't match CI. These rules are non-negotiable:

1. **Any change to `package.json`** (deps, devDeps, `workspaces`, anything) MUST be followed
   in the SAME commit by a lockfile regen:
   ```bash
   nvm use && npm install
   git add package.json package-lock.json   # always commit both together
   ```
   This includes "metadata-only" changes like `workspaces` — they change npm resolution.
2. **Node version comes from `.nvmrc` only.** Never hardcode a Node version in workflows
   (`node-version-file: '.nvmrc'`), scripts, or docs. To upgrade Node: change `.nvmrc`,
   regenerate the lockfile under that version, test, commit all together.
3. **Never run `npm install` with the wrong Node.** `.npmrc` has `engine-strict=true` and
   `package.json` has an `engines` field — if install errors with EBADENGINE, run `nvm use`,
   do NOT bypass with `--force` / removing the engines field.
4. **Never replace `npm ci` with `npm install` in workflows.** `npm ci` failing with EUSAGE
   means the lockfile is stale — fix it locally per rule 1, never paper over it in CI.
5. **Before every push:** run `./scripts/ci-verify.sh` — it mirrors `.github/workflows/ci.yml`
   exactly (npm ci → lint → test → build → storybook). If it's green locally, CI is green.
6. **GitHub Actions are pinned by commit SHA** with a `# vX.Y.Z` comment. When bumping,
   update both SHA and comment; pick releases that run on the current runner Node (≥24).

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
│   │   ├── primitives/src/   Button, Icon, Badge, Spinner, Divider, Avatar (done)
│   │   ├── forms/src/        Checkbox, Input, Radio, Select, Textarea, Toggle, Label, FormField, Slider, InputOtp, DatePicker, Calendar, InputGroup, ToggleGroup (done)
│   │   ├── layout/src/       Container, Stack, Grid, Spacer, ScrollArea, Resizable, AspectRatio, Sidebar (done)
│   │   ├── navigation/src/   Breadcrumb, Tabs (TabList/Tab/TabPanel), Pagination, NavLink, NavigationMenu, Menubar (done)
│   │   ├── feedback/src/     Alert, Progress, Skeleton, Toast (+ ToastService/ToastContainer), Dialog, AlertDialog, Sheet (done)
│   │   ├── data-display/src/ Card, Table, Accordion, Tooltip, Carousel, Chart, Empty, Typography (done)
│   │   ├── mobile/src/       BottomSheet, FAB, SwipeAction, MobileNav (done)
│   │   └── overlays/src/     Popover, Dropdown Menu, Context Menu, Hover Card, Command, Combobox (done)
│   └── public-api.ts     PRIMARY entry — exports only provideMushiluUi()
├── primitives/ng-package.json   → @mushilu-san/ui/primitives
├── forms/ng-package.json        → @mushilu-san/ui/forms
├── layout/ng-package.json       → @mushilu-san/ui/layout
├── navigation/ng-package.json   → @mushilu-san/ui/navigation
├── feedback/ng-package.json     → @mushilu-san/ui/feedback
├── data-display/ng-package.json → @mushilu-san/ui/data-display
├── mobile/ng-package.json       → @mushilu-san/ui/mobile
├── overlays/ng-package.json     → @mushilu-san/ui/overlays
├── .storybook/           main.ts, preview.ts, preview-head.html
├── docs/                 MDX group pages
└── tsconfig.spec.json    types: vitest/globals + @testing-library/jest-dom
```

## Accessibility requirements (mandatory for every component)

Every component MUST satisfy all of the following before it can be considered done.
These are non-negotiable — no exceptions.

### ARIA & roles
- Use the correct ARIA role (prefer native HTML elements that carry implicit roles).
- Interactive elements: set `aria-disabled` (not the HTML `disabled` attribute, which removes keyboard access).
- Loading / busy states: set `aria-busy="true"` on the host.
- Decorative-only children (icons, spinners): set `aria-hidden="true"`.
- Meaningful standalone icons or images: require a `label` input that maps to `aria-label` + `role="img"`.
- Dynamic status updates: use `role="status"` or `aria-live="polite"` where appropriate.

### Keyboard
- All interactive components must be fully operable by keyboard alone.
- `Tab` / `Shift+Tab` — navigates to/from the component.
- `Enter` / `Space` — activates buttons and button-like controls.
- `Escape` — closes overlays, cancels edits.
- Arrow keys — navigates within compound widgets (menus, tabs, sliders, etc.).
- Never remove focus from a disabled element without setting `tabindex="-1"`.

### Color contrast (WCAG AA — non-negotiable)
- Normal text (< 18pt / < 14pt bold): **4.5:1 minimum** against its background.
- Large text (≥ 18pt / ≥ 14pt bold): **3:1 minimum**.
- UI component boundaries (focus rings, input borders): **3:1 minimum**.
- Disabled / inactive elements: no contrast requirement (WCAG 1.4.3 exception).
- Verify contrast using the actual `--mui-*` token values, not just the token name.
- Do NOT rely on `opacity` alone to communicate disabled state (opacity degrades contrast).

### Focus visibility
- Visible focus ring on every interactive element via `:focus-visible`.
- Focus ring must meet 3:1 contrast against adjacent colors.
- Never use `outline: none` or `outline: 0` without a custom replacement focus indicator.

### Touch targets
- Every interactive element: `min-height: 44px` AND `min-width: 44px` (WCAG 2.5.5).

### Motion
- Every component that animates MUST include `@media (prefers-reduced-motion: reduce)` to stop or minimise motion.

### Stories requirement
- Every component **must** have an `Accessibility` story that demonstrates correct ARIA usage, and the story must have `parameters: { a11y: { disable: false } }`.

---

## Per-component checklist (§4 of the plan)

1. Scaffold: `mui-` selector, `OnPush`, standalone, `.ts/.html/.css/.types.ts`
2. Signal inputs via `input()` / `input.required()` with `booleanAttribute`/`numberAttribute` transforms
3. Signal outputs via `output()`, two-way state via `model()`
4. CVA (forms only): `ControlValueAccessor` + `NG_VALUE_ACCESSOR` provider
5. A11y: satisfies every rule in the **Accessibility requirements** section above
6. Security: no `[innerHTML]`, no `bypassSecurityTrust*`
7. Styling: semantic `--mui-*` tokens only, `:host`-scoped, `part` attributes exposed
8. Tests: all cases passing, ≥80% coverage — including at least one test per ARIA behaviour
9. Stories: Default, variants, Interactive, Accessibility, MobilePreview
10. MDX: add to group docs file
11. Export from group `public-api.ts`
12. Bundle check: `npm run size` (size-limit). Budgets are enforced **per entry-point group**
    (each group bundles many components), not per individual component, with framework peer deps
    excluded via `ignore`. Per-group limits live in `package.json` `"size-limit"` (currently
    7–12 KB depending on group); keep additions within the group's headroom.

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

### 9. Secondary entry points cannot relative-import `core/*`
Shipped code in a secondary entry (e.g. `lib/feedback/`) must NOT reach into the shared
`src/core/` tree with a relative path like `../../../../core/a11y/live-announcer`. `core/` belongs
to the PRIMARY entry point, so ng-packagr fails with the cryptic
`Cannot destructure property 'pos' of 'file.referencedFiles[index]' as it is undefined`.
**Fix:** keep cross-cutting helpers inside the component (e.g. generate ARIA ids with a local
module counter), make the host component the live region instead of injecting `LiveAnnouncer`, or
— if the helper truly must be shared — export it from the primary `public-api.ts` and import it via
the `@mushilu-san/ui` package path. Relative `../../../../core/testing` is fine in `*.spec.ts` only
(specs aren't part of the published build).

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

## Component backlog — shadcn/ui parity gaps

All planned components are now built. Tables below record where each landed.

### Group: overlays (`@mushilu-san/ui/overlays`)
Entry point exists and ships. All share a floating-panel primitive (Popover); the rest compose on top of it.

| Component | shadcn equivalent | Status / Notes |
|-----------|-------------------|----------------|
| Popover | Popover | **done** — floating panel anchored to a trigger; foundation for the group |
| Dropdown Menu | Dropdown Menu | **done** — Popover + keyboard-navigable menu list |
| Context Menu | Context Menu | **done** — opened on right-click / long-press |
| Hover Card | Hover Card | **done** — Popover opened on hover/focus with a delay |
| Command | Command | **done** — searchable command palette (input + filtered list) |
| Combobox | Combobox | **done** — Input + Dropdown with search/filter (builds on Command) |
| Alert Dialog | Alert Dialog | **done** — lives in `@mushilu-san/ui/feedback` (blocking confirmation dialog) |
| Sheet (side) | Sheet | **done** — lives in `@mushilu-san/ui/feedback` (side-sliding panel) |
| Toggle Group | Toggle Group | **done** — lives in `@mushilu-san/ui/forms` (single/multi-select button group) |

### Group: forms additions (`@mushilu-san/ui/forms`)

| Component | shadcn equivalent | Status |
|-----------|-------------------|--------|
| Slider | Slider | **done** |
| Input OTP | Input OTP | **done** |
| Date Picker | Date Picker | **done** |
| Calendar | Calendar | **done** |
| Input Group | Input Group | **done** |
| Toggle Group | Toggle Group | **done** |

### Group: layout additions (`@mushilu-san/ui/layout`)

| Component | shadcn equivalent | Status |
|-----------|-------------------|--------|
| Scroll Area | Scroll Area | **done** |
| Resizable | Resizable | **done** |
| Aspect Ratio | Aspect Ratio | **done** |
| Sidebar | Sidebar | **done** |

### Group: data-display additions (`@mushilu-san/ui/data-display`)

| Component | shadcn equivalent | Status |
|-----------|-------------------|--------|
| Data Table | Data Table | **done** — `Table` with sorting (`sortChange` output) |
| Carousel | Carousel | **done** |
| Chart | Chart | **done** |
| Empty | Empty | **done** |
| Typography | Typography | **done** |

### Group: navigation additions (`@mushilu-san/ui/navigation`)

| Component | shadcn equivalent | Status |
|-----------|-------------------|--------|
| Navigation Menu | Navigation Menu | **done** |
| Menubar | Menubar | **done** |

### Not planned (out of scope)

| Component | Reason |
|-----------|--------|
| Direction | RTL utility — not a component |
| Item | Unstyled primitive — too generic |
| Kbd | Simple `<kbd>` wrapper — trivial, add inline if needed |
| Sonner | Covered by Toast + ToastService |
| Native Select | Covered by Select |

---

## Publishing checklist

1. `./dev.sh test` — all green
2. `./dev.sh build` — dist/ clean
3. `npm run changeset` — describe changes
4. Push PR → merge → Changesets bot opens "Version Packages" PR
5. Merge version PR → `changesets/action` publishes to npm automatically
