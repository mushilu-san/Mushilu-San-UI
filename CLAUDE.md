# Mushilu-San-UI — Claude Context

## Project overview

Angular 22 component library published to npm as `@mushilu-san/ui`.  
Mobile-first, token-themed, zero runtime dependencies beyond Angular itself.

## Key facts Claude must know

- **Node version required:** 22.x (≥22.12). Node 20.16 ships on this machine — always activate nvm first.
- **Angular CLI:** v22; use `npx ng` or the local `node_modules/.bin/ng`.
- **Package manager:** npm (not pnpm, despite plan references to `pnpm changeset` — use `npm run changeset`).
- **Component prefix:** `mui-` — all selectors start with `mui-` or use `[muiX]` attribute form.
- **No zone.js** — library is fully zoneless. Never import `fakeAsync`/`tick` in tests.
- **Storybook version:** 10.4.4 (at `projects/ui/.storybook/`). Config is NOT at workspace root.

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
   `legacy-peer-deps=true`. `package.json` engines require `^22.12.0 || >=24.0.0` — if install
   errors with EBADENGINE, run `nvm use`, do NOT bypass with `--force` / removing the engines field.
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

```text
projects/ui/
├── src/
│   ├── styles/           tokens.css + reset.css (shipped in dist/ui/styles/)
│   ├── core/
│   │   ├── tokens/       provideMushiluUi(), MUSHILU_UI_CONFIG token
│   │   └── testing/      renderComponent(), renderTemplate() — internal only (spec files import via relative path)
│   ├── lib/
│   │   ├── primitives/src/   Button, Icon, Badge, Spinner, Divider, Avatar (done)
│   │   ├── forms/src/        Checkbox, Input, Radio, Select, Textarea, Toggle, Label, FormField, Slider, InputOtp, DatePicker, Calendar, InputGroup, ToggleGroup (done)
│   │   ├── layout/src/       Container, Stack, Grid, Spacer, ScrollArea, Resizable, AspectRatio, Sidebar (done)
│   │   ├── navigation/src/   Breadcrumb, Tabs (TabList/Tab/TabPanel), Pagination, NavLink, NavigationMenu, Menubar (done)
│   │   ├── feedback/src/     Alert, Progress, Skeleton, Toast (+ ToastService/ToastContainer), Dialog, AlertDialog, Sheet (done)
│   │   ├── data-display/src/ Accordion, Card, Carousel, Chart, Empty, Table, Tooltip, Typography (done)
│   │   ├── mobile/src/       BottomSheet, FAB, SwipeAction, MobileNav (done)
│   │   └── overlays/src/     Popover, Dropdown Menu, Context Menu, Hover Card, Command, Combobox (done)
│   └── public-api.ts     PRIMARY entry — exports provideMushiluUi() + MushiluUiConfig type
├── primitives/ng-package.json   → @mushilu-san/ui/primitives
├── forms/ng-package.json        → @mushilu-san/ui/forms
├── layout/ng-package.json       → @mushilu-san/ui/layout
├── navigation/ng-package.json   → @mushilu-san/ui/navigation
├── feedback/ng-package.json     → @mushilu-san/ui/feedback
├── data-display/ng-package.json → @mushilu-san/ui/data-display
├── mobile/ng-package.json       → @mushilu-san/ui/mobile
├── overlays/ng-package.json     → @mushilu-san/ui/overlays
├── .storybook/           main.ts, preview.ts, preview-head.html, tsconfig.json, typings.d.ts
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

## Per-component checklist

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

`package.json` engines require Node `^22.12.0 || >=24.0.0` — Node 20.x is **not** supported.
The machine defaults to Node 20.16; nvm must be sourced and `nvm use 22` called before any
Angular/npm command.

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

### 10. CVA `_cvaDisabled` naming convention

All CVA components must name their disabled signal `_cvaDisabled` (with underscore prefix).
InputOtp and other early components used `cvaDisabled` (no underscore), causing inconsistency.
Standardized in the June 2026 type-safety audit.

### 11. Boolean inputs must use `booleanAttribute` transform

Every `input()` that accepts a boolean MUST include `{ transform: booleanAttribute }`.
Without it, template attribute usage (`<mui-x destructive>`) passes the string `""` instead
of `true`. AlertDialog `destructive` and ContextMenu `closeOnSelect` were missing this.

### 12. Never use `!` non-null assertions on `ViewChild` / `viewChild`

Use `viewChild.required<T>('ref')` (signal-based) instead of `@ViewChild('ref') ref!: T`.
The `!` hides null-safety violations. Slider `trackRef` and Chart `canvasRef` were fixed.

### 13. Capture signal values to `const` before narrowing

`this.value()` called twice in the same expression can return different types across calls.
Always capture to a local `const` before null-checking:

```typescript
// BAD:  this.value() ? norm(this.value()!) : fallback
// GOOD: const v = this.value(); return v ? norm(v) : fallback;
```

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

## Code standards — mandatory rules for every new component

These rules exist because every violation below was found in the June 2026 audit.
Violating any of them will create a new audit issue. Read before writing code.

### Angular / Zoneless (audit: B-6, P-2, P-5)

- **Never import or inject `NgZone`** in shipped component code. The library is fully zoneless (`provideExperimentalZonelessChangeDetection()`); `NgZone.run()` and `runOutsideAngular()` are no-ops under `NoopNgZone` and create false impressions of CD control.
- Signal writes drive change detection — that is the only mechanism that works.

### Signals & reactivity (audit: B-3, B-4)

- **Every `input()` that feeds internal state needs an `effect()`** — never read it only once in the constructor. Example: `[value]` and `[length]` inputs to a form control must both have effects that update internal signals when the input changes.
- Use `model()` for two-way-bindable state. Use `computed()` for derived values, not manual methods that re-derive on every call.

### Null safety (audit: B-5, TS-2, TS-3)

- **Never use `!` non-null assertions** — always guard: `const x = this.ref; if (!x) return;`
- After a null guard, **capture to `const`** before any subsequent code. Do not re-assert `this.ref!` after the guard — the assertion is invalid across any async boundary.

### Event handling (audit: B-2, TS-1)

- **Guard `event.touches` before indexing**: `const touch = event.touches[0]; if (!touch) return;`
- **Use `event.currentTarget`**, not `event.target`, in all `@HostListener` and `addEventListener` handlers. `event.target` is the element that originated the event (can be a bubbled child); `currentTarget` is always the element the listener is bound to.

### DOM & browser APIs (audit: S-4, A-5, B-7)

- **Inject `DOCUMENT`** (Angular's `@Inject(DOCUMENT)`) instead of referencing the global `document`. Prevents breakage in SSR and sandboxed environments.
- **Use `afterNextRender()`** for any DOM operation (e.g. `el.focus()`) that must run after Angular has rendered. Never use `setTimeout(() => el.focus())` — it silently swallows errors and is untestable.
- **Overlays must reposition on scroll and resize** while visible. Add passive `scroll` and `resize` listeners on show; remove them on hide. Position output must be clamped within the viewport (at minimum 4px margins on all sides).

### Lifecycle & cleanup (audit: B-8, D-4)

- **Every `register*(item)` must have a matching `unregister*(item)`** callable from `ngOnDestroy` of the registered child. Omitting cleanup causes stale counts and index-out-of-range bugs when items are dynamically removed.
- **Never attach listeners that do nothing.** If a handler body is empty or has only a comment, delete the `addEventListener` call entirely.

### Logic guards (audit: B-1, D-3)

- **Verify conditions are actually possible** before writing a guard. A guard like `if (!obj.toString)` is always false (`.toString` is on `Object.prototype`). Dead guards rot and mislead future readers — delete them.

### Security (audit: S-1, S-4)

- **No `[innerHTML]`, no `bypassSecurityTrust*`** — already in the component checklist.
- For components that append to the DOM programmatically (overlays, toasts), use `DOCUMENT` token and `textContent` / `createElement` — never string concatenation into HTML.
- `ViewEncapsulation.None` is allowed only for overlay components that must pierce shadow DOM. **Document the reason with a comment** and use a namespaced class (`.mui-*-overlay`, not `.mui-tooltip`).

### Testing (audit: T-1 through T-8)

- **Every bug fix must include at least one test** that would have caught the original bug. Existing tests passing is not proof the fix works — add a targeted test that exercises the specific code path changed by the fix. Tag the test with the audit issue ID (e.g. `it('H-T-9f3e42: ...')`).
- **Every root-level singleton service must have its own spec** before shipping. High blast radius means silent regressions reach all consumers.
- **Every component with timer, pointer, or touch logic needs its own spec.** Mobile is the library's primary target — test `touchstart`/`touchend`/`pointermove` paths.
- **≥ 80% coverage per component** is the floor, not the target. Aim for 100% on state-machine paths (enabled/disabled, loading, error).
- **Test sub-components in isolation.** A `TabList` spec that only renders a full `<mui-tabs>` parent doesn't verify `<mui-tab>` keyboard nav directly — add a focused sub-component spec.
- For E2E-only behaviors (focus order, real keyboard sequences, scroll positioning), write a Playwright story-driven spec — don't skip because unit tests can't assert it.

### E2E (audit: E-0 through E-7)

- **Every new interactive component needs at minimum one Storybook story suitable for E2E** — exported as `Default` and usable by `gotoStory()`. Prefer stories without `moduleMetadata` (standalone components don't need it).
- **Every overlay must have E2E coverage for**: focus moves inside on open, `Escape` closes, focus returns to trigger after close.
- **Every touch-gesture component must have E2E coverage** using Playwright's `page.mouse` (pointer simulation) for the primary gesture (swipe, drag, long-press).

### Performance (audit: P-1, P-6, P-2)

- **Memoize expensive object construction** with `computed()`. `Intl.DateTimeFormat`, `Intl.NumberFormat`, and similar platform objects are expensive — create them once per locale/options change, not on every render.
- **Never attach document-level listeners that do no work.** CPU cost is proportional to event frequency (pointermove fires dozens of times per second during drag).
- Signal writes are the CD mechanism — do not add redundant `markForCheck()` or `detectChanges()` calls alongside them.

### Shared utilities — use these, don't re-implement (as they become available)

- **Overlay positioning** → use the shared `computePosition()` util (`overlays/src/positioning/`) once DD-1 is resolved. Do not re-implement getBoundingClientRect anchoring per component.
- **Roving tabindex** → use the `RovingFocus` directive once DD-2 is resolved. Do not re-implement Arrow/Home/End/Enter key handling per menu/tab widget.
- **CVA boilerplate** → use the `useCva<T>()` helper once DD-3 is resolved. Do not re-declare `_onChange`, `_onTouched`, `_cvaDisabled` per form control.
- **Pointer drag** → use `createDrag({ onMove, onEnd })` once DD-4 is resolved. Do not re-implement pointerdown→pointermove→pointerup listener lifecycle per component.

---

## Audit issue tracking

Every finding — discovered in a PR review, code read, or ad-hoc investigation —
**must have a GitHub issue opened immediately** before any fix work begins.

```bash
# Open one new finding issue (also appends to scripts/audit-findings.json):
./scripts/open-audit-issues.sh --new <ID> <SEVERITY> <CATEGORY> "<TITLE>" "<ONE-LINE DESC>"

# Close a resolved issue + mark resolved in the JSON:
./scripts/open-audit-issues.sh --resolve <ID>

# Re-create missing issues for all findings (idempotent):
./scripts/open-audit-issues.sh
```

Severity values: `critical` | `high` | `medium` | `low` | `info`

Category values: `security` | `performance` | `decomposition` | `bugs` | `tests` | `e2e` | `accessibility` | `types` | `dead-code` | `dependency`

All finding data lives in `scripts/audit-findings.json`. The script is idempotent — safe to run multiple times without creating duplicates.

### Automated hunt sweep IDs

The Bloodhound hunt squad (`/mui-hunt`) files issues through the **same script** using
`H-<cat-letter>-<hash6>` IDs. These are stable fingerprints computed as:

```text
H-<cat-letter>-<first-6-hex-of-sha1("<category>:<relative-file>:<EnclosingClassName>")>
```

Cat-letters: `B`=bugs, `P`=performance, `S`=security, `A`=accessibility, `T`=types,
`D`=dead-code, `C`=decomposition, `U`=tests, `E`=e2e, `L`=dependency.

`H-` hunt IDs never collide with manual audit IDs (`B-`, `P-`, `S-`, etc.). The script's
title-search idempotency (`[AUDIT] H-...:` prefix) ensures re-running the sweep never
double-files. See `.mui-team/reports/bug-hunt.md` for the consolidated report.

## Bug-hunt sweep

Run `/mui-hunt` to fan out all ten read-only hunters in parallel across the full repo.
Pass `--file-issues` to open GitHub issues for every new finding. The sweep writes
`.mui-team/reports/bug-hunt.md` as proof nothing was dropped between discovery and filing.
