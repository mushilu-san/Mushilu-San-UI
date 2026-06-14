# @mushilu-san/ui

A **mobile-first, token-themed Angular component library** — built with Angular 22,
fully **zoneless**, with zero runtime dependencies beyond Angular itself. Components are
shipped across eight tree-shakable entry points and every one meets a strict accessibility
contract (WCAG AA, full keyboard support, 44px touch targets, reduced-motion).

- **Package:** `@mushilu-san/ui` · **Selector prefix:** `mui-` (or `[muiX]` attribute form)
- **Angular:** 22.x · **Node:** 22.x (`.nvmrc`) · **Tests:** Vitest (zoneless) · **Docs:** Storybook 10

## Installation

```bash
npm install @mushilu-san/ui
```

Add the design tokens and reset once (e.g. in your global stylesheet):

```css
@import '@mushilu-san/ui/styles/reset.css';
@import '@mushilu-san/ui/styles/tokens.css';
```

## Usage

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

@Component({
  imports: [Button],
  template: `<button muiButton variant="primary">Save</button>`,
})
export class SaveAction {}
```

## Entry points

Each group is an independent, tree-shakable bundle with its own size budget.

| Import | Components |
|--------|-----------|
| `@mushilu-san/ui/primitives` | Button, Icon, Badge, Spinner, Divider, Avatar |
| `@mushilu-san/ui/forms` | Input, Select, Checkbox, Radio, Textarea, Toggle, Slider, DatePicker, Calendar, InputOtp, … |
| `@mushilu-san/ui/layout` | Container, Stack, Grid, Spacer, ScrollArea, Resizable, AspectRatio, Sidebar |
| `@mushilu-san/ui/navigation` | Breadcrumb, Tabs, Pagination, NavLink, NavigationMenu, Menubar |
| `@mushilu-san/ui/feedback` | Alert, Progress, Skeleton, Toast, Dialog, AlertDialog, Sheet |
| `@mushilu-san/ui/data-display` | Card, Table, Accordion, Tooltip, Carousel, Chart, Empty, Typography |
| `@mushilu-san/ui/mobile` | BottomSheet, FAB, SwipeAction, MobileNav |
| `@mushilu-san/ui/overlays` | Popover, Dropdown Menu, Context Menu, Hover Card, Command, Combobox |

## Development

Node 22 is required; every command must run under it. The `./dev.sh` helper activates the
correct Node version automatically.

```bash
./dev.sh build          # build the library (all entry points)
./dev.sh test           # run all tests with coverage
./dev.sh storybook      # Storybook dev server on :6006
./dev.sh storybook:build
./dev.sh changeset      # add a changeset before a release PR
```

Before pushing, run `./scripts/ci-verify.sh` — it mirrors CI exactly
(`npm ci` → lint → format → test → build → size → storybook).

> **Dependency discipline:** any change to `package.json` must regenerate
> `package-lock.json` in the same commit, under the Node from `.nvmrc`. See
> [CLAUDE.md](CLAUDE.md) for the full rules.

## The Studio — agent/skill team

This repo ships its own project-local **"virtual engineering team"**: 15 specialist
Claude Code skills (mirrored as Cursor rules) plus blocking safety hooks, all generated
from a single source of truth and individually QA-graded. It automates the
component pipeline — **Frame → Spec → Build → (Style ‖ A11y ‖ Review) → Test → QA → Size →
Ship** — and enforces the lockfile/Node/CI rules that this project's CI depends on.

See **[team/README.md](team/README.md)** for the full roster, hooks, and how it's wired.

## Releasing

Versioning and publishing use [Changesets](https://github.com/changesets/changesets):
add a changeset on your PR, merge it, and the Changesets bot opens a "Version Packages" PR
that publishes to npm on merge. See the publishing checklist in [CLAUDE.md](CLAUDE.md).
