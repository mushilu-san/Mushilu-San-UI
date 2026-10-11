# Docs site — Phase 1 (Foundation) — design

Date: 2026-10-09
Status: approved (pending implementation plan)

## Problem

The only public documentation for `@mushilu-san/ui` is the Storybook build deployed to
GitHub Pages. Storybook works well as a development and E2E tool, but as a public docs
site it reads like a dev tool: no "when to use / when not to use" guidance, no Do/Don't,
no per-component accessibility reference, no API table, no getting-started flow, and
code samples that live in a controls panel rather than next to the demo.

The goal is a dedicated documentation site at the level of shadcn/ui or Angular
Material docs: a page per component with an explanation, live demos next to copyable
code, accessibility guidance, and an API reference that stays in sync with the source.

## Decisions

- **Storybook stays.** E2E specs drive stories via `gotoStory()`, so Storybook remains
  the internal dev/E2E tool. It moves to `/storybook/` on GitHub Pages; the new site
  takes the root.
- **Stack: Angular application in the Nx workspace** (`projects/docs`). The site is
  built from the library's own components (dogfooding). No meta-framework (Analog,
  Astro).
- **Content model: hybrid.** The API reference is generated from source at build
  time. Prose, guidelines, accessibility tables, and demos are written by hand per
  component.
- **Demos are real component files.** Each example is a standalone `*.demo.ts`
  component. A build script reads that file's source and displays it, so the code shown
  is exactly the code that runs.
- **Prose lives in typed TS files** (`*.docs.ts`), not markdown. This gives type
  safety, needs no markdown parser, and needs no `innerHTML`.
- **Site language: English.**

## Roadmap (each phase gets its own spec + plan)

1. **Foundation (this spec).** App scaffold, shell, routing, prerender, API extractor,
   demo/code infrastructure, dark mode, deploy, and three pilot pages (Button, Dialog,
   Tabs) that serve as the template.
2. **Content.** Remaining ~52 components, group by group. Add JSDoc to library inputs.
3. **Features.** Cmd+K search (built on `mui-command`), mobile-frame preview, and an
   RTL toggle per demo.
4. **Theme Playground.** Live `--mui-*` token editor with a contrast checker and CSS
   export.

Out of scope for all phases for now: versioned docs and StackBlitz integration.

## Architecture

### Project layout

```text
projects/docs/
├── project.json            build / serve / test / lint / extract-api / collect-demos
├── tsconfig.app.json       maps @mushilu-san/ui/* → library source
├── src/
│   ├── index.html          includes the inline theme bootstrap script
│   ├── main.ts, app.config.ts, app.routes.ts
│   ├── app/
│   │   ├── shell/          header, sidebar, theme toggle, layout
│   │   ├── pages/          home, getting-started, components-index, group, component-page
│   │   └── shared/         demo-viewer, code-block, api-table, a11y-section, inline-text pipe
│   ├── content/
│   │   ├── types.ts        ComponentDoc and related types
│   │   ├── registry.ts     every documented component → slug, group, docs loader
│   │   └── components/
│   │       └── button/
│   │           ├── button.docs.ts
│   │           └── demos/button-variants.demo.ts
│   └── generated/          script output (gitignored)
│       ├── api.json
│       └── demo-sources.json
└── scripts/
    ├── extract-api.mjs
    ├── collect-demos.mjs
    └── tokenize.mjs
```

### Nx project

- `projectType: "application"`, `implicitDependencies: ["ui"]`.
- Targets: `extract-api`, `collect-demos`, `build`, `serve`, `test`, `lint`.
  `build` and `serve` declare `dependsOn: ["extract-api", "collect-demos"]`.
- `extract-api` inputs are `projects/ui/src/lib/**` (excluding specs and stories).
  `collect-demos` inputs are `projects/docs/src/content/**`. Both are cacheable.

### Library resolution

`projects/docs/tsconfig.app.json` maps `@mushilu-san/ui` and `@mushilu-san/ui/<group>`
to the library **source** (`projects/ui/src/public-api.ts` and
`projects/ui/src/lib/<group>/src/public-api.ts`). This gives fast HMR without
`build:watch`. Demo files still import from `@mushilu-san/ui/<group>`, exactly as a
consumer would.

### Build and prerender

- Builder: `@angular/build:application` with `outputMode: "static"`, which prerenders
  every route.
- The route list is derived from `registry.ts`: one route per component slug and one
  per group.
- This requires `@angular/ssr` as a devDependency. Per the repo's lockfile rules,
  `package.json` and `package-lock.json` change in the same commit, generated under
  `nvm use`.

### Deploy

`.github/workflows/storybook-deploy.yml` is replaced by `docs-deploy.yml`:

1. `npm ci`
2. `nx build docs` with the Pages `baseHref`.
3. `nx run ui:build-storybook`, with its output placed into `dist/docs/browser/storybook/`.
4. Copy `index.html` to `404.html` as the SPA fallback.
5. Upload one Pages artifact.

Actions stay pinned by SHA per the repo rules.

### CI

`.github/workflows/ci.yml` and `scripts/ci-verify.sh` gain `nx lint docs`,
`nx test docs`, and `nx build docs`. Script specs run under the existing
`npm run test:scripts`.

## Content model

```typescript
export type Group =
  | 'primitives' | 'forms' | 'layout' | 'navigation'
  | 'feedback' | 'data-display' | 'mobile' | 'overlays';

export interface DemoRef {
  id: string;                          // 'button-variants' — matches file name and source key
  title: string;
  description?: string;
  component: () => Promise<Type<unknown>>;
}

export interface ComponentDoc {
  slug: string;                        // 'button'
  name: string;                        // 'Button'
  group: Group;
  selector: string;                    // 'button[muiButton]'
  apiClasses: string[];                // keys into api.json; Tabs → ['Tabs','TabList','Tab','TabPanel']
  summary: string;                     // one sentence; used in cards and (later) search
  description: string[];               // paragraphs
  whenToUse: string[];
  whenNotToUse: { text: string; alternative?: string }[];  // alternative = slug
  demos: DemoRef[];                    // first entry is the hero demo
  guidelines?: { do: string[]; dont: string[] };
  a11y: {
    roles: { element: string; role: string; notes?: string }[];
    keyboard: { keys: string; action: string }[];
    notes: string[];
  };
  tokens?: string[];                   // --mui-* tokens the component consumes
  related?: string[];                  // slugs
}
```

### Inline text

String fields support exactly two inline forms: `` `code` `` and `[text](slug)`.
The `inlineText` pipe parses a string into segments (`text`, `code`, `link`), and the
template renders them with `@for`. No `innerHTML`. Unknown slugs in links are a test
failure (registry consistency spec).

### Registry

`registry.ts` exports an ordered array of `{ slug, name, group, summary, load: () =>
import('./components/<slug>/<slug>.docs') }`. Summary and group are duplicated here so
the sidebar, index pages, and route list don't load every docs file.

## Page template — `/components/:slug`

The page has a sticky table of contents built from the sections that are present.
Sections, in order:

1. **Header.** Name, summary, group badge, selector, and a one-line `import` statement
   with a copy button.
2. **Hero demo.** `demos[0]`, rendered large.
3. **Overview.** Description, When to use, and When not to use (with a link to the
   alternative).
4. **Examples.** The remaining demos. Each has a title, a description, and a
   `demo-viewer`.
5. **Guidelines.** Do / Don't in two columns.
6. **Accessibility.** A roles table, a keyboard table (`<kbd>` keys), and notes.
7. **API.** One block per class in `apiClasses`, with Inputs / Outputs / Models
   tables, plus Methods for services and CSS Parts. Each row shows name, type,
   default, and description. A missing description renders as an empty cell.
8. **Tokens** and **Related.**

### Other pages

- `/`: hero, a live demo strip, and a group grid.
- `/getting-started`: install, `provideMushiluUi()`, importing `tokens.css` and
  `reset.css`, and a first component.
- `/components`: every component as a card, grouped.
- `/components/group/:group`: derived from the registry. No hand-written content.

### `demo-viewer`

- Tabs: Preview / Code (built on the library `Tabs`).
- The Code tab renders pre-tokenized source from `demo-sources.json` with a copy
  button.
- The toolbar has reserved space for the Phase 3 mobile-frame and RTL toggles.

## Scripts

### `extract-api.mjs`

- **Input:** the eight group `public-api.ts` files. Uses the TypeScript compiler API
  (`typescript` is already a devDependency).
- **For each exported class** decorated with `@Component`, `@Directive`, or
  `@Injectable`:
  - It reads `selector` (or `providedIn`).
  - For each property whose initializer is `input()`, `input.required()`, `output()`,
    `model()`, or `model.required()`, it extracts:
    - `name`, honouring `alias`
    - `kind`: `input`, `output`, or `model`
    - `type`: from the generic argument, or inferred from the default via the
      checker. A union of literal types is printed as its members
      (`'primary' | 'secondary'`), not as the alias name.
    - `default`: the source text of the first argument
    - `required`
    - `transform`: `booleanAttribute` is shown as `boolean` with a note that
      attribute presence works
    - `description` and `deprecated`: from JSDoc
  - For `@Injectable` classes, it collects public methods with their signature and
    JSDoc.
  - CSS parts come from `part="..."` in the component's `.html` and
    `'[attr.part]': '"x"'` in `host`.
- **Output:** `generated/api.json`, shaped as
  `{ [className]: { selector, group, kind, members[], methods[], parts[] } }`.
- **Validation:**
  - **Error:** an `apiClasses` entry with no matching class.
  - **Error:** an exported component or directive that no registry entry covers. A
    new component cannot ship without a page.
    - In Phase 1 only three components have pages, so this check uses an allowlist
      file (`content/undocumented.json`) listing the remaining classes. Phase 2
      shrinks that list to empty.
  - **Warning:** an input or output without JSDoc. The script prints a coverage line
    (`JSDoc coverage: N/M`).

### `collect-demos.mjs`

- Globs `content/components/**/demos/*.demo.ts`.
- For each file, it records the raw source and the tokenized source (via
  `tokenize.mjs`).
- **Output:** `generated/demo-sources.json`, keyed by demo id (the file name without
  `.demo.ts`).
- **Error:** a `DemoRef.id` with no matching file (checked by the registry
  consistency spec).

### `tokenize.mjs`

- A small TS/HTML tokenizer that emits `{ t: 'kw'|'str'|'com'|'num'|'tag'|'attr'|'punc'|'plain', v: string }[]`
  per line.
- `code-block` renders the tokens as `<span>` elements with token classes. No runtime
  dependency, no HTML strings.

## Visual design

- The site uses library components wherever one fits: `Sidebar`, `Tabs`, `Table`,
  `Button`, `Badge`, `Card`, `ScrollArea`, `Tooltip`, and `Sheet` (mobile nav).
- Shell styling uses `--mui-*` tokens. `--docs-*` tokens exist only for docs-specific
  values (TOC width, code-block surface, syntax colors).
- Direction: clean and dense, in the style of the shadcn/Radix docs, with code as a
  first-class element. The implementation goes through a `frontend-design` / taste
  review to avoid a generic look.

## Dark mode

- `tokens.css` already supports `data-theme="light|dark"` and
  `prefers-color-scheme`.
- The toggle has three states: system, light, and dark. The choice persists in
  `localStorage`, with reads and writes wrapped in try/catch.
- An inline script in `index.html` sets `data-theme` before first paint, so there is
  no flash.
- Syntax colors are defined for both themes and meet AA contrast.

## Accessibility of the site itself

The site follows the same rules as the library, plus:

- A skip link, and `header` / `nav` / `main` / `aside` landmarks.
- One `h1` per page and an ordered heading hierarchy.
- On route change, focus moves to the page `h1` and an `aria-live="polite"` region
  announces the page title.
- 44px touch targets, `prefers-reduced-motion` respected, and visible
  `:focus-visible` everywhere.
- The mobile sidebar is a `Sheet`: focus is trapped while open, Escape closes it, and
  focus returns to the trigger.

## Testing

- **Unit (`nx test docs`, vitest, zoneless):**
  - The `inlineText` pipe: all segment kinds and malformed input.
  - `code-block`: renders tokens; copy writes to the clipboard and announces
    "Copied".
  - `demo-viewer`: tab switching, lazy demo render, and keyboard operation.
  - `api-table`: renders from a fixture and handles an empty description.
  - The theme service: cycles state, persists, and survives a throwing
    `localStorage`.
  - Registry consistency: slugs are unique, every `alternative`/`related`/link slug
    exists, every `DemoRef.id` has a source entry, and every `apiClasses` entry exists
    in `api.json`.
- **Scripts (`npm run test:scripts`):**
  - `extract-api`: a fixture covering every input/output/model form, alias,
    transform, JSDoc, deprecated, literal-union expansion, service methods, and parts.
  - `collect-demos` and `tokenize`.
- **E2E (Playwright, `e2e/docs/`):**
  - Every prerendered route loads with no console errors.
  - Sidebar navigation moves focus to the `h1`.
  - The theme toggle persists across reloads.
  - Copying code works.
  - The mobile Sheet nav: focus moves inside on open, Escape closes, and focus
    returns to the trigger.
  - An axe scan of home, getting-started, and the three pilot pages.
- **Build smoke:** after `nx build docs`, every registry route exists as an
  `index.html` in the output.

## Phase 1 deliverables (definition of done)

- `projects/docs` builds, serves, lints, and tests green under `./scripts/ci-verify.sh`.
- The home, getting-started, components index, group pages, and the Button, Dialog,
  and Tabs pages are complete, with all sections filled.
- API tables for the three pilot components render from `api.json`.
- Dark mode works with no flash.
- The deploy workflow publishes the site at the root and Storybook at `/storybook/`.
- E2E and axe checks pass.

## Implementation notes (deviations from this spec)

- Generated indexes are TS modules (`generated/api.ts`, `generated/demo-sources.ts`), not JSON, so
  they are typed without `resolveJsonModule` casts.
- "Exported class without a page" and "unknown apiClasses" are enforced by the registry consistency
  spec (`nx test docs`) instead of by `extract-api`, because the registry is TypeScript.
- Inline text is a `docs-inline-text` component (parser + template), not a pipe.
- API and a11y tables are native `<table>`s: `mui-table` renders plain-text cells only.
- The demo-viewer toolbar is deferred to Phase 3 (no empty placeholder).
- The skip link is a button (a `#main` href breaks under a non-root `<base href>`).
- `serve` is SPA-only; SSR/prerender runs only in the production build configuration.
- 404 fallback is `index.csr.html` (client-render shell), not a copy of the prerendered home page,
  to avoid hydration mismatches.
- The TOC is hidden below 1280px with `@media (max-width: 1279.98px) { .toc { display: none } }`
  rather than a base `display: none` rule, so the "On this page" landmark stays queryable in
  jsdom unit tests. There is no in-page nav on narrower screens yet.
- Pilot prose was checked against the real components, not the plan text: a disabled Button gets
  `tabindex="-1"` while a loading Button stays focusable; Button's "when not to use" text was
  reworded because the renderer appends "Use Tabs instead." Tabs renders duplicate ids — tracked as
  library issue A-7 (#686), not worked around in the docs.
- `verify-build` cross-checks the slugs it parses from `registry.ts` (strict vs loose match count,
  zero slugs = failure) so a formatting change cannot make the prerender check pass vacuously.
- E2E lives in `projects/docs/e2e/` (config `playwright.docs.config.ts`, run with
  `npm run e2e:docs`), not `e2e/docs/`. The axe scan filters one known library violation —
  destructive Button contrast in dark mode, A-8 (#707) — by rule, selector and theme; remove the
  filter in `a11y.e2e.ts` when A-8 is fixed.
- npm scripts: `docs` (serve, port 4300), `docs:build`, `docs:verify` (build + `verify-build`),
  `test:docs`, `e2e:docs`; `./dev.sh docs | docs:build | test:docs` wrap them.
- The Tabs-based demo viewer overrides the library's tab-panel padding and hides the tab list's
  vertical overflow (44px tabs + 2px border overflow the list by 2px, showing a scrollbar).
