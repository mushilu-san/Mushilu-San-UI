# Docs Site — Phase 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `projects/docs`, a prerendered Angular documentation site for `@mushilu-san/ui`, with generated API tables, live demos shown next to their own source code, dark mode, and three complete pilot pages (Button, Dialog, Tabs). It deploys to GitHub Pages at the root, with Storybook moved to `/storybook/`.

**Architecture:** This is a new Nx application that compiles the library from source through tsconfig `paths`.

- Two Node build scripts write typed TS modules into a gitignored `src/generated/` folder:
  - `extract-api.mjs` uses the TypeScript compiler API to read the library's signal inputs, outputs, and models.
  - `collect-demos.mjs` reads every `*.demo.ts` file and pre-tokenizes it for syntax highlighting.
- Hand-written content lives in typed `*.docs.ts` files that are referenced from a registry.
- The production build prerenders every registry route through `outputMode: "static"`.

**Tech Stack:** Angular 22 (zoneless, signals, `@angular/build:application`), `@angular/ssr` for prerender only, Nx 23, Vitest via `@angular/build:unit-test`, Testing Library, Playwright, `@axe-core/playwright`, and the TypeScript 6 compiler API.

**Spec:** `docs/superpowers/specs/2026-10-09-docs-site-phase1-design.md`

## Global Constraints

- **Node:** comes from `.nvmrc` (22.22.3). Run `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use` once in every new shell before any `npm`/`npx` command. Never use `--force`, and never edit `engines`.
- **Package manager is npm.** Any `package.json` change goes into the same commit as the regenerated `package-lock.json`.
- **Do not use bare `ng` commands.** Use `npx nx <target> <project>`.
- **Zoneless.**
  - Never import `NgZone`, `fakeAsync`, or `tick` from `@angular/core/testing`.
  - Signal writes drive change detection.
  - In tests, use `TestBed.tick()` or Testing Library's `findBy*`.
- **Security.**
  - Never use `[innerHTML]` or `bypassSecurityTrust*`.
  - Never build HTML strings.
- **DOM access.**
  - Use `inject(DOCUMENT)`, never the global `document`/`window`.
  - Run post-render DOM work in `afterNextRender()`. Never use `setTimeout` to move focus.
- **Null safety.** No `!` non-null assertions. Capture signal values in a `const` before narrowing them.
- **Selector prefix.** Docs-app components use `docs-` element selectors and `docs` camelCase attribute selectors (enforced by `projects/docs/eslint.config.js`).
- **Library imports.** Docs code and demos import the library only via `@mushilu-san/ui` and `@mushilu-san/ui/<group>`, never through relative paths into `projects/ui`.
- **Styling.**
  - Use `--mui-*` semantic tokens.
  - Add `--docs-*` tokens only for docs-specific values; all of them are defined in `projects/docs/src/styles.css`.
  - Every interactive element is at least 44×44px (`var(--mui-touch-target)`) and has a visible `:focus-visible` ring that uses `--mui-color-focus-ring`.
  - Any animation needs a `@media (prefers-reduced-motion: reduce)` override.
- **Components** are standalone, use `ChangeDetectionStrategy.OnPush`, and use signal `input()`/`output()`/`model()`. Boolean inputs take `{ transform: booleanAttribute }`.
- **Before every commit:**
  - Run `npx prettier --write <changed files>`.
  - Run `npx nx lint docs` once Task 1 has created that target.
- **Commit messages** end with:
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  ```
- **Branch:** `feat/docs-site`, which already exists with the spec commit.

---

## File Map

```text
projects/docs/
├── project.json                         Nx targets
├── eslint.config.js                     docs selector prefix
├── tsconfig.app.json / tsconfig.spec.json
├── public/favicon.svg
├── scripts/
│   ├── tokenize.mjs (+ .spec.mjs)       TS/HTML → token lines
│   ├── extract-api.mjs (+ .spec.mjs)    library source → generated/api.ts
│   ├── collect-demos.mjs (+ .spec.mjs)  *.demo.ts → generated/demo-sources.ts
│   ├── verify-build.mjs (+ .spec.mjs)   prerender smoke check
│   └── __fixtures__/                    extractor + demo fixtures
├── e2e/
│   ├── docs.e2e.ts
│   └── a11y.e2e.ts
└── src/
    ├── index.html, main.ts, main.server.ts, styles.css, test-setup.ts
    ├── generated/                       (gitignored) api.ts, demo-sources.ts
    ├── content/
    │   ├── types.ts, api-types.ts, code-types.ts
    │   ├── groups.ts, registry.ts, tokens.ts, undocumented.json
    │   ├── registry.spec.ts             consistency checks
    │   └── components/{button,dialog,tabs}/  *.docs.ts + demos/*.demo.ts
    └── app/
        ├── app.ts/.html/.css, app.config.ts, app.config.server.ts
        ├── app.routes.ts, app.routes.server.ts, title-strategy.ts
        ├── shell/      header, nav (+ nav-sections.ts), route-focus.service.ts
        ├── shared/     inline-text, theme, code-block, demo-viewer, api-reference, a11y-section
        └── pages/      home, getting-started, components-index, group, component-page, not-found
playwright.docs.config.ts                (root)
.github/workflows/docs-deploy.yml        (replaces storybook-deploy.yml)
```

---

### Task 1: Scaffold the `docs` Nx application

**Files:**
- Create:
  - `projects/docs/project.json`
  - `projects/docs/eslint.config.js`
  - `projects/docs/tsconfig.app.json`
  - `projects/docs/tsconfig.spec.json`
  - `projects/docs/public/favicon.svg`
  - `projects/docs/src/index.html`
  - `projects/docs/src/main.ts`
  - `projects/docs/src/main.server.ts`
  - `projects/docs/src/styles.css`
  - `projects/docs/src/test-setup.ts`
  - `projects/docs/src/app/app.ts`
  - `projects/docs/src/app/app.config.ts`
  - `projects/docs/src/app/app.config.server.ts`
  - `projects/docs/src/app/app.routes.ts`
  - `projects/docs/src/app/app.routes.server.ts`
  - `projects/docs/src/app/pages/home/home.ts`
  - `projects/docs/src/app/pages/home/home.spec.ts`
- Modify:
  - `package.json` (devDeps + scripts)
  - `package-lock.json`
  - `tsconfig.json` (references)
  - `.gitignore`

**Interfaces:**
- Produces:
  - Nx project `docs` with the targets `build` (configurations `production`, which includes prerender, and `development`, which is SPA-only), `serve`, `test`, and `lint`.
  - The npm scripts `docs`, `docs:build`, `test:docs`, and `lint` (the last one now covers both projects).
  - Global CSS tokens `--docs-*` (see `styles.css`).
  - `Home` component at `pages/home/home.ts`. It is a placeholder that Task 15 replaces.

- [ ] **Step 1: Install SSR packages**

Run:
```bash
npm install -D @angular/ssr@^22.0.6 @angular/platform-server@^22.0.6
```
Expected: `package.json` gains both devDependencies, `package-lock.json` is updated, and there is no EBADENGINE error.

- [ ] **Step 2: Add npm scripts**

In `package.json` `"scripts"`, change `"lint"` and add three scripts:
```json
"lint": "nx run-many -t lint -p ui docs",
"docs": "nx serve docs",
"docs:build": "nx build docs",
"test:docs": "nx test docs --no-watch",
```

- [ ] **Step 3: Create `projects/docs/project.json`**

```json
{
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "name": "docs",
  "projectType": "application",
  "sourceRoot": "projects/docs/src",
  "prefix": "docs",
  "implicitDependencies": ["ui"],
  "targets": {
    "build": {
      "executor": "@angular/build:application",
      "dependsOn": [],
      "outputs": ["{workspaceRoot}/dist/docs"],
      "options": {
        "outputPath": "dist/docs",
        "index": "projects/docs/src/index.html",
        "browser": "projects/docs/src/main.ts",
        "tsConfig": "projects/docs/tsconfig.app.json",
        "styles": [
          "projects/ui/src/styles/reset.css",
          "projects/ui/src/styles/tokens.css",
          "projects/docs/src/styles.css"
        ],
        "assets": [{ "glob": "**/*", "input": "projects/docs/public" }]
      },
      "configurations": {
        "production": {
          "server": "projects/docs/src/main.server.ts",
          "outputMode": "static",
          "outputHashing": "all",
          "budgets": [
            { "type": "initial", "maximumWarning": "500kB", "maximumError": "1MB" },
            { "type": "anyComponentStyle", "maximumWarning": "8kB", "maximumError": "16kB" }
          ]
        },
        "development": {
          "optimization": false,
          "extractLicenses": false,
          "sourceMap": true
        }
      },
      "defaultConfiguration": "production"
    },
    "serve": {
      "executor": "@angular/build:dev-server",
      "options": { "port": 4300 },
      "configurations": {
        "production": { "buildTarget": "docs:build:production" },
        "development": { "buildTarget": "docs:build:development" }
      },
      "defaultConfiguration": "development"
    },
    "test": {
      "executor": "@angular/build:unit-test",
      "dependsOn": [],
      "options": {
        "buildTarget": "docs:build:development",
        "tsConfig": "projects/docs/tsconfig.spec.json",
        "setupFiles": ["projects/docs/src/test-setup.ts"],
        "include": ["projects/docs/src/**/*.spec.ts"]
      }
    },
    "lint": {
      "executor": "@angular-eslint/builder:lint",
      "options": {
        "lintFilePatterns": ["projects/docs/src/**/*.ts", "projects/docs/src/**/*.html"],
        "eslintConfig": "projects/docs/eslint.config.js"
      }
    }
  }
}
```

SSR and prerender run only in `production`. `development` is a plain SPA, which keeps `serve` and `test` fast and free of server-only concerns. The empty `dependsOn` arrays override the workspace default `^build`: the docs app compiles the library from source, so it doesn't need `dist/ui`. Tasks 3 and 4 fill these arrays.

- [ ] **Step 4: Create the tsconfigs**

`projects/docs/tsconfig.app.json`:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/docs",
    "types": [],
    "paths": {
      "@mushilu-san/ui": ["../ui/src/public-api.ts"],
      "@mushilu-san/ui/*": ["../ui/src/lib/*/src/public-api.ts"]
    }
  },
  "files": ["src/main.ts", "src/main.server.ts"],
  "include": ["src/**/*.d.ts"]
}
```

`projects/docs/tsconfig.spec.json`:
```json
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/docs-spec",
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "files": [],
  "include": ["src/**/*.d.ts", "src/**/*.spec.ts", "src/test-setup.ts"]
}
```

In root `tsconfig.json`, append to `"references"`:
```json
{ "path": "./projects/docs/tsconfig.app.json" },
{ "path": "./projects/docs/tsconfig.spec.json" }
```

- [ ] **Step 5: Create `projects/docs/eslint.config.js`**

```js
// @ts-check
const { defineConfig } = require('eslint/config');
const rootConfig = require('../../eslint.config.js');

module.exports = defineConfig([
  { ignores: ['**/generated/**'] },
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'docs', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'docs', style: 'camelCase' },
      ],
    },
  },
]);
```

- [ ] **Step 6: Create the entry files**

`projects/docs/src/index.html`. The inline script applies the stored theme before first paint, so the page does not flash:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Mushilu-San UI</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Mobile-first, token-themed, accessible Angular components." />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
    <script>
      (function () {
        try {
          var t = localStorage.getItem('docs-theme');
          if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
        } catch (e) {}
      })();
    </script>
  </head>
  <body>
    <docs-root></docs-root>
  </body>
</html>
```

`projects/docs/public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#2563eb"/><path d="M9 22V10l7 7 7-7v12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

`projects/docs/src/main.ts`:
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((err: unknown) => console.error(err));
```

`projects/docs/src/main.server.ts`:
```ts
import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;
```

`projects/docs/src/test-setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 7: Create the app config and routes**

`projects/docs/src/app/app.config.ts`:
```ts
import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideMushiluUi } from '@mushilu-san/ui';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    provideClientHydration(withEventReplay()),
    provideMushiluUi(),
  ],
};
```

`projects/docs/src/app/app.config.server.ts`:
```ts
import { type ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

`projects/docs/src/app/app.routes.ts` (Task 11 replaces this):
```ts
import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
];
```

`projects/docs/src/app/app.routes.server.ts` (Task 11 replaces this):
```ts
import { RenderMode, type ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
```

`projects/docs/src/app/app.ts` (Task 10 replaces this):
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'docs-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main id="main"><router-outlet /></main>`,
})
export class App {}
```

- [ ] **Step 8: Write the failing Home test**

`projects/docs/src/app/pages/home/home.spec.ts`:
```ts
import { render, screen } from '@testing-library/angular';
import { Home } from './home';

describe('Home', () => {
  it('renders the site title as the page heading', async () => {
    await render(Home);
    expect(screen.getByRole('heading', { level: 1, name: 'Mushilu-San UI' })).toBeInTheDocument();
  });
});
```

Run: `npx nx test docs --no-watch`
Expected: FAIL, because `./home` cannot be resolved.

- [ ] **Step 9: Create the Home placeholder**

`projects/docs/src/app/pages/home/home.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'docs-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>Mushilu-San UI</h1>`,
})
export class Home {}
```

Run: `npx nx test docs --no-watch`
Expected: PASS (1 test).

- [ ] **Step 10: Create `projects/docs/src/styles.css`**

```css
/* Docs-only tokens. Everything else comes from --mui-* in tokens.css. */
:root {
  --docs-header-height: 56px;
  --docs-sidebar-width: 264px;
  --docs-toc-width: 208px;
  --docs-content-max: 768px;

  /* Code surfaces stay dark in both themes. Every syntax colour below was chosen
     for >= 4.5:1 against --docs-code-bg; the axe E2E scan (Task 17) enforces it. */
  --docs-code-bg: #0f172a;
  --docs-code-border: #1e293b;
  --docs-code-plain: #e2e8f0;
  --docs-code-kw: #c4b5fd;
  --docs-code-str: #86efac;
  --docs-code-com: #94a3b8;
  --docs-code-num: #fdba74;
  --docs-code-tag: #7dd3fc;
  --docs-code-attr: #fde68a;
  --docs-code-punc: #cbd5e1;
}

html {
  scroll-padding-top: calc(var(--docs-header-height) + var(--mui-space-4));
}

body {
  margin: 0;
  background: var(--mui-color-bg);
  color: var(--mui-color-text);
  font-family: var(--mui-font-sans);
  font-size: var(--mui-font-size-base);
  line-height: var(--mui-line-height-base);
}

a {
  color: var(--mui-color-primary);
}

a:focus-visible,
button:focus-visible,
[tabindex]:focus-visible {
  outline: var(--mui-focus-ring-width) solid var(--mui-color-focus-ring);
  outline-offset: var(--mui-focus-ring-offset);
}

code {
  font-family: var(--mui-font-mono);
  font-size: 0.875em;
  background: var(--mui-color-surface);
  border: 1px solid var(--mui-color-border);
  border-radius: var(--mui-radius-sm);
  padding: 0.1em 0.35em;
}

kbd {
  font-family: var(--mui-font-mono);
  font-size: var(--mui-font-size-sm);
  border: 1px solid var(--mui-color-border-strong);
  border-bottom-width: 2px;
  border-radius: var(--mui-radius-sm);
  padding: 0 0.4em;
  background: var(--mui-color-surface-raised);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 11: Ignore generated output**

Append to `.gitignore`:
```gitignore

# Docs site generated sources (extract-api / collect-demos)
/projects/docs/src/generated/
```

- [ ] **Step 12: Verify build, prerender, and lint**

Run: `npx nx build docs`
Expected:
- Success.
- `dist/docs/browser/index.html` exists and contains `<h1>Mushilu-San UI</h1>`, which proves the page was prerendered.
- `dist/docs/browser/index.csr.html` exists.

If the build reports that a library component touches `window`/`document` during prerender:
1. Stop.
2. Record the finding with `./scripts/open-audit-issues.sh --new ...`, per CLAUDE.md.
3. Report it before continuing.

Run: `npx nx lint docs`
Expected: `All files pass linting.`

- [ ] **Step 13: Commit**

```bash
npx prettier --write projects/docs tsconfig.json package.json
git add projects/docs package.json package-lock.json tsconfig.json .gitignore
git commit -m "feat(docs): scaffold docs application with static prerender

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Syntax tokenizer (`tokenize.mjs`)

**Files:**
- Create:
  - `projects/docs/scripts/tokenize.mjs`
  - `projects/docs/scripts/tokenize.spec.mjs`
- Modify:
  - `vitest.scripts.config.mjs`

**Interfaces:**
- Produces: `tokenize(source: string, lang: 'ts' | 'html'): { t: TokenKind; v: string }[][]`. The result has one array per line, and adjacent tokens of the same kind are merged. `TokenKind = 'kw' | 'str' | 'com' | 'num' | 'tag' | 'attr' | 'punc' | 'plain'`. Inside TS sources, a template literal that directly follows `template:` is tokenized as HTML.

- [ ] **Step 1: Include docs scripts in the scripts test config**

`vitest.scripts.config.mjs`:
```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['scripts/**/*.spec.mjs', 'projects/docs/scripts/**/*.spec.mjs'],
    environment: 'node',
  },
});
```

- [ ] **Step 2: Write the failing tests**

`projects/docs/scripts/tokenize.spec.mjs`:
```js
import { describe, expect, it } from 'vitest';
import { tokenize } from './tokenize.mjs';

const kinds = (line) => line.map((tok) => `${tok.t}:${tok.v}`);
const joined = (lines) => lines.map((l) => l.map((tok) => tok.v).join('')).join('\n');

describe('tokenize (ts)', () => {
  it('classifies keywords, decorators, identifiers, strings, numbers and punctuation', () => {
    const [line] = tokenize("export const size = 'md'; // pick\n", 'ts');
    expect(kinds(line)).toEqual([
      'kw:export',
      'plain: ',
      'kw:const',
      'plain: size ',
      'punc:=',
      'plain: ',
      "str:'md'",
      'punc:;',
      'plain: ',
      'com:// pick',
    ]);
  });

  it('treats decorators as keywords and numbers as num', () => {
    const [line] = tokenize('@Component gap = 3', 'ts');
    expect(kinds(line)).toEqual(['kw:@Component', 'plain: gap ', 'punc:=', 'plain: ', 'num:3']);
  });

  it('splits multi-line block comments across lines', () => {
    const lines = tokenize('/** a\n b */\nx', 'ts');
    expect(lines).toHaveLength(3);
    expect(kinds(lines[0])).toEqual(['com:/** a']);
    expect(kinds(lines[1])).toEqual(['com: b */']);
    expect(kinds(lines[2])).toEqual(['plain:x']);
  });

  it('tokenizes a `template:` literal as HTML', () => {
    const [line] = tokenize('template: `<button muiButton variant="ghost">Go</button>`', 'ts');
    expect(kinds(line)).toEqual([
      'plain:template',
      'punc::',
      'plain: ',
      'str:`',
      'tag:<button',
      'plain: ',
      'attr:muiButton',
      'plain: ',
      'attr:variant',
      'punc:=',
      'str:"ghost"',
      'tag:>',
      'plain:Go',
      'tag:</button>',
      'str:`',
    ]);
  });

  it('keeps other template literals as a single string', () => {
    const [line] = tokenize('const s = `a ${b}`;', 'ts');
    expect(kinds(line)).toContain('str:a ${b}');
  });

  it('round-trips the exact source text (minus one trailing newline)', () => {
    const src = [
      "import { Component } from '@angular/core';",
      '',
      '@Component({',
      "  selector: 'docs-x',",
      '  template: `',
      '    <!-- note -->',
      '    <mui-tabs [(activeTab)]="tab" (click)="go()">',
      '      text',
      '    </mui-tabs>',
      '  `,',
      '})',
      'export class X {}',
      '',
    ].join('\n');
    expect(joined(tokenize(src, 'ts'))).toBe(src.replace(/\n$/, ''));
  });
});

describe('tokenize (html)', () => {
  it('handles comments, bound attributes and self-closing tags', () => {
    const [line] = tokenize('<!-- c --><img [src]="x" />', 'html');
    expect(kinds(line)).toEqual([
      'com:<!-- c -->',
      'tag:<img',
      'plain: ',
      'attr:[src]',
      'punc:=',
      'str:"x"',
      'plain: ',
      'tag:/>',
    ]);
  });

  it('treats a stray < that does not open a tag as text', () => {
    const [line] = tokenize('a < b', 'html');
    expect(joined([line])).toBe('a < b');
    expect(line.every((tok) => tok.t === 'plain')).toBe(true);
  });
});
```

Run: `npm run test:scripts`
Expected: FAIL, because `./tokenize.mjs` is not found.

- [ ] **Step 3: Implement `projects/docs/scripts/tokenize.mjs`**

```js
// Minimal TS/HTML tokenizer for the docs code blocks.
// Runs at build time (collect-demos.mjs); the app only renders the token arrays.

const TS_KEYWORDS = new Set([
  'as', 'async', 'await', 'boolean', 'class', 'const', 'else', 'export', 'extends', 'false',
  'for', 'from', 'function', 'if', 'implements', 'import', 'in', 'interface', 'let', 'new',
  'null', 'number', 'of', 'private', 'protected', 'public', 'readonly', 'return', 'static',
  'string', 'this', 'true', 'type', 'undefined', 'unknown', 'var', 'void',
]);

export function tokenizeHtml(src) {
  const out = [];
  const push = (t, v) => {
    if (v) out.push({ t, v });
  };
  let i = 0;
  let inTag = false;
  while (i < src.length) {
    const rest = src.slice(i);
    let m;
    if (!inTag) {
      if (rest.startsWith('<!--')) {
        const end = rest.indexOf('-->');
        const len = end === -1 ? rest.length : end + 3;
        push('com', rest.slice(0, len));
        i += len;
        continue;
      }
      if ((m = /^<\/?[A-Za-z][\w-]*/.exec(rest))) {
        push('tag', m[0]);
        inTag = true;
        i += m[0].length;
        continue;
      }
      const next = rest.indexOf('<', 1);
      const len = next === -1 ? rest.length : next;
      push('plain', rest.slice(0, len));
      i += len;
      continue;
    }
    if ((m = /^\/?>/.exec(rest))) {
      push('tag', m[0]);
      inTag = false;
    } else if ((m = /^\s+/.exec(rest))) push('plain', m[0]);
    else if ((m = /^"[^"]*"|^'[^']*'/.exec(rest))) push('str', m[0]);
    else if ((m = /^=/.exec(rest))) push('punc', m[0]);
    else if ((m = /^[^\s=>/"']+/.exec(rest))) push('attr', m[0]);
    else {
      m = [rest[0]];
      push('punc', m[0]);
    }
    i += m[0].length;
  }
  return out;
}

function findTemplateEnd(src, from) {
  for (let k = from; k < src.length; k++) {
    if (src[k] === '\\') {
      k++;
      continue;
    }
    if (src[k] === '`') return k;
  }
  return src.length;
}

function followsTemplateKey(out) {
  const significant = out.filter((tok) => tok.v.trim() !== '');
  return significant.at(-2)?.v === 'template' && significant.at(-1)?.v === ':';
}

export function tokenizeTs(src) {
  const out = [];
  const push = (t, v) => {
    if (v) out.push({ t, v });
  };
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    let m;
    if (rest[0] === '`') {
      const end = findTemplateEnd(src, i + 1);
      const body = src.slice(i + 1, end);
      const asHtml = followsTemplateKey(out);
      push('str', '`');
      if (asHtml) out.push(...tokenizeHtml(body));
      else push('str', body);
      if (end < src.length) push('str', '`');
      i = Math.min(end + 1, src.length);
      continue;
    }
    if ((m = /^\/\/[^\n]*/.exec(rest)) || (m = /^\/\*[\s\S]*?\*\//.exec(rest))) push('com', m[0]);
    else if ((m = /^'(?:\\.|[^'\\\n])*'|^"(?:\\.|[^"\\\n])*"/.exec(rest))) push('str', m[0]);
    else if ((m = /^\d+(?:\.\d+)?/.exec(rest))) push('num', m[0]);
    else if ((m = /^@?[A-Za-z_$][\w$]*/.exec(rest))) {
      push(m[0].startsWith('@') || TS_KEYWORDS.has(m[0]) ? 'kw' : 'plain', m[0]);
    } else if ((m = /^\s+/.exec(rest))) push('plain', m[0]);
    else {
      m = [rest[0]];
      push('punc', m[0]);
    }
    i += m[0].length;
  }
  return out;
}

export function toLines(tokens) {
  const lines = [[]];
  for (const { t, v } of tokens) {
    v.split('\n').forEach((part, idx) => {
      if (idx > 0) lines.push([]);
      if (!part) return;
      const line = lines[lines.length - 1];
      const prev = line[line.length - 1];
      if (prev && prev.t === t) prev.v += part;
      else line.push({ t, v: part });
    });
  }
  return lines;
}

export function tokenize(source, lang) {
  const src = source.replace(/\n$/, '');
  return toLines(lang === 'html' ? tokenizeHtml(src) : tokenizeTs(src));
}
```

- [ ] **Step 4: Run the tests**

Run: `npm run test:scripts`
Expected: all `tokenize` tests PASS, and the existing calver specs still PASS.

If the first test fails only on how whitespace and identifiers merge, check the expected arrays against the `toLines` merge rule: adjacent `plain` tokens merge, so ` size ` becomes one token. Fix the implementation, not the expectation, unless the expectation contradicts that rule.

- [ ] **Step 5: Commit**

```bash
npx prettier --write projects/docs/scripts vitest.scripts.config.mjs
git add projects/docs/scripts/tokenize.mjs projects/docs/scripts/tokenize.spec.mjs vitest.scripts.config.mjs
git commit -m "feat(docs): add build-time TS/HTML syntax tokenizer

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: API extractor (`extract-api.mjs`)

**Files:**
- Create:
  - `projects/docs/src/content/api-types.ts`
  - `projects/docs/scripts/extract-api.mjs`
  - `projects/docs/scripts/extract-api.spec.mjs`
  - `projects/docs/scripts/__fixtures__/lib/demo-group/src/public-api.ts`
  - `projects/docs/scripts/__fixtures__/lib/demo-group/src/fixture-card.ts`
  - `projects/docs/scripts/__fixtures__/lib/demo-group/src/fixture-card.html`
  - `projects/docs/scripts/__fixtures__/lib/demo-group/src/fixture.types.ts`
  - `projects/docs/scripts/__fixtures__/lib/demo-group/src/fixture-tip.ts`
  - `projects/docs/scripts/__fixtures__/lib/demo-group/src/fixture.service.ts`
- Modify:
  - `projects/docs/project.json` (add the `extract-api` target and wire `dependsOn`)

**Interfaces:**
- Produces:
  - `content/api-types.ts`: `ApiMember`, `ApiMethod`, `ApiClass`, `ApiIndex` (exact definitions below).
  - `extractApi(entries: { group: string; file: string }[]): ApiIndex`
  - `jsdocCoverage(api: ApiIndex): { documented: number; total: number }`
  - `renderModule(api: ApiIndex): string`
  - A generated file `projects/docs/src/generated/api.ts` exporting `export const API: ApiIndex`.
  - The CLI `node projects/docs/scripts/extract-api.mjs [--print-classes]`. With `--print-classes`, it prints a JSON array of every class name and does not write the file.

- [ ] **Step 1: Create the types**

`projects/docs/src/content/api-types.ts`:
```ts
export type ApiMemberKind = 'input' | 'output' | 'model';

export interface ApiMember {
  /** Public binding name (alias if one is declared). */
  name: string;
  kind: ApiMemberKind;
  type: string;
  default?: string;
  required: boolean;
  transform?: string;
  description?: string;
  /** Present when the member carries `@deprecated`; holds the tag text (may be empty). */
  deprecated?: string;
}

export interface ApiMethod {
  name: string;
  signature: string;
  description?: string;
}

export interface ApiClass {
  name: string;
  group: string;
  kind: 'component' | 'directive' | 'service';
  selector?: string;
  providedIn?: string;
  members: ApiMember[];
  methods: ApiMethod[];
  parts: string[];
}

export type ApiIndex = Record<string, ApiClass>;
```

- [ ] **Step 2: Create the fixtures**

`__fixtures__/lib/demo-group/src/fixture.types.ts`:
```ts
export type FixtureSize = 'sm' | 'md' | 'lg';
```

`__fixtures__/lib/demo-group/src/fixture-card.html`:
```html
<div part="body header">x</div>
<span part="footer"></span>
```

`__fixtures__/lib/demo-group/src/fixture-card.ts`:
```ts
import { Component, booleanAttribute, input, model, output } from '@angular/core';
import type { FixtureSize } from './fixture.types';

@Component({
  selector: 'mui-fixture-card',
  templateUrl: './fixture-card.html',
  host: { '[attr.part]': '"root"' },
})
export class FixtureCard {
  /** Visual size of the card. */
  size = input<FixtureSize>('md');
  /** Whether the card is disabled. */
  disabled = input(false, { transform: booleanAttribute });
  heading = input<string>();
  /** Unique key. */
  key = input.required<string>();
  /** @deprecated Use `size` instead. */
  compact = input(false, { alias: 'dense', transform: booleanAttribute });
  /** Open state. */
  open = model(false);
  /** Emits on press. */
  readonly pressed = output<MouseEvent>();
  protected readonly internal = 1;
}
```

`__fixtures__/lib/demo-group/src/fixture-tip.ts`:
```ts
import { Directive, input } from '@angular/core';

@Directive({ selector: '[muiFixtureTip]' })
export class FixtureTip {
  muiFixtureTip = input.required<string>();
}
```

`__fixtures__/lib/demo-group/src/fixture.service.ts`:
```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FixtureService {
  /** Shows a message. */
  show(message: string, duration = 3000): number {
    return duration + message.length;
  }

  private hidden(): void {
    return;
  }

  _internal(): void {
    this.hidden();
  }
}
```

`__fixtures__/lib/demo-group/src/public-api.ts`:
```ts
export { FixtureCard } from './fixture-card';
export { FixtureTip } from './fixture-tip';
export { FixtureService } from './fixture.service';
export type { FixtureSize } from './fixture.types';
export const FIXTURE_TOKEN = 1;
```

- [ ] **Step 3: Write the failing tests**

`projects/docs/scripts/extract-api.spec.mjs`:
```js
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { extractApi, jsdocCoverage, renderModule } from './extract-api.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const entry = resolve(here, '__fixtures__/lib/demo-group/src/public-api.ts');

describe('extractApi', () => {
  let api;
  const member = (name) => api.FixtureCard.members.find((m) => m.name === name);

  beforeAll(() => {
    api = extractApi([{ group: 'demo-group', file: entry }]);
  });

  it('indexes decorated classes only', () => {
    expect(Object.keys(api).sort()).toEqual(['FixtureCard', 'FixtureService', 'FixtureTip']);
  });

  it('reads component metadata', () => {
    expect(api.FixtureCard).toMatchObject({
      name: 'FixtureCard',
      group: 'demo-group',
      kind: 'component',
      selector: 'mui-fixture-card',
    });
  });

  it('expands literal unions and reads defaults and JSDoc', () => {
    expect(member('size')).toEqual({
      name: 'size',
      kind: 'input',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      required: false,
      description: 'Visual size of the card.',
    });
  });

  it('reports boolean transform inputs as boolean', () => {
    expect(member('disabled')).toMatchObject({
      type: 'boolean',
      default: 'false',
      transform: 'booleanAttribute',
    });
  });

  it('keeps optional inputs without a default', () => {
    expect(member('heading')).toEqual({
      name: 'heading',
      kind: 'input',
      type: 'string | undefined',
      required: false,
    });
  });

  it('marks required inputs', () => {
    expect(member('key')).toMatchObject({ required: true, type: 'string' });
    expect(member('key').default).toBeUndefined();
  });

  it('uses the alias as the public name and reads @deprecated', () => {
    expect(member('compact')).toBeUndefined();
    expect(member('dense')).toMatchObject({ deprecated: 'Use `size` instead.' });
  });

  it('extracts models and outputs', () => {
    expect(member('open')).toMatchObject({ kind: 'model', type: 'boolean', default: 'false' });
    expect(member('pressed')).toMatchObject({ kind: 'output', type: 'MouseEvent' });
  });

  it('ignores non-signal properties', () => {
    expect(member('internal')).toBeUndefined();
  });

  it('collects CSS parts from the host and template, sorted and unique', () => {
    expect(api.FixtureCard.parts).toEqual(['body', 'footer', 'header', 'root']);
  });

  it('handles directives', () => {
    expect(api.FixtureTip).toMatchObject({ kind: 'directive', selector: '[muiFixtureTip]' });
    expect(api.FixtureTip.members[0]).toMatchObject({ name: 'muiFixtureTip', required: true });
  });

  it('lists public service methods only', () => {
    expect(api.FixtureService).toMatchObject({ kind: 'service', providedIn: 'root' });
    expect(api.FixtureService.methods).toHaveLength(1);
    expect(api.FixtureService.methods[0].name).toBe('show');
    expect(api.FixtureService.methods[0].signature).toMatch(
      /^\(message: string, duration\?: number\)(: | => )number$/,
    );
    expect(api.FixtureService.methods[0].description).toBe('Shows a message.');
  });

  it('computes JSDoc coverage over inputs, outputs and models', () => {
    expect(jsdocCoverage(api)).toEqual({ documented: 5, total: 8 });
  });

  it('renders a typed TS module', () => {
    const mod = renderModule(api);
    expect(mod).toContain("import type { ApiIndex } from '../content/api-types';");
    expect(mod).toContain('export const API: ApiIndex = {');
    expect(mod).toContain('"FixtureCard"');
  });
});
```

Run: `npm run test:scripts`
Expected: FAIL, because `./extract-api.mjs` is not found.

- [ ] **Step 4: Implement `projects/docs/scripts/extract-api.mjs`**

```js
// Extracts the public signal API (input/output/model), service methods and CSS parts
// from the library's group entry points. Output: projects/docs/src/generated/api.ts
// Usage: node projects/docs/scripts/extract-api.mjs [--print-classes]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

export const GROUPS = [
  'primitives', 'forms', 'layout', 'navigation',
  'feedback', 'data-display', 'mobile', 'overlays',
];

const SIGNAL_FNS = { input: 'input', output: 'output', model: 'model' };

function decoratorInfo(node) {
  for (const dec of ts.getDecorators(node) ?? []) {
    const call = dec.expression;
    if (!ts.isCallExpression(call) || !ts.isIdentifier(call.expression)) continue;
    const name = call.expression.text;
    if (name !== 'Component' && name !== 'Directive' && name !== 'Injectable') continue;
    const arg = call.arguments[0];
    const props = arg && ts.isObjectLiteralExpression(arg) ? arg.properties : [];
    return { name, props };
  }
  return undefined;
}

function stringProp(props, key) {
  for (const p of props) {
    if (ts.isPropertyAssignment(p) && p.name.getText() === key && ts.isStringLiteralLike(p.initializer)) {
      return p.initializer.text;
    }
  }
  return undefined;
}

function hostParts(props) {
  const parts = [];
  for (const p of props) {
    if (!ts.isPropertyAssignment(p) || p.name.getText() !== 'host') continue;
    if (!ts.isObjectLiteralExpression(p.initializer)) continue;
    for (const hp of p.initializer.properties) {
      if (!ts.isPropertyAssignment(hp) || !ts.isStringLiteralLike(hp.name)) continue;
      if (hp.name.text !== '[attr.part]' || !ts.isStringLiteralLike(hp.initializer)) continue;
      const m = /^["'](.+)["']$/.exec(hp.initializer.text);
      if (m) parts.push(...m[1].split(/\s+/));
    }
  }
  return parts;
}

function templateParts(props, sourceFile) {
  let html = stringProp(props, 'template') ?? '';
  const url = stringProp(props, 'templateUrl');
  if (url) {
    const file = resolve(dirname(sourceFile.fileName), url);
    if (existsSync(file)) html = readFileSync(file, 'utf8');
  }
  const parts = [];
  for (const m of html.matchAll(/\bpart="([^"]+)"/g)) parts.push(...m[1].trim().split(/\s+/));
  return parts;
}

function signalCall(init) {
  if (!init || !ts.isCallExpression(init)) return undefined;
  const callee = init.expression;
  if (ts.isIdentifier(callee) && SIGNAL_FNS[callee.text]) {
    return { kind: SIGNAL_FNS[callee.text], required: false, call: init };
  }
  if (
    ts.isPropertyAccessExpression(callee) &&
    ts.isIdentifier(callee.expression) &&
    (callee.expression.text === 'input' || callee.expression.text === 'model') &&
    callee.name.text === 'required'
  ) {
    return { kind: callee.expression.text, required: true, call: init };
  }
  return undefined;
}

function optionsArg(sig) {
  const { kind, required, call } = sig;
  const idx = kind === 'output' || required ? 0 : 1;
  const arg = call.arguments[idx];
  return arg && ts.isObjectLiteralExpression(arg) ? arg : undefined;
}

function optionValue(obj, key) {
  if (!obj) return undefined;
  for (const p of obj.properties) {
    if (ts.isPropertyAssignment(p) && p.name.getText() === key) {
      return ts.isStringLiteralLike(p.initializer) ? p.initializer.text : p.initializer.getText();
    }
  }
  return undefined;
}

function isLiteral(t) {
  return Boolean(t.flags & (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral | ts.TypeFlags.BooleanLiteral));
}

function printType(checker, t) {
  if (t.isUnion()) {
    const nullish = t.types.filter((m) => m.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null));
    const rest = t.types.filter((m) => !nullish.includes(m));
    if (rest.length > 0 && rest.every(isLiteral)) {
      const names = rest.map((m) => checker.typeToString(m).replace(/^"(.*)"$/, "'$1'"));
      const hasTrue = names.includes('true');
      const hasFalse = names.includes('false');
      const merged =
        hasTrue && hasFalse
          ? ['boolean', ...names.filter((n) => n !== 'true' && n !== 'false')]
          : names;
      return [...merged, ...nullish.map((m) => checker.typeToString(m))].join(' | ');
    }
  }
  return checker.typeToString(t, undefined, ts.TypeFormatFlags.NoTruncation);
}

function valueType(checker, prop) {
  const t = checker.getTypeAtLocation(prop.name);
  const args = t.flags & ts.TypeFlags.Object ? checker.getTypeArguments(t) : [];
  return printType(checker, args[0] ?? t);
}

function jsdoc(checker, node) {
  const sym = node.name ? checker.getSymbolAtLocation(node.name) : undefined;
  const description = sym ? ts.displayPartsToString(sym.getDocumentationComment(checker)).trim() : '';
  const dep = ts.getJSDocTags(node).find((tag) => tag.tagName.text === 'deprecated');
  const deprecated = dep ? (ts.getTextOfJSDocComment(dep.comment) ?? '').trim() : undefined;
  return { description: description || undefined, deprecated };
}

function extractMember(checker, prop) {
  const sig = signalCall(prop.initializer);
  if (!sig) return undefined;
  const opts = optionsArg(sig);
  const first = sig.call.arguments[0];
  const { description, deprecated } = jsdoc(checker, prop);
  const member = {
    name: optionValue(opts, 'alias') ?? prop.name.getText(),
    kind: sig.kind,
    type: valueType(checker, prop),
    required: sig.required,
  };
  if (sig.kind !== 'output' && !sig.required && first && !ts.isObjectLiteralExpression(first)) {
    member.default = first.getText();
  }
  const transform = optionValue(opts, 'transform');
  if (transform) member.transform = transform;
  if (description) member.description = description;
  if (deprecated !== undefined) member.deprecated = deprecated;
  return member;
}

function isPublicMethod(m) {
  const mods = ts.getModifiers(m) ?? [];
  const hidden = mods.some(
    (x) => x.kind === ts.SyntaxKind.PrivateKeyword || x.kind === ts.SyntaxKind.ProtectedKeyword,
  );
  return !hidden && !m.name.getText().startsWith('_') && !m.name.getText().startsWith('#');
}

function extractClass(checker, node, group) {
  const info = decoratorInfo(node);
  if (!info || !node.name) return undefined;
  const kind = info.name === 'Component' ? 'component' : info.name === 'Directive' ? 'directive' : 'service';
  const cls = { name: node.name.text, group, kind, members: [], methods: [], parts: [] };
  const selector = stringProp(info.props, 'selector');
  const providedIn = stringProp(info.props, 'providedIn');
  if (selector) cls.selector = selector;
  if (providedIn) cls.providedIn = providedIn;

  for (const el of node.members) {
    if (ts.isPropertyDeclaration(el)) {
      const member = extractMember(checker, el);
      if (member) cls.members.push(member);
    } else if (kind === 'service' && ts.isMethodDeclaration(el) && isPublicMethod(el)) {
      const signature = checker.signatureToString(checker.getSignatureFromDeclaration(el));
      const { description } = jsdoc(checker, el);
      cls.methods.push({ name: el.name.getText(), signature, ...(description ? { description } : {}) });
    }
  }
  cls.parts = [...new Set([...hostParts(info.props), ...templateParts(info.props, node.getSourceFile())])].sort();
  return cls;
}

export function extractApi(entries) {
  const program = ts.createProgram(
    entries.map((e) => e.file),
    {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.Preserve,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      experimentalDecorators: true,
      strict: true,
      skipLibCheck: true,
      noEmit: true,
    },
  );
  const checker = program.getTypeChecker();
  const api = {};
  for (const { group, file } of entries) {
    const source = program.getSourceFile(file);
    const moduleSym = source && checker.getSymbolAtLocation(source);
    if (!moduleSym) throw new Error(`Cannot load entry point ${file}`);
    for (const exp of checker.getExportsOfModule(moduleSym)) {
      const sym = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
      const decl = sym.declarations?.find(ts.isClassDeclaration);
      if (!decl) continue;
      const cls = extractClass(checker, decl, group);
      if (cls) api[cls.name] = cls;
    }
  }
  return api;
}

export function jsdocCoverage(api) {
  let documented = 0;
  let total = 0;
  for (const cls of Object.values(api)) {
    for (const m of cls.members) {
      total++;
      if (m.description) documented++;
    }
  }
  return { documented, total };
}

export function renderModule(api) {
  return [
    '// AUTO-GENERATED by projects/docs/scripts/extract-api.mjs — do not edit.',
    "import type { ApiIndex } from '../content/api-types';",
    '',
    `export const API: ApiIndex = ${JSON.stringify(api, null, 2)};`,
    '',
  ].join('\n');
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
  const entries = GROUPS.map((group) => ({
    group,
    file: resolve(root, `projects/ui/src/lib/${group}/src/public-api.ts`),
  }));
  const api = extractApi(entries);
  if (process.argv.includes('--print-classes')) {
    console.log(JSON.stringify(Object.keys(api).sort(), null, 2));
    return;
  }
  const out = resolve(root, 'projects/docs/src/generated/api.ts');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, renderModule(api));
  const { documented, total } = jsdocCoverage(api);
  console.log(`extract-api: ${Object.keys(api).length} classes → ${out}`);
  console.log(`JSDoc coverage: ${documented}/${total} members documented`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
```

- [ ] **Step 5: Run the tests**

Run: `npm run test:scripts`
Expected: all `extractApi` tests PASS.

If the `size` type prints as `FixtureSize`, `t.isUnion()` is being called on the signal wrapper rather than on its type argument. Check that `valueType` passes `args[0]` into `printType`.

- [ ] **Step 6: Wire the Nx target and generate**

In `projects/docs/project.json`, add this target:
```json
"extract-api": {
  "executor": "nx:run-commands",
  "cache": true,
  "inputs": [
    "{workspaceRoot}/projects/ui/src/lib/**/*.ts",
    "{workspaceRoot}/projects/ui/src/lib/**/*.html",
    "!{workspaceRoot}/projects/ui/src/lib/**/*.spec.ts",
    "!{workspaceRoot}/projects/ui/src/lib/**/*.stories.ts",
    "{projectRoot}/scripts/extract-api.mjs"
  ],
  "outputs": ["{projectRoot}/src/generated/api.ts"],
  "options": { "command": "node projects/docs/scripts/extract-api.mjs" }
}
```
Set `"dependsOn": ["extract-api"]` on both `build` and `test`, and add `"dependsOn": ["extract-api"]` to `serve`.

Run: `npx nx run docs:extract-api`
Expected:
- It prints `extract-api: N classes` (N ≥ 55) and a `JSDoc coverage:` line.
- `projects/docs/src/generated/api.ts` exists.
- `git status` does not list it, because it is ignored.

Spot-check: `grep -n '"Button"' -A30 projects/docs/src/generated/api.ts`. You should see `variant` with type `'primary' | 'secondary' | 'ghost' | 'destructive'` and `clicked` as an output of type `MouseEvent`.

- [ ] **Step 7: Commit**

```bash
npx prettier --write projects/docs/scripts projects/docs/src/content projects/docs/project.json
git add projects/docs/scripts projects/docs/src/content/api-types.ts projects/docs/project.json
git commit -m "feat(docs): extract signal API from library source at build time

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Demo collector (`collect-demos.mjs`)

**Files:**
- Create:
  - `projects/docs/src/content/code-types.ts`
  - `projects/docs/scripts/collect-demos.mjs`
  - `projects/docs/scripts/collect-demos.spec.mjs`
  - `projects/docs/scripts/__fixtures__/content/components/alpha/demos/alpha-basic.demo.ts`
  - `projects/docs/scripts/__fixtures__/content/components/beta/demos/beta-basic.demo.ts`
- Modify:
  - `projects/docs/project.json`

**Interfaces:**
- Consumes: `tokenize(source, 'ts')` from Task 2.
- Produces:
  - `content/code-types.ts`: `TokenKind`, `CodeToken`, `CodeLines`, `DemoSource`, `DemoSourceIndex` (exact definitions below).
  - `collectDemos(contentDir: string): DemoSourceIndex`. Keys are the file name without `.demo.ts`. It throws on a duplicate id.
  - `renderModule(index): string`
  - A generated file `projects/docs/src/generated/demo-sources.ts` exporting `export const DEMO_SOURCES: DemoSourceIndex`.

- [ ] **Step 1: Create the types**

`projects/docs/src/content/code-types.ts`:
```ts
export type TokenKind = 'kw' | 'str' | 'com' | 'num' | 'tag' | 'attr' | 'punc' | 'plain';

export interface CodeToken {
  t: TokenKind;
  v: string;
}

export type CodeLines = CodeToken[][];

export interface DemoSource {
  source: string;
  lines: CodeLines;
}

export type DemoSourceIndex = Record<string, DemoSource>;
```

- [ ] **Step 2: Create the fixtures**

`__fixtures__/content/components/alpha/demos/alpha-basic.demo.ts`:
```ts
export const alpha = 1;
```

`__fixtures__/content/components/beta/demos/beta-basic.demo.ts`:
```ts
export const beta = 2;
```

- [ ] **Step 3: Write the failing tests**

`projects/docs/scripts/collect-demos.spec.mjs`:
```js
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { collectDemos, renderModule } from './collect-demos.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureDir = resolve(here, '__fixtures__/content');

describe('collectDemos', () => {
  it('indexes every *.demo.ts by file name with raw and tokenized source', () => {
    const index = collectDemos(fixtureDir);
    expect(Object.keys(index).sort()).toEqual(['alpha-basic', 'beta-basic']);
    expect(index['alpha-basic'].source).toBe('export const alpha = 1;\n');
    expect(index['alpha-basic'].lines[0][0]).toEqual({ t: 'kw', v: 'export' });
  });

  it('throws on duplicate demo ids', () => {
    const dir = mkdtempSync(join(tmpdir(), 'demos-'));
    for (const sub of ['a/demos', 'b/demos']) {
      mkdirSync(join(dir, sub), { recursive: true });
      writeFileSync(join(dir, sub, 'same.demo.ts'), 'export {};\n');
    }
    expect(() => collectDemos(dir)).toThrow(/Duplicate demo id "same"/);
  });

  it('renders a typed TS module', () => {
    const mod = renderModule(collectDemos(fixtureDir));
    expect(mod).toContain("import type { DemoSourceIndex } from '../content/code-types';");
    expect(mod).toContain('export const DEMO_SOURCES: DemoSourceIndex = {');
  });
});
```

Run: `npm run test:scripts`
Expected: FAIL, because the module is not found.

- [ ] **Step 4: Implement `projects/docs/scripts/collect-demos.mjs`**

```js
// Collects every content/**/demos/*.demo.ts file, with raw and tokenized source,
// into projects/docs/src/generated/demo-sources.ts. The docs page shows exactly this code.
// Usage: node projects/docs/scripts/collect-demos.mjs
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tokenize } from './tokenize.mjs';

export function collectDemos(contentDir) {
  const index = {};
  const files = readdirSync(contentDir, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.demo.ts') && basename(dirname(f)) === 'demos')
    .sort();
  for (const rel of files) {
    const id = basename(rel, '.demo.ts');
    if (index[id]) throw new Error(`Duplicate demo id "${id}" (${rel})`);
    const source = readFileSync(join(contentDir, rel), 'utf8');
    index[id] = { source, lines: tokenize(source, 'ts') };
  }
  return index;
}

export function renderModule(index) {
  return [
    '// AUTO-GENERATED by projects/docs/scripts/collect-demos.mjs — do not edit.',
    "import type { DemoSourceIndex } from '../content/code-types';",
    '',
    `export const DEMO_SOURCES: DemoSourceIndex = ${JSON.stringify(index)};`,
    '',
  ].join('\n');
}

function main() {
  const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const index = collectDemos(resolve(docsRoot, 'src/content'));
  const out = resolve(docsRoot, 'src/generated/demo-sources.ts');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, renderModule(index));
  console.log(`collect-demos: ${Object.keys(index).length} demos → ${out}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
```

- [ ] **Step 5: Run the tests**

Run: `npm run test:scripts`
Expected: PASS.

- [ ] **Step 6: Wire the Nx target**

Add this target to `projects/docs/project.json`:
```json
"collect-demos": {
  "executor": "nx:run-commands",
  "cache": true,
  "inputs": [
    "{projectRoot}/src/content/**/*.demo.ts",
    "{projectRoot}/scripts/collect-demos.mjs",
    "{projectRoot}/scripts/tokenize.mjs"
  ],
  "outputs": ["{projectRoot}/src/generated/demo-sources.ts"],
  "options": { "command": "node projects/docs/scripts/collect-demos.mjs" }
}
```
Change `dependsOn` on `build`, `serve`, and `test` to `["extract-api", "collect-demos"]`.

Run: `npx nx run docs:collect-demos`
Expected: `collect-demos: 0 demos → …`, and the file is created.

- [ ] **Step 7: Commit**

```bash
npx prettier --write projects/docs/scripts projects/docs/src/content projects/docs/project.json
git add projects/docs/scripts projects/docs/src/content/code-types.ts projects/docs/project.json
git commit -m "feat(docs): collect demo sources with pre-tokenized highlighting

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Content model, registry, injection tokens, inline text, consistency spec

**Files:**
- Create:
  - `projects/docs/src/content/types.ts`
  - `projects/docs/src/content/groups.ts`
  - `projects/docs/src/content/registry.ts`
  - `projects/docs/src/content/tokens.ts`
  - `projects/docs/src/content/undocumented.json`
  - `projects/docs/src/content/registry.spec.ts`
  - `projects/docs/src/app/shared/inline-text/parse-inline.ts`
  - `projects/docs/src/app/shared/inline-text/parse-inline.spec.ts`
  - `projects/docs/src/app/shared/inline-text/inline-text.ts`
  - `projects/docs/src/app/shared/inline-text/inline-text.spec.ts`
- Modify:
  - `projects/docs/tsconfig.app.json` (add `"resolveJsonModule": true`)

**Interfaces:**
- Consumes:
  - `API` from `generated/api.ts`
  - `DEMO_SOURCES` from `generated/demo-sources.ts`
- Produces:
  - `Group`, `DemoRef`, `ComponentDoc`, `RegistryEntry` (in `types.ts`)
  - `GROUPS: readonly GroupInfo[]` and `groupInfo(id: Group): GroupInfo` (in `groups.ts`), where `GroupInfo = { id: Group; label: string; entry: string; description: string }`
  - `REGISTRY: readonly RegistryEntry[]` and `findEntry(slug: string, registry?: readonly RegistryEntry[]): RegistryEntry | undefined` (in `registry.ts`)
  - The injection tokens `DOCS_REGISTRY`, `API_INDEX`, and `DEMO_SOURCE_INDEX` (in `tokens.ts`)
  - `parseInline(text: string): InlineSegment[]`
  - The `InlineText` component (`docs-inline-text`, input `text: string`)

- [ ] **Step 1: Create the types**

`projects/docs/src/content/types.ts`:
```ts
import type { Type } from '@angular/core';

export type Group =
  | 'primitives'
  | 'forms'
  | 'layout'
  | 'navigation'
  | 'feedback'
  | 'data-display'
  | 'mobile'
  | 'overlays';

export interface DemoRef {
  /** Matches the demo file name: `<id>.demo.ts`. */
  id: string;
  title: string;
  description?: string;
  component: () => Promise<Type<unknown>>;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  group: Group;
  selector: string;
  /** Keys into the generated API index. */
  apiClasses: string[];
  summary: string;
  description: string[];
  whenToUse: string[];
  whenNotToUse: { text: string; alternative?: string }[];
  /** The first entry is the hero demo. */
  demos: DemoRef[];
  guidelines?: { do: string[]; dont: string[] };
  a11y: {
    roles: { element: string; role: string; notes?: string }[];
    keyboard: { keys: string; action: string }[];
    notes: string[];
  };
  tokens?: string[];
  related?: string[];
}

export interface RegistryEntry {
  slug: string;
  name: string;
  group: Group;
  summary: string;
  load: () => Promise<ComponentDoc>;
}
```

- [ ] **Step 2: Create the groups, registry, and tokens**

`projects/docs/src/content/groups.ts`:
```ts
import type { Group } from './types';

export interface GroupInfo {
  id: Group;
  label: string;
  entry: string;
  description: string;
}

export const GROUPS: readonly GroupInfo[] = [
  { id: 'primitives', label: 'Primitives', entry: '@mushilu-san/ui/primitives', description: 'Buttons, icons, badges and other building blocks.' },
  { id: 'forms', label: 'Forms', entry: '@mushilu-san/ui/forms', description: 'Inputs and controls with ControlValueAccessor support.' },
  { id: 'layout', label: 'Layout', entry: '@mushilu-san/ui/layout', description: 'Containers, stacks, grids and app structure.' },
  { id: 'navigation', label: 'Navigation', entry: '@mushilu-san/ui/navigation', description: 'Tabs, breadcrumbs, menus and pagination.' },
  { id: 'feedback', label: 'Feedback', entry: '@mushilu-san/ui/feedback', description: 'Alerts, dialogs, sheets, toasts and progress.' },
  { id: 'data-display', label: 'Data display', entry: '@mushilu-san/ui/data-display', description: 'Cards, tables, charts and typography.' },
  { id: 'mobile', label: 'Mobile', entry: '@mushilu-san/ui/mobile', description: 'Touch-first patterns: bottom sheets, FABs, swipe actions.' },
  { id: 'overlays', label: 'Overlays', entry: '@mushilu-san/ui/overlays', description: 'Popovers, menus, command palette and combobox.' },
];

export function groupInfo(id: Group): GroupInfo {
  const info = GROUPS.find((g) => g.id === id);
  if (!info) throw new Error(`Unknown group "${id}"`);
  return info;
}
```

`projects/docs/src/content/registry.ts` starts empty. Tasks 12–14 add the entries.
```ts
import type { RegistryEntry } from './types';

export const REGISTRY: readonly RegistryEntry[] = [];

export function findEntry(
  slug: string,
  registry: readonly RegistryEntry[] = REGISTRY,
): RegistryEntry | undefined {
  return registry.find((e) => e.slug === slug);
}
```

`projects/docs/src/content/tokens.ts`:
```ts
import { InjectionToken } from '@angular/core';
import { API } from '../generated/api';
import { DEMO_SOURCES } from '../generated/demo-sources';
import type { ApiIndex } from './api-types';
import type { DemoSourceIndex } from './code-types';
import { REGISTRY } from './registry';
import type { RegistryEntry } from './types';

/** Indirection so specs can provide fixture data instead of the generated indexes. */
export const DOCS_REGISTRY = new InjectionToken<readonly RegistryEntry[]>('DOCS_REGISTRY', {
  providedIn: 'root',
  factory: () => REGISTRY,
});

export const API_INDEX = new InjectionToken<ApiIndex>('API_INDEX', {
  providedIn: 'root',
  factory: () => API,
});

export const DEMO_SOURCE_INDEX = new InjectionToken<DemoSourceIndex>('DEMO_SOURCE_INDEX', {
  providedIn: 'root',
  factory: () => DEMO_SOURCES,
});
```

- [ ] **Step 3: Seed `undocumented.json`**

In `projects/docs/tsconfig.app.json` `compilerOptions`, add `"resolveJsonModule": true`.

Run:
```bash
node projects/docs/scripts/extract-api.mjs --print-classes > projects/docs/src/content/undocumented.json
```
Expected: a JSON array of every class name (≥ 55 entries) that includes `"Button"`, `"Dialog"`, `"Tabs"`, `"TabList"`, `"Tab"`, `"TabPanel"`. Tasks 12–14 remove entries as each page is written.

- [ ] **Step 4: Write the failing tests for `parseInline`**

`projects/docs/src/app/shared/inline-text/parse-inline.spec.ts`:
```ts
import { parseInline } from './parse-inline';

describe('parseInline', () => {
  it('returns a single text segment for plain text', () => {
    expect(parseInline('Hello')).toEqual([{ kind: 'text', value: 'Hello' }]);
  });

  it('parses code and links in order', () => {
    expect(parseInline('Use `muiButton` or see [Dialog](dialog).')).toEqual([
      { kind: 'text', value: 'Use ' },
      { kind: 'code', value: 'muiButton' },
      { kind: 'text', value: ' or see ' },
      { kind: 'link', value: 'Dialog', slug: 'dialog' },
      { kind: 'text', value: '.' },
    ]);
  });

  it('leaves malformed markup as text', () => {
    expect(parseInline('a `b and [c](Not A Slug)')).toEqual([
      { kind: 'text', value: 'a `b and [c](Not A Slug)' },
    ]);
  });

  it('returns no segments for an empty string', () => {
    expect(parseInline('')).toEqual([]);
  });
});
```

Run: `npx nx test docs --no-watch`
Expected: FAIL, because `./parse-inline` cannot be resolved.

- [ ] **Step 5: Implement `parse-inline.ts`**

```ts
export type InlineSegment =
  | { kind: 'text'; value: string }
  | { kind: 'code'; value: string }
  | { kind: 'link'; value: string; slug: string };

const PATTERN = /`([^`]+)`|\[([^\]]+)\]\(([a-z0-9-]+)\)/g;

/** Parses the two inline forms docs content supports: `code` and [label](slug). */
export function parseInline(text: string): InlineSegment[] {
  const out: InlineSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    const index = m.index;
    if (index > last) out.push({ kind: 'text', value: text.slice(last, index) });
    const [whole, code, label, slug] = m;
    if (code !== undefined) out.push({ kind: 'code', value: code });
    else if (label !== undefined && slug !== undefined) out.push({ kind: 'link', value: label, slug });
    last = index + whole.length;
  }
  if (last < text.length) out.push({ kind: 'text', value: text.slice(last) });
  return out;
}
```

- [ ] **Step 6: Write the failing `InlineText` test**

`inline-text.spec.ts`:
```ts
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { InlineText } from './inline-text';

describe('InlineText', () => {
  it('renders code as <code> and slugs as router links to the component page', async () => {
    await render(InlineText, {
      inputs: { text: 'Apply `muiButton`; see [Tabs](tabs).' },
      providers: [provideRouter([])],
    });
    expect(screen.getByText('muiButton').tagName).toBe('CODE');
    expect(screen.getByRole('link', { name: 'Tabs' })).toHaveAttribute('href', '/components/tabs');
  });
});
```

- [ ] **Step 7: Implement `inline-text.ts`**

```ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { parseInline } from './parse-inline';

@Component({
  selector: 'docs-inline-text',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: inline;
    }
  `,
  template: `
    @for (seg of segments(); track $index) {
      @switch (seg.kind) {
        @case ('code') {
          <code>{{ seg.value }}</code>
        }
        @case ('link') {
          <a [routerLink]="['/components', seg.slug]">{{ seg.value }}</a>
        }
        @default {
          {{ seg.value }}
        }
      }
    }
  `,
})
export class InlineText {
  readonly text = input.required<string>();
  protected readonly segments = computed(() => parseInline(this.text()));
}
```

Run: `npx nx test docs --no-watch`
Expected: PASS. If TS complains that `seg.slug` doesn't exist inside `@case ('link')`, replace `@switch` with `@if (seg.kind === 'code') {…} @else if (seg.kind === 'link') {…} @else {…}`, which narrows the union.

- [ ] **Step 8: Write the registry consistency spec**

`projects/docs/src/content/registry.spec.ts`:
```ts
import { API } from '../generated/api';
import { DEMO_SOURCES } from '../generated/demo-sources';
import { parseInline } from '../app/shared/inline-text/parse-inline';
import { GROUPS } from './groups';
import { REGISTRY } from './registry';
import type { ComponentDoc } from './types';
import undocumented from './undocumented.json';

function allStrings(doc: ComponentDoc): string[] {
  return [
    doc.summary,
    ...doc.description,
    ...doc.whenToUse,
    ...doc.whenNotToUse.map((w) => w.text),
    ...doc.demos.flatMap((d) => [d.title, d.description ?? '']),
    ...(doc.guidelines ? [...doc.guidelines.do, ...doc.guidelines.dont] : []),
    ...doc.a11y.notes,
    ...doc.a11y.roles.map((r) => r.notes ?? ''),
    ...doc.a11y.keyboard.map((k) => k.action),
  ];
}

describe('docs registry consistency', () => {
  let docs: ComponentDoc[] = [];
  const slugs = new Set(REGISTRY.map((e) => e.slug));

  beforeAll(async () => {
    docs = await Promise.all(REGISTRY.map((e) => e.load()));
  });

  it('has unique slugs', () => {
    expect(slugs.size).toBe(REGISTRY.length);
  });

  it('only uses known groups', () => {
    const groupIds = new Set(GROUPS.map((g) => g.id));
    for (const e of REGISTRY) expect(groupIds.has(e.group)).toBe(true);
  });

  it('keeps registry metadata in sync with each docs file', () => {
    REGISTRY.forEach((entry, i) => {
      const doc = docs[i];
      expect(doc).toBeDefined();
      expect({ slug: doc?.slug, name: doc?.name, group: doc?.group, summary: doc?.summary }).toEqual({
        slug: entry.slug,
        name: entry.name,
        group: entry.group,
        summary: entry.summary,
      });
    });
  });

  it('references only API classes that exist', () => {
    for (const doc of docs) {
      for (const cls of doc.apiClasses) expect(API[cls], `${doc.slug} → ${cls}`).toBeDefined();
    }
  });

  it('has a collected source for every demo', () => {
    for (const doc of docs) {
      expect(doc.demos.length, `${doc.slug} needs at least one demo`).toBeGreaterThan(0);
      for (const demo of doc.demos) expect(DEMO_SOURCES[demo.id], demo.id).toBeDefined();
    }
  });

  it('links only to documented slugs', () => {
    for (const doc of docs) {
      const targets = [
        ...doc.whenNotToUse.flatMap((w) => (w.alternative ? [w.alternative] : [])),
        ...(doc.related ?? []),
        ...allStrings(doc).flatMap((s) =>
          parseInline(s).flatMap((seg) => (seg.kind === 'link' ? [seg.slug] : [])),
        ),
      ];
      for (const t of targets) expect(slugs.has(t), `${doc.slug} links to unknown "${t}"`).toBe(true);
    }
  });

  it('covers every exported library class exactly once (page or undocumented.json)', () => {
    const documented = new Set(docs.flatMap((d) => d.apiClasses));
    const pending = new Set<string>(undocumented);
    const overlap = [...documented].filter((c) => pending.has(c));
    const missing = Object.keys(API).filter((c) => !documented.has(c) && !pending.has(c));
    const stale = [...pending].filter((c) => !API[c]);
    expect({ overlap, missing, stale }).toEqual({ overlap: [], missing: [], stale: [] });
  });
});
```

Run: `npx nx test docs --no-watch`
Expected: PASS. All checks pass trivially with an empty registry, and the coverage check passes because `undocumented.json` lists every class.

Sanity check: temporarily delete `"Button"` from `undocumented.json`, re-run, and see the last test FAIL with `missing: ['Button']`. Then restore it.

- [ ] **Step 9: Commit**

```bash
npx prettier --write projects/docs/src
git add projects/docs/src projects/docs/tsconfig.app.json
git commit -m "feat(docs): add content model, registry, inline text and consistency checks

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Theme service and toggle

**Files:**
- Create:
  - `projects/docs/src/app/shared/theme/theme.service.ts`
  - `projects/docs/src/app/shared/theme/theme.service.spec.ts`
  - `projects/docs/src/app/shared/theme/theme-toggle.ts`
  - `projects/docs/src/app/shared/theme/theme-toggle.spec.ts`

**Interfaces:**
- Produces:
  - `ThemePreference = 'system' | 'light' | 'dark'`
  - `ThemeService` (root): `preference: Signal<ThemePreference>`, `set(p)`, `cycle()`. The storage key is `'docs-theme'`, matching `index.html`.
  - `ThemeToggle` (`docs-theme-toggle`)

- [ ] **Step 1: Write the failing service tests**

`theme.service.spec.ts`:
```ts
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  const root = () => TestBed.inject(DOCUMENT).documentElement;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });
  afterEach(() => vi.restoreAllMocks());

  it('defaults to system and leaves data-theme unset', () => {
    const svc = TestBed.inject(ThemeService);
    TestBed.tick();
    expect(svc.preference()).toBe('system');
    expect(root()).not.toHaveAttribute('data-theme');
  });

  it('restores a stored preference', () => {
    localStorage.setItem('docs-theme', 'dark');
    const svc = TestBed.inject(ThemeService);
    TestBed.tick();
    expect(svc.preference()).toBe('dark');
    expect(root()).toHaveAttribute('data-theme', 'dark');
  });

  it('cycles system → light → dark → system and persists', () => {
    const svc = TestBed.inject(ThemeService);
    svc.cycle();
    TestBed.tick();
    expect(root()).toHaveAttribute('data-theme', 'light');
    expect(localStorage.getItem('docs-theme')).toBe('light');
    svc.cycle();
    TestBed.tick();
    expect(root()).toHaveAttribute('data-theme', 'dark');
    svc.cycle();
    TestBed.tick();
    expect(root()).not.toHaveAttribute('data-theme');
    expect(localStorage.getItem('docs-theme')).toBeNull();
  });

  it('keeps working when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const svc = TestBed.inject(ThemeService);
    expect(svc.preference()).toBe('system');
    expect(() => svc.set('dark')).not.toThrow();
    TestBed.tick();
    expect(root()).toHaveAttribute('data-theme', 'dark');
  });
});
```

Run: `npx nx test docs --no-watch`
Expected: FAIL, because the module is not found.

- [ ] **Step 2: Implement `theme.service.ts`**

```ts
import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';

/** Must match the key read by the inline bootstrap script in index.html. */
const STORAGE_KEY = 'docs-theme';
const ORDER: readonly ThemePreference[] = ['system', 'light', 'dark'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly pref = signal<ThemePreference>(this.read());
  readonly preference = this.pref.asReadonly();

  constructor() {
    effect(() => this.apply(this.pref()));
  }

  set(preference: ThemePreference): void {
    this.pref.set(preference);
    this.write(preference);
  }

  cycle(): void {
    const next = ORDER[(ORDER.indexOf(this.pref()) + 1) % ORDER.length];
    if (next) this.set(next);
  }

  private storage(): Storage | null {
    try {
      return this.document.defaultView?.localStorage ?? null;
    } catch {
      return null;
    }
  }

  private read(): ThemePreference {
    try {
      const value = this.storage()?.getItem(STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : 'system';
    } catch {
      return 'system';
    }
  }

  private write(preference: ThemePreference): void {
    try {
      const storage = this.storage();
      if (!storage) return;
      if (preference === 'system') storage.removeItem(STORAGE_KEY);
      else storage.setItem(STORAGE_KEY, preference);
    } catch {
      // Storage blocked (private mode, sandbox) — the choice lasts for this page view only.
    }
  }

  private apply(preference: ThemePreference): void {
    const root = this.document.documentElement;
    if (preference === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', preference);
  }
}
```

Run: `npx nx test docs --no-watch`
Expected: PASS.

- [ ] **Step 3: Write the failing toggle test**

`theme-toggle.spec.ts`:
```ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  beforeEach(() => localStorage.clear());

  it('announces the current theme and the next one, and cycles on click', async () => {
    await render(ThemeToggle);
    const button = screen.getByRole('button', { name: 'Theme: system. Switch to light' });
    await userEvent.click(button);
    expect(screen.getByRole('button', { name: 'Theme: light. Switch to dark' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Implement `theme-toggle.ts`**

```ts
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Button } from '@mushilu-san/ui/primitives';
import { type ThemePreference, ThemeService } from './theme.service';

const NEXT: Record<ThemePreference, ThemePreference> = { system: 'light', light: 'dark', dark: 'system' };

@Component({
  selector: 'docs-theme-toggle',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    button {
      min-width: var(--mui-touch-target);
      min-height: var(--mui-touch-target);
    }
  `,
  template: `
    <button muiButton variant="ghost" type="button" [attr.aria-label]="label()" (click)="theme.cycle()">
      @switch (theme.preference()) {
        @case ('light') {
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
        }
        @case ('dark') {
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
        }
        @default {
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
        }
      }
    </button>
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly label = computed(() => {
    const current = this.theme.preference();
    return `Theme: ${current}. Switch to ${NEXT[current]}`;
  });
}
```

Run: `npx nx test docs --no-watch`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx prettier --write projects/docs/src/app/shared/theme
npx nx lint docs
git add projects/docs/src/app/shared/theme
git commit -m "feat(docs): add persisted three-state theme toggle

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Code block

**Files:**
- Create:
  - `projects/docs/src/app/shared/code-block/code-block.ts`
  - `projects/docs/src/app/shared/code-block/code-block.css`
  - `projects/docs/src/app/shared/code-block/code-block.spec.ts`

**Interfaces:**
- Consumes: `CodeLines` from `content/code-types.ts`.
- Produces:
  - `CodeBlock` (`docs-code-block`) with the inputs `lines: CodeLines` (required), `source: string` (required, the text that gets copied), and `label: string` (default `'Code'`).
  - `plainLines(text: string): CodeLines`, an exported helper for code that hasn't been tokenized.

- [ ] **Step 1: Write the failing tests**

`code-block.spec.ts`:
```ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CodeBlock, plainLines } from './code-block';

describe('CodeBlock', () => {
  const writeText = vi.fn<(text: string) => Promise<void>>();

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  });

  it('renders one span per token with its kind class', async () => {
    await render(CodeBlock, {
      inputs: { lines: [[{ t: 'kw', v: 'const' }, { t: 'plain', v: ' x' }]], source: 'const x' },
    });
    expect(screen.getByText('const')).toHaveClass('tok-kw');
  });

  it('copies the raw source and announces it', async () => {
    await render(CodeBlock, { inputs: { lines: plainLines('a\nb'), source: 'a\nb', label: 'demo.ts' } });
    await userEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(writeText).toHaveBeenCalledWith('a\nb');
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Code copied to clipboard');
  });

  it('does not claim success when the clipboard rejects', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    await render(CodeBlock, { inputs: { lines: plainLines('a'), source: 'a' } });
    await userEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('makes the scrollable code region keyboard focusable and labelled', async () => {
    await render(CodeBlock, { inputs: { lines: plainLines('a'), source: 'a', label: 'demo.ts' } });
    const region = screen.getByRole('region', { name: 'demo.ts source' });
    expect(region).toHaveAttribute('tabindex', '0');
  });

  it('plainLines splits text into one plain token per line', () => {
    expect(plainLines('a\n\nb')).toEqual([[{ t: 'plain', v: 'a' }], [], [{ t: 'plain', v: 'b' }]]);
  });
});
```

Run: `npx nx test docs --no-watch`
Expected: FAIL, because the module is not found.

- [ ] **Step 2: Implement `code-block.ts`**

```ts
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { Button } from '@mushilu-san/ui/primitives';
import type { CodeLines } from '../../../content/code-types';

export function plainLines(text: string): CodeLines {
  return text.split('\n').map((v) => (v ? [{ t: 'plain' as const, v }] : []));
}

@Component({
  selector: 'docs-code-block',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './code-block.css',
  template: `
    <div class="bar">
      <span class="label">{{ label() }}</span>
      <button
        muiButton
        variant="ghost"
        size="sm"
        type="button"
        class="copy"
        [attr.aria-label]="copied() ? 'Copied' : 'Copy code'"
        (click)="copy()"
      >
        {{ copied() ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre class="pre" role="region" tabindex="0" [attr.aria-label]="label() + ' source'"><code>@for (line of lines(); track $index) {<span class="line">@for (tok of line; track $index) {<span [class]="'tok-' + tok.t">{{ tok.v }}</span>}</span>}</code></pre>
    <span class="visually-hidden" role="status" aria-live="polite">{{ copied() ? 'Code copied to clipboard' : '' }}</span>
  `,
})
export class CodeBlock {
  readonly lines = input.required<CodeLines>();
  readonly source = input.required<string>();
  readonly label = input('Code');

  protected readonly copied = signal(false);
  private readonly document = inject(DOCUMENT);
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
  }

  protected async copy(): Promise<void> {
    const clipboard = this.document.defaultView?.navigator.clipboard;
    if (!clipboard) return;
    try {
      await clipboard.writeText(this.source());
    } catch {
      return;
    }
    this.copied.set(true);
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copied.set(false), 2000);
  }
}
```

- [ ] **Step 3: Implement `code-block.css`**

```css
:host {
  display: block;
  border: 1px solid var(--docs-code-border);
  border-radius: var(--mui-radius-md);
  background: var(--docs-code-bg);
  overflow: hidden;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--mui-space-3) var(--mui-space-1);
  border-bottom: 1px solid var(--docs-code-border);
}

.label {
  color: var(--docs-code-com);
  font-family: var(--mui-font-mono);
  font-size: var(--mui-font-size-xs);
}

.copy {
  min-height: var(--mui-touch-target);
  min-width: var(--mui-touch-target);
  color: var(--docs-code-plain);
}

.pre {
  margin: 0;
  padding: var(--mui-space-4);
  overflow-x: auto;
  font-family: var(--mui-font-mono);
  font-size: var(--mui-font-size-sm);
  line-height: 1.6;
  color: var(--docs-code-plain);
}

.pre:focus-visible {
  outline: var(--mui-focus-ring-width) solid var(--mui-color-focus-ring);
  outline-offset: calc(-1 * var(--mui-focus-ring-width));
}

.line {
  display: block;
  min-height: 1.6em;
  white-space: pre;
}

.tok-kw { color: var(--docs-code-kw); }
.tok-str { color: var(--docs-code-str); }
.tok-com { color: var(--docs-code-com); font-style: italic; }
.tok-num { color: var(--docs-code-num); }
.tok-tag { color: var(--docs-code-tag); }
.tok-attr { color: var(--docs-code-attr); }
.tok-punc { color: var(--docs-code-punc); }
.tok-plain { color: var(--docs-code-plain); }
```

- [ ] **Step 4: Run the tests**

Run: `npx nx test docs --no-watch`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx prettier --write projects/docs/src/app/shared/code-block
npx nx lint docs
git add projects/docs/src/app/shared/code-block
git commit -m "feat(docs): add syntax-highlighted code block with copy

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Demo viewer

**Files:**
- Create:
  - `projects/docs/src/app/shared/demo-viewer/demo-viewer.ts`
  - `projects/docs/src/app/shared/demo-viewer/demo-viewer.css`
  - `projects/docs/src/app/shared/demo-viewer/demo-viewer.spec.ts`

**Interfaces:**
- Consumes:
  - `DemoRef` (Task 5)
  - `DEMO_SOURCE_INDEX` (Task 5)
  - `CodeBlock` (Task 7)
  - `Tabs`, `TabList`, `Tab`, `TabPanel` from `@mushilu-san/ui/navigation`
- Produces: `DemoViewer` (`docs-demo-viewer`) with the required input `demo: DemoRef`.
  - The demo component loads in the browser only (`afterNextRender`). During prerender, the viewer shows a placeholder, so demo code never runs on the server.
  - Tab values are prefixed with the demo id (`preview-<id>`, `code-<id>`), because the library builds tab ids from those values and several viewers share a page.

- [ ] **Step 1: Write the failing tests**

`demo-viewer.spec.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { provideMushiluUi } from '@mushilu-san/ui';
import { DEMO_SOURCE_INDEX } from '../../../content/tokens';
import type { DemoRef } from '../../../content/types';
import { DemoViewer } from './demo-viewer';

@Component({
  selector: 'docs-fake-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p>fake demo body</p>',
})
class FakeDemo {}

const okDemo: DemoRef = { id: 'fake-basic', title: 'Basic', component: async () => FakeDemo };
const brokenDemo: DemoRef = {
  id: 'fake-broken',
  title: 'Broken',
  component: () => Promise.reject(new Error('chunk failed')),
};

const providers = [
  provideMushiluUi(),
  {
    provide: DEMO_SOURCE_INDEX,
    useValue: { 'fake-basic': { source: 'export class FakeDemo {}', lines: [[{ t: 'plain', v: 'export class FakeDemo {}' }]] } },
  },
];

describe('DemoViewer', () => {
  it('renders the demo component in the preview tab', async () => {
    await render(DemoViewer, { inputs: { demo: okDemo }, providers });
    expect(await screen.findByText('fake demo body')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute('aria-selected', 'true');
  });

  it('switches to the source on the Code tab', async () => {
    await render(DemoViewer, { inputs: { demo: okDemo }, providers });
    await userEvent.click(screen.getByRole('tab', { name: 'Code' }));
    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('region', { name: 'fake-basic.demo.ts source' })).toHaveTextContent(
      'export class FakeDemo {}',
    );
  });

  it('shows an alert when the demo fails to load', async () => {
    await render(DemoViewer, { inputs: { demo: brokenDemo }, providers });
    expect(await screen.findByRole('alert')).toHaveTextContent('This example failed to load.');
  });

  it('uses demo-scoped tab values so ids stay unique per page', async () => {
    await render(DemoViewer, { inputs: { demo: okDemo }, providers });
    expect(screen.getByRole('tab', { name: 'Preview' }).id).toContain('preview-fake-basic');
  });
});
```

Run: `npx nx test docs --no-watch`
Expected: FAIL, because the module is not found.

- [ ] **Step 2: Implement `demo-viewer.ts`**

```ts
import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type Type,
  afterNextRender,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { Tab, TabList, TabPanel, Tabs } from '@mushilu-san/ui/navigation';
import { DEMO_SOURCE_INDEX } from '../../../content/tokens';
import type { DemoRef } from '../../../content/types';
import { CodeBlock } from '../code-block/code-block';

@Component({
  selector: 'docs-demo-viewer',
  imports: [NgComponentOutlet, Tabs, TabList, Tab, TabPanel, CodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo-viewer.css',
  template: `
    <mui-tabs [(activeTab)]="tab">
      <mui-tab-list [attr.aria-label]="demo().title + ' example'">
        <mui-tab [value]="previewValue()">Preview</mui-tab>
        <mui-tab [value]="codeValue()">Code</mui-tab>
      </mui-tab-list>
      <mui-tab-panel [value]="previewValue()">
        <div class="stage" part="stage">
          @if (component(); as cmp) {
            <ng-container *ngComponentOutlet="cmp" />
          } @else if (failed()) {
            <p role="alert">This example failed to load.</p>
          } @else {
            <p class="placeholder" aria-busy="true">Loading example…</p>
          }
        </div>
      </mui-tab-panel>
      <mui-tab-panel [value]="codeValue()">
        @if (source(); as src) {
          <docs-code-block [lines]="src.lines" [source]="src.source" [label]="demo().id + '.demo.ts'" />
        }
      </mui-tab-panel>
    </mui-tabs>
  `,
})
export class DemoViewer {
  readonly demo = input.required<DemoRef>();

  private readonly sources = inject(DEMO_SOURCE_INDEX);
  protected readonly previewValue = computed(() => `preview-${this.demo().id}`);
  protected readonly codeValue = computed(() => `code-${this.demo().id}`);
  protected readonly tab = linkedSignal(() => this.previewValue());
  protected readonly source = computed(() => this.sources[this.demo().id]);
  protected readonly component = signal<Type<unknown> | null>(null);
  protected readonly failed = signal(false);

  constructor() {
    afterNextRender(() => {
      void this.load();
    });
  }

  private async load(): Promise<void> {
    try {
      this.component.set(await this.demo().component());
    } catch {
      this.failed.set(true);
    }
  }
}
```

- [ ] **Step 3: Implement `demo-viewer.css`**

```css
:host {
  display: block;
  border: 1px solid var(--mui-color-border);
  border-radius: var(--mui-radius-lg);
  overflow: hidden;
  background: var(--mui-color-bg);
}

.stage {
  display: grid;
  place-items: center;
  min-height: 160px;
  padding: var(--mui-space-8) var(--mui-space-4);
  background:
    radial-gradient(circle at 1px 1px, var(--mui-color-border) 1px, transparent 0) 0 0 / 16px 16px,
    var(--mui-color-surface);
}

.placeholder {
  color: var(--mui-color-text-muted);
  font-size: var(--mui-font-size-sm);
}

docs-code-block {
  border: 0;
  border-radius: 0;
}
```

- [ ] **Step 4: Run the tests**

Run: `npx nx test docs --no-watch`
Expected: PASS.

If the "Preview" tab `id` doesn't contain `preview-fake-basic`, read `projects/ui/src/lib/navigation/src/tabs/tab.ts` (it uses `mui-tab-${value()}`) and assert against whatever the host actually renders. The goal of the test is that the id includes the demo-scoped value.

- [ ] **Step 5: Commit**

```bash
npx prettier --write projects/docs/src/app/shared/demo-viewer
npx nx lint docs
git add projects/docs/src/app/shared/demo-viewer
git commit -m "feat(docs): add demo viewer with preview and source tabs

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: API reference and accessibility section

**Files:**
- Create:
  - `projects/docs/src/app/shared/api-reference/api-reference.ts`
  - `projects/docs/src/app/shared/api-reference/api-reference.html`
  - `projects/docs/src/app/shared/api-reference/api-reference.css`
  - `projects/docs/src/app/shared/api-reference/api-reference.spec.ts`
  - `projects/docs/src/app/shared/a11y-section/a11y-section.ts`
  - `projects/docs/src/app/shared/a11y-section/parse-keys.ts`
  - `projects/docs/src/app/shared/a11y-section/a11y-section.spec.ts`
  - `projects/docs/src/app/shared/doc-table.css` (shared table styling, imported by both via `styleUrls`)

**Interfaces:**
- Consumes:
  - `API_INDEX`, `ApiClass`, `ApiMember` (Tasks 3 and 5)
  - `ComponentDoc['a11y']` (Task 5)
  - `InlineText` (Task 5)
  - `Badge` from `@mushilu-san/ui/primitives`
- Produces:
  - `ApiReference` (`docs-api-reference`) with the required input `classes: string[]`
  - `A11ySection` (`docs-a11y-section`) with the required input `a11y: ComponentDoc['a11y']`
  - `parseKeys(keys: string): string[][]`. `' / '` separates alternatives and `+` separates the parts of a combination: `'Shift+Tab / Tab'` becomes `[['Shift','Tab'],['Tab']]`.

The API tables are native `<table>` elements, not `mui-table`. `mui-table` renders plain-text cells, and these cells need `<code>` and badges. This deviates from the spec's "Table" bullet.

- [ ] **Step 1: Write the failing `ApiReference` tests**

`api-reference.spec.ts`:
```ts
import { render, screen, within } from '@testing-library/angular';
import { provideMushiluUi } from '@mushilu-san/ui';
import type { ApiIndex } from '../../../content/api-types';
import { API_INDEX } from '../../../content/tokens';
import { ApiReference } from './api-reference';

const api: ApiIndex = {
  Widget: {
    name: 'Widget',
    group: 'primitives',
    kind: 'component',
    selector: 'mui-widget',
    members: [
      { name: 'size', kind: 'input', type: "'sm' | 'md'", default: "'md'", required: false, description: 'Size.' },
      { name: 'key', kind: 'input', type: 'string', required: true },
      { name: 'disabled', kind: 'input', type: 'boolean', default: 'false', required: false, transform: 'booleanAttribute' },
      { name: 'dense', kind: 'input', type: 'boolean', required: false, deprecated: 'Use size.' },
      { name: 'open', kind: 'model', type: 'boolean', default: 'false', required: false },
      { name: 'changed', kind: 'output', type: 'string', required: false },
    ],
    methods: [],
    parts: ['root', 'label'],
  },
  WidgetService: {
    name: 'WidgetService',
    group: 'primitives',
    kind: 'service',
    providedIn: 'root',
    members: [],
    methods: [{ name: 'show', signature: '(m: string) => void', description: 'Shows.' }],
    parts: [],
  },
};

async function setup(classes: string[]) {
  return render(ApiReference, {
    inputs: { classes },
    providers: [provideMushiluUi(), { provide: API_INDEX, useValue: api }],
  });
}

describe('ApiReference', () => {
  it('renders a heading and selector per class', async () => {
    await setup(['Widget']);
    expect(screen.getByRole('heading', { level: 3, name: 'Widget' })).toBeInTheDocument();
    expect(screen.getByText('mui-widget')).toBeInTheDocument();
  });

  it('splits members into Inputs, Models and Outputs tables', async () => {
    await setup(['Widget']);
    const inputs = screen.getByRole('table', { name: 'Widget inputs' });
    expect(within(inputs).getAllByRole('row')).toHaveLength(5); // header + 4
    expect(screen.getByRole('table', { name: 'Widget models' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Widget outputs' })).toBeInTheDocument();
  });

  it('marks required, deprecated and attribute-friendly inputs', async () => {
    await setup(['Widget']);
    const inputs = screen.getByRole('table', { name: 'Widget inputs' });
    expect(within(inputs).getByText('required')).toBeInTheDocument();
    expect(within(inputs).getByText('deprecated')).toBeInTheDocument();
    expect(within(inputs).getByText(/attribute presence/i)).toBeInTheDocument();
  });

  it('renders service methods and CSS parts', async () => {
    await setup(['Widget', 'WidgetService']);
    expect(screen.getByRole('table', { name: 'WidgetService methods' })).toHaveTextContent('(m: string) => void');
    expect(screen.getByRole('list', { name: 'Widget CSS parts' })).toHaveTextContent('root');
  });

  it('omits tables for empty member kinds', async () => {
    await setup(['WidgetService']);
    expect(screen.queryByRole('table', { name: 'WidgetService inputs' })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement `ApiReference`**

`api-reference.ts`:
```ts
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Badge } from '@mushilu-san/ui/primitives';
import type { ApiClass, ApiMember, ApiMemberKind } from '../../../content/api-types';
import { API_INDEX } from '../../../content/tokens';

interface MemberTable {
  kind: ApiMemberKind;
  title: string;
  rows: ApiMember[];
}

interface ClassView {
  cls: ApiClass;
  tables: MemberTable[];
}

const TABLE_ORDER: { kind: ApiMemberKind; title: string }[] = [
  { kind: 'input', title: 'Inputs' },
  { kind: 'model', title: 'Models' },
  { kind: 'output', title: 'Outputs' },
];

@Component({
  selector: 'docs-api-reference',
  imports: [Badge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './api-reference.html',
  styleUrls: ['../doc-table.css', './api-reference.css'],
})
export class ApiReference {
  readonly classes = input.required<string[]>();
  private readonly api = inject(API_INDEX);

  protected readonly views = computed<ClassView[]>(() =>
    this.classes().flatMap((name) => {
      const cls = this.api[name];
      if (!cls) return [];
      const tables = TABLE_ORDER.map(({ kind, title }) => ({
        kind,
        title,
        rows: cls.members.filter((m) => m.kind === kind),
      })).filter((t) => t.rows.length > 0);
      return [{ cls, tables }];
    }),
  );
}
```

`api-reference.html`:
```html
@for (view of views(); track view.cls.name) {
  <section class="class" [attr.aria-labelledby]="'api-' + view.cls.name">
    <h3 [id]="'api-' + view.cls.name">{{ view.cls.name }}</h3>
    <p class="meta">
      @if (view.cls.selector; as sel) {
        Selector: <code>{{ sel }}</code>
      } @else if (view.cls.providedIn; as scope) {
        Service, provided in <code>{{ scope }}</code>
      }
    </p>

    @for (table of view.tables; track table.kind) {
      <div class="scroll" tabindex="0" role="region" [attr.aria-label]="view.cls.name + ' ' + table.title">
        <table [attr.aria-label]="view.cls.name + ' ' + table.title.toLowerCase()">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              @if (table.kind !== 'output') {
                <th scope="col">Default</th>
              }
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            @for (m of table.rows; track m.name) {
              <tr>
                <td>
                  <code>{{ m.name }}</code>
                  @if (m.required) {
                    <mui-badge variant="warning" size="sm">required</mui-badge>
                  }
                  @if (m.deprecated !== undefined) {
                    <mui-badge variant="danger" size="sm">deprecated</mui-badge>
                  }
                </td>
                <td><code>{{ m.type }}</code></td>
                @if (table.kind !== 'output') {
                  <td>
                    @if (m.default; as d) {
                      <code>{{ d }}</code>
                    } @else {
                      <span class="muted">—</span>
                    }
                  </td>
                }
                <td>
                  {{ m.description }}
                  @if (m.transform === 'booleanAttribute') {
                    <span class="note">Accepts attribute presence, e.g. <code>&lt;… {{ m.name }}&gt;</code>.</span>
                  }
                  @if (m.deprecated) {
                    <span class="note">Deprecated: {{ m.deprecated }}</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    @if (view.cls.methods.length > 0) {
      <div class="scroll" tabindex="0" role="region" [attr.aria-label]="view.cls.name + ' Methods'">
        <table [attr.aria-label]="view.cls.name + ' methods'">
          <thead>
            <tr>
              <th scope="col">Method</th>
              <th scope="col">Signature</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            @for (fn of view.cls.methods; track fn.name) {
              <tr>
                <td><code>{{ fn.name }}</code></td>
                <td><code>{{ fn.signature }}</code></td>
                <td>{{ fn.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    @if (view.cls.parts.length > 0) {
      <h4>CSS parts</h4>
      <ul class="parts" [attr.aria-label]="view.cls.name + ' CSS parts'">
        @for (part of view.cls.parts; track part) {
          <li><code>::part({{ part }})</code></li>
        }
      </ul>
    }
  </section>
}
```

`../doc-table.css`, which the a11y section shares:
```css
.scroll {
  overflow-x: auto;
  margin-block: var(--mui-space-3) var(--mui-space-6);
  border: 1px solid var(--mui-color-border);
  border-radius: var(--mui-radius-md);
}

.scroll:focus-visible {
  outline: var(--mui-focus-ring-width) solid var(--mui-color-focus-ring);
  outline-offset: var(--mui-focus-ring-offset);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--mui-font-size-sm);
}

th,
td {
  text-align: start;
  vertical-align: top;
  padding: var(--mui-space-2) var(--mui-space-3);
  border-bottom: 1px solid var(--mui-color-border);
}

th {
  background: var(--mui-color-surface);
  font-weight: var(--mui-font-weight-semibold);
  white-space: nowrap;
}

tr:last-child td {
  border-bottom: 0;
}

td code {
  white-space: nowrap;
}

.muted {
  color: var(--mui-color-text-muted);
}

.note {
  display: block;
  margin-top: var(--mui-space-1);
  color: var(--mui-color-text-muted);
}
```

`api-reference.css`:
```css
:host {
  display: block;
}

.class + .class {
  margin-top: var(--mui-space-10);
}

h3 {
  margin-bottom: var(--mui-space-1);
}

.meta {
  margin-top: 0;
  color: var(--mui-color-text-muted);
}

mui-badge {
  margin-inline-start: var(--mui-space-1);
}

.parts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--mui-space-2);
  padding: 0;
  list-style: none;
}
```

Run: `npx nx test docs --no-watch`
Expected: the `ApiReference` tests PASS.

- [ ] **Step 3: Write the failing `A11ySection` and `parseKeys` tests**

`a11y-section.spec.ts`:
```ts
import { provideRouter } from '@angular/router';
import { render, screen, within } from '@testing-library/angular';
import { A11ySection } from './a11y-section';
import { parseKeys } from './parse-keys';

describe('parseKeys', () => {
  it('splits alternatives and combinations', () => {
    expect(parseKeys('Shift+Tab / Tab')).toEqual([['Shift', 'Tab'], ['Tab']]);
    expect(parseKeys('Enter')).toEqual([['Enter']]);
  });
});

describe('A11ySection', () => {
  const a11y = {
    roles: [{ element: 'mui-tab', role: 'tab', notes: 'Has `aria-selected`.' }],
    keyboard: [{ keys: 'ArrowLeft / ArrowRight', action: 'Moves focus.' }],
    notes: ['Uses a roving tabindex.'],
  };

  it('renders roles, keyboard and notes', async () => {
    await render(A11ySection, { inputs: { a11y }, providers: [provideRouter([])] });
    const roles = screen.getByRole('table', { name: 'ARIA roles and attributes' });
    expect(within(roles).getByText('tab')).toBeInTheDocument();
    expect(within(roles).getByText('aria-selected').tagName).toBe('CODE');
    const keys = screen.getByRole('table', { name: 'Keyboard interactions' });
    expect(within(keys).getByText('ArrowLeft').tagName).toBe('KBD');
    expect(within(keys).getByText('ArrowRight').tagName).toBe('KBD');
    expect(screen.getByText('Uses a roving tabindex.')).toBeInTheDocument();
  });

  it('omits empty tables', async () => {
    await render(A11ySection, {
      inputs: { a11y: { roles: [], keyboard: [], notes: ['Only notes.'] } },
      providers: [provideRouter([])],
    });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Implement `parse-keys.ts` and `a11y-section.ts`**

`parse-keys.ts`:
```ts
/** 'Shift+Tab / Tab' → [['Shift','Tab'], ['Tab']] */
export function parseKeys(keys: string): string[][] {
  return keys.split(' / ').map((alt) => alt.split('+').map((k) => k.trim()).filter(Boolean));
}
```

`a11y-section.ts`:
```ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ComponentDoc } from '../../../content/types';
import { InlineText } from '../inline-text/inline-text';
import { parseKeys } from './parse-keys';

@Component({
  selector: 'docs-a11y-section',
  imports: [InlineText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../doc-table.css'],
  styles: `
    :host {
      display: block;
    }
    .combo + .combo::before {
      content: ' or ';
      color: var(--mui-color-text-muted);
    }
    .plus {
      padding-inline: 2px;
      color: var(--mui-color-text-muted);
    }
  `,
  template: `
    @if (a11y().roles.length > 0) {
      <h3>Roles and attributes</h3>
      <div class="scroll" tabindex="0" role="region" aria-label="ARIA roles">
        <table aria-label="ARIA roles and attributes">
          <thead>
            <tr><th scope="col">Element</th><th scope="col">Role</th><th scope="col">Notes</th></tr>
          </thead>
          <tbody>
            @for (r of a11y().roles; track r.element) {
              <tr>
                <td><code>{{ r.element }}</code></td>
                <td>{{ r.role }}</td>
                <td>
                  @if (r.notes; as notes) {
                    <docs-inline-text [text]="notes" />
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
    @if (keyboard().length > 0) {
      <h3>Keyboard</h3>
      <div class="scroll" tabindex="0" role="region" aria-label="Keyboard">
        <table aria-label="Keyboard interactions">
          <thead>
            <tr><th scope="col">Keys</th><th scope="col">Action</th></tr>
          </thead>
          <tbody>
            @for (k of keyboard(); track k.keys) {
              <tr>
                <td>
                  @for (combo of k.parsed; track $index) {
                    <span class="combo">
                      @for (key of combo; track $index; let last = $last) {
                        <kbd>{{ key }}</kbd>
                        @if (!last) {
                          <span class="plus" aria-hidden="true">+</span>
                        }
                      }
                    </span>
                  }
                </td>
                <td><docs-inline-text [text]="k.action" /></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
    @if (a11y().notes.length > 0) {
      <ul>
        @for (note of a11y().notes; track $index) {
          <li><docs-inline-text [text]="note" /></li>
        }
      </ul>
    }
  `,
})
export class A11ySection {
  readonly a11y = input.required<ComponentDoc['a11y']>();
  protected readonly keyboard = computed(() =>
    this.a11y().keyboard.map((k) => ({ ...k, parsed: parseKeys(k.keys) })),
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `npx nx test docs --no-watch`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
npx prettier --write projects/docs/src/app/shared
npx nx lint docs
git add projects/docs/src/app/shared
git commit -m "feat(docs): add generated API reference and accessibility section

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Shell (header, sidebar nav, mobile sheet, skip link, route focus)

**Files:**
- Create:
  - `projects/docs/src/app/shell/nav-sections.ts`
  - `projects/docs/src/app/shell/nav-sections.spec.ts`
  - `projects/docs/src/app/shell/docs-nav.ts`
  - `projects/docs/src/app/shell/docs-header.ts`
  - `projects/docs/src/app/shell/route-focus.service.ts`
  - `projects/docs/src/app/shell/route-focus.service.spec.ts`
  - `projects/docs/src/app/app.html`
  - `projects/docs/src/app/app.css`
  - `projects/docs/src/app/app.spec.ts`
  - `projects/docs/src/app/title-strategy.ts`
- Modify:
  - `projects/docs/src/app/app.ts`
  - `projects/docs/src/app/app.config.ts` (provide the `TitleStrategy`)

**Interfaces:**
- Consumes:
  - `DOCS_REGISTRY`, `GROUPS`
  - `ThemeToggle`
  - `Sidebar`, `SidebarSection`, `SidebarItem` from `@mushilu-san/ui/layout`
  - `Sheet` from `@mushilu-san/ui/feedback`
  - `Button`
- Produces:
  - `buildNavSections(registry): NavSection[]`, where `NavSection = { label: string; links: { label: string; path: string }[] }`
  - `DocsNav` (`docs-nav`, output `navigate: void`)
  - `DocsHeader` (`docs-header`, input `menuOpen: boolean`, output `menu: void`)
  - `RouteFocus` (root): `message: Signal<string>`, `init(): void`
  - `DocsTitleStrategy`, which appends ` · Mushilu-San UI` to the title

- [ ] **Step 1: Write the failing `nav-sections` test**

`nav-sections.spec.ts`:
```ts
import type { RegistryEntry } from '../../content/types';
import { buildNavSections } from './nav-sections';

const entry = (slug: string, name: string, group: RegistryEntry['group']): RegistryEntry => ({
  slug,
  name,
  group,
  summary: '',
  load: () => Promise.reject(new Error('unused')),
});

describe('buildNavSections', () => {
  it('starts with Get started, then one section per non-empty group in GROUPS order, sorted by name', () => {
    const sections = buildNavSections([
      entry('tabs', 'Tabs', 'navigation'),
      entry('button', 'Button', 'primitives'),
      entry('badge', 'Badge', 'primitives'),
    ]);
    expect(sections.map((s) => s.label)).toEqual(['Get started', 'Primitives', 'Navigation']);
    expect(sections[0]?.links.map((l) => l.path)).toEqual(['/', '/getting-started', '/components']);
    expect(sections[1]?.links).toEqual([
      { label: 'Badge', path: '/components/badge' },
      { label: 'Button', path: '/components/button' },
    ]);
  });
});
```

- [ ] **Step 2: Implement `nav-sections.ts`**

```ts
import { GROUPS } from '../../content/groups';
import type { RegistryEntry } from '../../content/types';

export interface NavLink {
  label: string;
  path: string;
}

export interface NavSection {
  label: string;
  links: NavLink[];
}

export function buildNavSections(registry: readonly RegistryEntry[]): NavSection[] {
  const start: NavSection = {
    label: 'Get started',
    links: [
      { label: 'Introduction', path: '/' },
      { label: 'Installation', path: '/getting-started' },
      { label: 'All components', path: '/components' },
    ],
  };
  const groups = GROUPS.map((g) => ({
    label: g.label,
    links: registry
      .filter((e) => e.group === g.id)
      .map((e) => ({ label: e.name, path: `/components/${e.slug}` }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  })).filter((s) => s.links.length > 0);
  return [start, ...groups];
}
```

Run: `npx nx test docs --no-watch`
Expected: the `nav-sections` test PASSES.

- [ ] **Step 3: Write the failing `RouteFocus` test**

`route-focus.service.spec.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { RouteFocus } from './route-focus.service';

@Component({
  selector: 'docs-page-a',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<main><h1>Page A</h1></main>',
})
class PageA {}

@Component({
  selector: 'docs-page-b',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<main><h1>Page B</h1></main>',
})
class PageB {}

describe('RouteFocus', () => {
  it('moves focus to the new h1 and announces the title after client navigation', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'a', title: 'A title', component: PageA },
          { path: 'b', title: 'B title', component: PageB },
        ]),
      ],
    });
    const focus = TestBed.inject(RouteFocus);
    focus.init();
    const harness = await RouterTestingHarness.create('/a');
    expect(focus.message()).toBe(''); // initial load is not announced

    await harness.navigateByUrl('/b');
    await TestBed.inject(Router).navigated;
    harness.detectChanges();
    await harness.fixture.whenStable();

    const h1 = harness.routeNativeElement?.querySelector('h1');
    expect(h1).toHaveTextContent('Page B');
    expect(document.activeElement).toBe(h1);
    expect(h1).toHaveAttribute('tabindex', '-1');
    expect(focus.message()).toBe('B title');
  });
});
```

- [ ] **Step 4: Implement `route-focus.service.ts`**

```ts
import { DOCUMENT } from '@angular/common';
import { Injectable, Injector, afterNextRender, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/** After each client-side navigation: focus the page h1 and announce the new title. */
@Injectable({ providedIn: 'root' })
export class RouteFocus {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly title = inject(Title);
  private readonly msg = signal('');
  readonly message = this.msg.asReadonly();
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    let first = true;
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        if (first) {
          first = false;
          return;
        }
        afterNextRender(
          () => {
            const h1 = this.document.querySelector<HTMLElement>('main h1');
            if (h1) {
              h1.setAttribute('tabindex', '-1');
              h1.focus();
            }
            this.msg.set(this.title.getTitle());
          },
          { injector: this.injector },
        );
      });
  }
}
```

`title-strategy.ts`:
```ts
import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { type RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE = 'Mushilu-San UI';

@Injectable({ providedIn: 'root' })
export class DocsTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = this.buildTitle(snapshot);
    this.title.setTitle(page ? `${page} · ${SITE}` : SITE);
  }
}
```

The `RouteFocus` spec uses the default `TitleStrategy`, so the page title is the raw `'B title'`. In `app.config.ts`, add `{ provide: TitleStrategy, useClass: DocsTitleStrategy }` to `providers` (import `TitleStrategy` from `@angular/router`).

Run: `npx nx test docs --no-watch`
Expected: PASS.

If `document.activeElement` is not the h1, the `afterNextRender` callback hasn't run yet. Add one more `harness.detectChanges()` before asserting. Do not switch to `setTimeout`.

- [ ] **Step 5: Implement `DocsNav` and `DocsHeader`**

`docs-nav.ts`:
```ts
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Sidebar, SidebarItem, SidebarSection } from '@mushilu-san/ui/layout';
import { DOCS_REGISTRY } from '../../content/tokens';
import { buildNavSections } from './nav-sections';

@Component({
  selector: 'docs-nav',
  imports: [Sidebar, SidebarSection, SidebarItem, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
    mui-sidebar {
      width: 100%;
      height: auto;
      border: 0;
      background: transparent;
    }
  `,
  template: `
    <mui-sidebar label="Documentation" [collapsible]="false">
      @for (section of sections(); track section.label) {
        <mui-sidebar-section [label]="section.label">
          @for (link of section.links; track link.path) {
            <a
              muiSidebarItem
              [label]="link.label"
              [routerLink]="link.path"
              routerLinkActive
              #rla="routerLinkActive"
              [routerLinkActiveOptions]="{ exact: true }"
              [active]="rla.isActive"
              (click)="navigate.emit()"
            ></a>
          }
        </mui-sidebar-section>
      }
    </mui-sidebar>
  `,
})
export class DocsNav {
  readonly navigate = output<void>();
  private readonly registry = inject(DOCS_REGISTRY);
  /** The registry is static, so a plain field is enough (no computed). */
  protected readonly sections = buildNavSections(this.registry);
}
```

`docs-header.ts`:
```ts
import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '@mushilu-san/ui/primitives';
import { ThemeToggle } from '../shared/theme/theme-toggle';

@Component({
  selector: 'docs-header',
  imports: [RouterLink, Button, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: var(--mui-z-sticky);
      display: flex;
      align-items: center;
      gap: var(--mui-space-2);
      height: var(--docs-header-height);
      padding-inline: var(--mui-space-4);
      background: color-mix(in srgb, var(--mui-color-bg) 88%, transparent);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--mui-color-border);
    }
    .menu {
      min-width: var(--mui-touch-target);
      min-height: var(--mui-touch-target);
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: var(--mui-space-2);
      min-height: var(--mui-touch-target);
      color: var(--mui-color-text);
      font-weight: var(--mui-font-weight-semibold);
      text-decoration: none;
    }
    .spacer {
      flex: 1;
    }
    .ext {
      display: inline-flex;
      align-items: center;
      min-height: var(--mui-touch-target);
      padding-inline: var(--mui-space-2);
      color: var(--mui-color-text-muted);
      font-size: var(--mui-font-size-sm);
      text-decoration: none;
    }
    .ext:hover {
      color: var(--mui-color-text);
    }
    @media (min-width: 1024px) {
      .menu {
        display: none;
      }
    }
    @media (max-width: 479px) {
      .ext {
        display: none;
      }
    }
  `,
  template: `
    <button
      muiButton
      variant="ghost"
      type="button"
      class="menu"
      aria-label="Open navigation"
      aria-haspopup="dialog"
      [attr.aria-expanded]="menuOpen()"
      (click)="menu.emit()"
    >
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
    <a class="brand" routerLink="/">
      <img src="favicon.svg" alt="" width="24" height="24" />
      Mushilu-San UI
    </a>
    <span class="spacer"></span>
    <a class="ext" href="storybook/">Storybook</a>
    <a class="ext" href="https://github.com/mushilu-san/Mushilu-San-UI" rel="noopener">GitHub</a>
    <docs-theme-toggle />
  `,
})
export class DocsHeader {
  readonly menuOpen = input(false, { transform: booleanAttribute });
  readonly menu = output<void>();
}
```

- [ ] **Step 6: Replace the App shell**

`app.ts`:
```ts
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sheet } from '@mushilu-san/ui/feedback';
import { DocsHeader } from './shell/docs-header';
import { DocsNav } from './shell/docs-nav';
import { RouteFocus } from './shell/route-focus.service';

@Component({
  selector: 'docs-root',
  imports: [RouterOutlet, Sheet, DocsHeader, DocsNav],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly navOpen = signal(false);
  protected readonly routeFocus = inject(RouteFocus);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.routeFocus.init();
  }

  protected skipToMain(): void {
    this.document.getElementById('main')?.focus();
  }
}
```

`app.html`:
```html
<button type="button" class="skip-link" (click)="skipToMain()">Skip to content</button>
<docs-header [menuOpen]="navOpen()" (menu)="navOpen.set(true)" />
<div class="layout">
  <aside class="sidebar" aria-label="Documentation navigation">
    <docs-nav />
  </aside>
  <main id="main" tabindex="-1" class="main">
    <router-outlet />
  </main>
</div>
<mui-sheet side="left" heading="Navigation" [(open)]="navOpen">
  <docs-nav (navigate)="navOpen.set(false)" />
</mui-sheet>
<div class="visually-hidden" aria-live="polite" aria-atomic="true">{{ routeFocus.message() }}</div>
```

`app.css`:
```css
.skip-link {
  position: absolute;
  inset-inline-start: var(--mui-space-2);
  top: -100px;
  z-index: calc(var(--mui-z-sticky) + 1);
  min-height: var(--mui-touch-target);
  padding-inline: var(--mui-space-4);
  border: 0;
  border-radius: var(--mui-radius-md);
  background: var(--mui-color-primary);
  color: var(--mui-color-primary-text);
  font: inherit;
}

.skip-link:focus-visible {
  top: var(--mui-space-2);
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
}

.sidebar {
  display: none;
}

.main {
  min-width: 0;
  padding: var(--mui-space-6) var(--mui-space-4) var(--mui-space-16, 64px);
}

.main:focus {
  outline: none; /* programmatic focus target only; the h1 / skip link carry visible focus */
}

@media (min-width: 1024px) {
  .layout {
    grid-template-columns: var(--docs-sidebar-width) minmax(0, 1fr);
  }
  .sidebar {
    display: block;
    position: sticky;
    top: var(--docs-header-height);
    height: calc(100dvh - var(--docs-header-height));
    overflow-y: auto;
    border-inline-end: 1px solid var(--mui-color-border);
    padding-block: var(--mui-space-4);
  }
  .main {
    padding-inline: var(--mui-space-10);
  }
}
```

The `.main:focus { outline: none }` rule is the one documented exception. `main` is only ever focused programmatically by the skip link, never by Tab, because `tabindex="-1"` keeps it out of the tab order.

- [ ] **Step 7: Write the App shell test**

`app.spec.ts`:
```ts
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { provideMushiluUi } from '@mushilu-san/ui';
import { App } from './app';

describe('App shell', () => {
  async function setup() {
    return render(App, { providers: [provideRouter([]), provideMushiluUi()] });
  }

  it('renders the skip link, header, nav landmark and main', async () => {
    await setup();
    expect(screen.getByRole('button', { name: 'Skip to content' })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Documentation navigation' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  });

  it('skip link moves focus to main', async () => {
    await setup();
    await userEvent.click(screen.getByRole('button', { name: 'Skip to content' }));
    expect(document.activeElement).toBe(screen.getByRole('main'));
  });

  it('menu button opens the navigation sheet and reflects aria-expanded', async () => {
    await setup();
    const menu = screen.getByRole('button', { name: 'Open navigation' });
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');
  });
});
```

`docs-header` is a custom element, and the `banner` role needs a `<header>`. If `getByRole('banner')` fails, wrap the header markup in `<header>…</header>` inside `docs-header`'s template, move the `:host` styles to a `header` rule, and set `:host { display: contents }`. That is the expected fix.

Run: `npx nx test docs --no-watch`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
npx prettier --write projects/docs/src/app
npx nx lint docs
git add projects/docs/src/app
git commit -m "feat(docs): add shell with sidebar nav, mobile sheet, skip link and route focus

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Component page, routes, prerender params, not-found

**Files:**
- Create:
  - `projects/docs/src/app/pages/component-page/component-page.ts`
  - `projects/docs/src/app/pages/component-page/component-page.html`
  - `projects/docs/src/app/pages/component-page/component-page.css`
  - `projects/docs/src/app/pages/component-page/page-sections.ts`
  - `projects/docs/src/app/pages/component-page/component-page.spec.ts`
  - `projects/docs/src/app/pages/not-found/not-found.ts`
  - `projects/docs/src/app/route-titles.ts`
- Modify:
  - `projects/docs/src/app/app.routes.ts`
  - `projects/docs/src/app/app.routes.server.ts`

**Interfaces:**
- Consumes: everything from Tasks 5–9.
- Produces:
  - `ComponentPage` (route input `slug`)
  - `pageSections(doc: ComponentDoc): { id: string; label: string }[]`
  - `importStatement(doc: ComponentDoc, api: ApiIndex): string`
  - `NotFound` (`docs-not-found`)
  - `componentTitle: ResolveFn<string>` and `groupTitle: ResolveFn<string>`
  - The routes `''`, `getting-started`, `components`, `components/group/:group`, `components/:slug`, `**`

- [ ] **Step 1: Write the failing tests**

`component-page.spec.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { provideMushiluUi } from '@mushilu-san/ui';
import type { ApiIndex } from '../../../content/api-types';
import { API_INDEX, DEMO_SOURCE_INDEX, DOCS_REGISTRY } from '../../../content/tokens';
import type { ComponentDoc, RegistryEntry } from '../../../content/types';
import { ComponentPage } from './component-page';
import { importStatement, pageSections } from './page-sections';

@Component({
  selector: 'docs-widget-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p>widget demo</p>',
})
class WidgetDemo {}

const doc: ComponentDoc = {
  slug: 'widget',
  name: 'Widget',
  group: 'primitives',
  selector: 'mui-widget',
  apiClasses: ['Widget', 'WidgetService'],
  summary: 'A test widget.',
  description: ['Widget body with `code`.'],
  whenToUse: ['Always.'],
  whenNotToUse: [{ text: 'Never for gadgets.', alternative: 'gadget' }],
  demos: [
    { id: 'widget-basic', title: 'Basic', component: async () => WidgetDemo },
    { id: 'widget-more', title: 'More', component: async () => WidgetDemo },
  ],
  a11y: { roles: [], keyboard: [{ keys: 'Enter', action: 'Activates.' }], notes: [] },
  tokens: ['--mui-color-primary'],
};

const registry: RegistryEntry[] = [
  { slug: 'widget', name: 'Widget', group: 'primitives', summary: 'A test widget.', load: async () => doc },
  {
    slug: 'gadget',
    name: 'Gadget',
    group: 'primitives',
    summary: 'g',
    load: () => Promise.reject(new Error('unused')),
  },
];

const api: ApiIndex = {
  Widget: { name: 'Widget', group: 'primitives', kind: 'component', selector: 'mui-widget', members: [], methods: [], parts: [] },
  WidgetService: { name: 'WidgetService', group: 'primitives', kind: 'service', providedIn: 'root', members: [], methods: [], parts: [] },
};

const providers = [
  provideRouter([]),
  provideMushiluUi(),
  { provide: DOCS_REGISTRY, useValue: registry },
  { provide: API_INDEX, useValue: api },
  { provide: DEMO_SOURCE_INDEX, useValue: {} },
];

describe('pageSections', () => {
  it('lists only the sections the doc has, in page order', () => {
    expect(pageSections(doc).map((s) => s.id)).toEqual(['overview', 'examples', 'accessibility', 'api', 'tokens']);
  });
});

describe('importStatement', () => {
  it('imports every API class from the group entry point', () => {
    expect(importStatement(doc, api)).toBe(
      "import { Widget, WidgetService } from '@mushilu-san/ui/primitives';",
    );
  });
});

describe('ComponentPage', () => {
  it('renders the h1 from the registry immediately and the doc sections once loaded', async () => {
    await render(ComponentPage, { inputs: { slug: 'widget' }, providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Widget' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 2, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Accessibility' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'API' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'More' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gadget' })).toHaveAttribute('href', '/components/gadget');
  });

  it('renders an "On this page" navigation', async () => {
    await render(ComponentPage, { inputs: { slug: 'widget' }, providers });
    const toc = await screen.findByRole('navigation', { name: 'On this page' });
    expect(toc).toHaveTextContent('Examples');
  });

  it('shows not-found for an unknown slug', async () => {
    await render(ComponentPage, { inputs: { slug: 'nope' }, providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
  });
});
```

Run: `npx nx test docs --no-watch`
Expected: FAIL, because the modules are not found.

- [ ] **Step 2: Implement `page-sections.ts`**

```ts
import type { ApiIndex } from '../../../content/api-types';
import type { ComponentDoc } from '../../../content/types';
import { groupInfo } from '../../../content/groups';

export interface PageSection {
  id: string;
  label: string;
}

export function pageSections(doc: ComponentDoc): PageSection[] {
  const sections: PageSection[] = [{ id: 'overview', label: 'Overview' }];
  if (doc.demos.length > 1) sections.push({ id: 'examples', label: 'Examples' });
  if (doc.guidelines) sections.push({ id: 'guidelines', label: 'Guidelines' });
  sections.push({ id: 'accessibility', label: 'Accessibility' }, { id: 'api', label: 'API' });
  if (doc.tokens?.length) sections.push({ id: 'tokens', label: 'Tokens' });
  if (doc.related?.length) sections.push({ id: 'related', label: 'Related' });
  return sections;
}

export function importStatement(doc: ComponentDoc, api: ApiIndex): string {
  const names = doc.apiClasses.filter((n) => api[n]);
  return `import { ${names.join(', ')} } from '${groupInfo(doc.group).entry}';`;
}
```

- [ ] **Step 3: Implement `NotFound`**

`pages/not-found/not-found.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Page not found</h1>
    <p>That page doesn't exist. Browse <a routerLink="/components">all components</a> instead.</p>
  `,
})
export class NotFound {}
```

- [ ] **Step 4: Implement `ComponentPage`**

`component-page.ts`:
```ts
import { ChangeDetectionStrategy, Component, computed, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge } from '@mushilu-san/ui/primitives';
import { groupInfo } from '../../../content/groups';
import { findEntry } from '../../../content/registry';
import { API_INDEX, DOCS_REGISTRY } from '../../../content/tokens';
import { A11ySection } from '../../shared/a11y-section/a11y-section';
import { ApiReference } from '../../shared/api-reference/api-reference';
import { CodeBlock, plainLines } from '../../shared/code-block/code-block';
import { DemoViewer } from '../../shared/demo-viewer/demo-viewer';
import { InlineText } from '../../shared/inline-text/inline-text';
import { NotFound } from '../not-found/not-found';
import { importStatement, pageSections } from './page-sections';

@Component({
  selector: 'docs-component-page',
  imports: [RouterLink, Badge, A11ySection, ApiReference, CodeBlock, DemoViewer, InlineText, NotFound],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-page.html',
  styleUrl: './component-page.css',
})
export class ComponentPage {
  readonly slug = input.required<string>();

  private readonly registry = inject(DOCS_REGISTRY);
  private readonly api = inject(API_INDEX);

  protected readonly entry = computed(() => findEntry(this.slug(), this.registry));
  protected readonly groupLabel = computed(() => {
    const e = this.entry();
    return e ? groupInfo(e.group).label : '';
  });
  protected readonly doc = resource({
    params: () => this.entry(),
    loader: ({ params }) => params.load(),
  });
  protected readonly loaded = computed(() => (this.doc.hasValue() ? this.doc.value() : undefined));
  protected readonly sections = computed(() => {
    const d = this.loaded();
    return d ? pageSections(d) : [];
  });
  protected readonly extraDemos = computed(() => this.loaded()?.demos.slice(1) ?? []);
  protected readonly importText = computed(() => {
    const d = this.loaded();
    return d ? importStatement(d, this.api) : '';
  });
  protected readonly importLines = computed(() => plainLines(this.importText()));

  protected nameOf(slug: string): string {
    return findEntry(slug, this.registry)?.name ?? slug;
  }
}
```

`component-page.html`:
```html
@if (entry(); as e) {
  <div class="page">
    <article class="content">
      <header class="head">
        <mui-badge variant="primary" size="sm">{{ groupLabel() }}</mui-badge>
        <h1>{{ e.name }}</h1>
        <p class="summary">{{ e.summary }}</p>
      </header>

      @if (loaded(); as d) {
        <p class="selector">Selector: <code>{{ d.selector }}</code></p>
        <docs-code-block class="import" label="Import" [lines]="importLines()" [source]="importText()" />

        @if (d.demos[0]; as hero) {
          <docs-demo-viewer class="hero" [demo]="hero" />
        }

        <section id="overview" aria-labelledby="overview-h">
          <h2 id="overview-h">Overview</h2>
          @for (p of d.description; track $index) {
            <p><docs-inline-text [text]="p" /></p>
          }
          <div class="usage">
            <div>
              <h3>When to use</h3>
              <ul>
                @for (item of d.whenToUse; track $index) {
                  <li><docs-inline-text [text]="item" /></li>
                }
              </ul>
            </div>
            <div>
              <h3>When not to use</h3>
              <ul>
                @for (item of d.whenNotToUse; track $index) {
                  <li>
                    <docs-inline-text [text]="item.text" />
                    @if (item.alternative; as alt) {
                      Use <a [routerLink]="['/components', alt]">{{ nameOf(alt) }}</a> instead.
                    }
                  </li>
                }
              </ul>
            </div>
          </div>
        </section>

        @if (extraDemos().length > 0) {
          <section id="examples" aria-labelledby="examples-h">
            <h2 id="examples-h">Examples</h2>
            @for (demo of extraDemos(); track demo.id) {
              <h3 [id]="demo.id">{{ demo.title }}</h3>
              @if (demo.description; as desc) {
                <p><docs-inline-text [text]="desc" /></p>
              }
              <docs-demo-viewer [demo]="demo" />
            }
          </section>
        }

        @if (d.guidelines; as g) {
          <section id="guidelines" aria-labelledby="guidelines-h">
            <h2 id="guidelines-h">Guidelines</h2>
            <div class="guidelines">
              <div class="do">
                <h3>Do</h3>
                <ul>
                  @for (item of g.do; track $index) {
                    <li><docs-inline-text [text]="item" /></li>
                  }
                </ul>
              </div>
              <div class="dont">
                <h3>Don't</h3>
                <ul>
                  @for (item of g.dont; track $index) {
                    <li><docs-inline-text [text]="item" /></li>
                  }
                </ul>
              </div>
            </div>
          </section>
        }

        <section id="accessibility" aria-labelledby="accessibility-h">
          <h2 id="accessibility-h">Accessibility</h2>
          <docs-a11y-section [a11y]="d.a11y" />
        </section>

        <section id="api" aria-labelledby="api-h">
          <h2 id="api-h">API</h2>
          <docs-api-reference [classes]="d.apiClasses" />
        </section>

        @if (d.tokens?.length) {
          <section id="tokens" aria-labelledby="tokens-h">
            <h2 id="tokens-h">Tokens</h2>
            <ul class="chips">
              @for (t of d.tokens; track t) {
                <li><code>{{ t }}</code></li>
              }
            </ul>
          </section>
        }

        @if (d.related?.length) {
          <section id="related" aria-labelledby="related-h">
            <h2 id="related-h">Related</h2>
            <ul class="chips">
              @for (r of d.related; track r) {
                <li><a [routerLink]="['/components', r]">{{ nameOf(r) }}</a></li>
              }
            </ul>
          </section>
        }
      } @else if (doc.error()) {
        <p role="alert">This page failed to load. Try reloading.</p>
      } @else {
        <p class="loading" aria-busy="true">Loading documentation…</p>
      }
    </article>

    @if (sections().length > 0) {
      <nav class="toc" aria-label="On this page">
        <p class="toc-title">On this page</p>
        <ul>
          @for (s of sections(); track s.id) {
            <li><a routerLink="." [fragment]="s.id">{{ s.label }}</a></li>
          }
        </ul>
      </nav>
    }
  </div>
} @else {
  <docs-not-found />
}
```

`component-page.css`:
```css
.page {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--mui-space-10);
  max-width: calc(var(--docs-content-max) + var(--docs-toc-width) + var(--mui-space-10));
}

.content {
  min-width: 0;
  max-width: var(--docs-content-max);
}

.head h1 {
  margin: var(--mui-space-2) 0 var(--mui-space-2);
  font-size: var(--mui-font-size-3xl);
  line-height: var(--mui-line-height-snug);
}

.summary {
  margin: 0;
  color: var(--mui-color-text-muted);
  font-size: var(--mui-font-size-lg);
}

.selector {
  margin-top: var(--mui-space-6);
  color: var(--mui-color-text-muted);
  font-size: var(--mui-font-size-sm);
}

.import {
  margin-bottom: var(--mui-space-6);
}

.hero {
  margin-bottom: var(--mui-space-10);
}

section {
  margin-top: var(--mui-space-12);
}

h2 {
  font-size: var(--mui-font-size-2xl);
  padding-bottom: var(--mui-space-2);
  border-bottom: 1px solid var(--mui-color-border);
}

h3 {
  font-size: var(--mui-font-size-lg);
  margin-top: var(--mui-space-8);
}

.usage,
.guidelines {
  display: grid;
  gap: var(--mui-space-6);
}

.do,
.dont {
  padding: var(--mui-space-4);
  border-radius: var(--mui-radius-md);
  border-top: 3px solid var(--mui-color-success);
  background: var(--mui-color-surface);
}

.dont {
  border-top-color: var(--mui-color-danger);
}

.do h3,
.dont h3 {
  margin-top: 0;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--mui-space-2);
  padding: 0;
  list-style: none;
}

.chips a {
  display: inline-flex;
  align-items: center;
  min-height: var(--mui-touch-target);
  padding-inline: var(--mui-space-3);
  border: 1px solid var(--mui-color-border);
  border-radius: var(--mui-radius-full);
  text-decoration: none;
}

.loading {
  color: var(--mui-color-text-muted);
}

.toc {
  display: none;
}

@media (min-width: 768px) {
  .usage,
  .guidelines {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1280px) {
  .page {
    grid-template-columns: minmax(0, var(--docs-content-max)) var(--docs-toc-width);
  }
  .toc {
    display: block;
    position: sticky;
    top: calc(var(--docs-header-height) + var(--mui-space-6));
    align-self: start;
    font-size: var(--mui-font-size-sm);
  }
  .toc-title {
    margin-top: 0;
    font-weight: var(--mui-font-weight-semibold);
  }
  .toc ul {
    padding: 0;
    list-style: none;
  }
  .toc a {
    display: flex;
    align-items: center;
    min-height: var(--mui-touch-target);
    color: var(--mui-color-text-muted);
    text-decoration: none;
  }
  .toc a:hover {
    color: var(--mui-color-text);
  }
}
```

Run: `npx nx test docs --no-watch`
Expected: PASS.

If `resource({ params, loader })` fails to type-check, check the Angular 22 signature at https://angular.dev/api/core/resource. The option was named `request` before v20. Adjust the code, not the test.

- [ ] **Step 5: Add title resolvers and routes**

`route-titles.ts`:
```ts
import type { ResolveFn } from '@angular/router';
import { GROUPS } from '../content/groups';
import { findEntry } from '../content/registry';

export const componentTitle: ResolveFn<string> = (route) =>
  findEntry(route.paramMap.get('slug') ?? '')?.name ?? 'Not found';

export const groupTitle: ResolveFn<string> = (route) =>
  GROUPS.find((g) => g.id === route.paramMap.get('group'))?.label ?? 'Not found';
```

`app.routes.ts`. Replace the whole file. The `getting-started`, `components`, and `group` pages are created in Task 15. Until then, those routes point at `NotFound` so the build stays green:
```ts
import type { Routes } from '@angular/router';
import { componentTitle, groupTitle } from './route-titles';

export const routes: Routes = [
  { path: '', title: 'Introduction', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  {
    path: 'getting-started',
    title: 'Installation',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: 'components',
    title: 'Components',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: 'components/group/:group',
    title: groupTitle,
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: 'components/:slug',
    title: componentTitle,
    loadComponent: () => import('./pages/component-page/component-page').then((m) => m.ComponentPage),
  },
  {
    path: '**',
    title: 'Not found',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
```

`app.routes.server.ts`:
```ts
import { RenderMode, type ServerRoute } from '@angular/ssr';
import { GROUPS } from '../content/groups';
import { REGISTRY } from '../content/registry';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'getting-started', renderMode: RenderMode.Prerender },
  { path: 'components', renderMode: RenderMode.Prerender },
  {
    path: 'components/group/:group',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => GROUPS.map((g) => ({ group: g.id })),
  },
  {
    path: 'components/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => REGISTRY.map((e) => ({ slug: e.slug })),
  },
  // Unknown URLs render client-side; deploy copies index.csr.html to 404.html.
  { path: '**', renderMode: RenderMode.Client },
];
```

- [ ] **Step 6: Verify the build**

Run: `npx nx build docs`
Expected:
- Success.
- `dist/docs/browser/components/group/forms/index.html` exists.
- `dist/docs/browser/index.csr.html` exists.

The registry is still empty, so there are no slug pages yet. Angular may warn that `getPrerenderParams` returned an empty list. That is acceptable for now.

- [ ] **Step 7: Commit**

```bash
npx prettier --write projects/docs/src/app
npx nx lint docs
git add projects/docs/src/app
git commit -m "feat(docs): add component page template, routes and prerender params

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Pilot page — Button

**Files:**
- Create:
  - `projects/docs/src/content/components/button/button.docs.ts`
  - `projects/docs/src/content/components/button/demos/button-variants.demo.ts`
  - `projects/docs/src/content/components/button/demos/button-sizes.demo.ts`
  - `projects/docs/src/content/components/button/demos/button-loading.demo.ts`
  - `projects/docs/src/content/components/button/demos/button-link.demo.ts`
- Modify:
  - `projects/docs/src/content/registry.ts`
  - `projects/docs/src/content/undocumented.json` (remove `"Button"`)

**Interfaces:**
- Consumes: `ComponentDoc` and the registry (Task 5).
- Produces: the registry entry `button`.

- [ ] **Step 1: Write the demos**

`button-variants.demo.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-button-variants-demo',
  imports: [Button, Stack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-stack direction="row" align="center" [gap]="3" wrap>
      <button muiButton variant="primary">Save changes</button>
      <button muiButton variant="secondary">Cancel</button>
      <button muiButton variant="ghost">Learn more</button>
      <button muiButton variant="destructive">Delete</button>
    </mui-stack>
  `,
})
export class ButtonVariantsDemo {}
```

`button-sizes.demo.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-button-sizes-demo',
  imports: [Button, Stack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-stack direction="row" align="center" [gap]="3" wrap>
      <button muiButton size="sm">Small</button>
      <button muiButton size="md">Medium</button>
      <button muiButton size="lg">Large</button>
    </mui-stack>
  `,
})
export class ButtonSizesDemo {}
```

`button-loading.demo.ts`:
```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-button-loading-demo',
  imports: [Button, Stack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-stack direction="row" align="center" [gap]="3" wrap>
      <button muiButton [loading]="saving()" (clicked)="save()">
        {{ saving() ? 'Saving…' : 'Save' }}
      </button>
      <button muiButton variant="secondary" disabled>Disabled</button>
    </mui-stack>
  `,
})
export class ButtonLoadingDemo {
  protected readonly saving = signal(false);

  protected save(): void {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1500);
  }
}
```

`button-link.demo.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-button-link-demo',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<a muiButton variant="secondary" href="https://github.com/mushilu-san/Mushilu-San-UI">View on GitHub</a>`,
})
export class ButtonLinkDemo {}
```

- [ ] **Step 2: Write `button.docs.ts`**

```ts
import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'button',
  name: 'Button',
  group: 'primitives',
  selector: 'button[muiButton], a[muiButton]',
  apiClasses: ['Button'],
  summary: 'Triggers an action or navigation, with variants, sizes and a loading state.',
  description: [
    'Button is applied as an attribute to a native `<button>` or `<a>`, so it keeps the native role, form submission and keyboard behaviour for free.',
    'Disabled and loading buttons stay focusable. They set `aria-disabled` instead of the `disabled` attribute and swallow clicks, so keyboard and screen-reader users can still discover them and hear why they are unavailable.',
  ],
  whenToUse: [
    'Submitting a form or confirming a step.',
    'Triggering an in-page action, such as opening a [Dialog](dialog).',
    'A call to action that navigates. Apply `muiButton` to an `<a>` so it is still a link.',
  ],
  whenNotToUse: [
    { text: 'Switching between views of related content.', alternative: 'tabs' },
    { text: 'Inline navigation inside a sentence. Use a plain link.' },
  ],
  demos: [
    {
      id: 'button-variants',
      title: 'Variants',
      component: () => import('./demos/button-variants.demo').then((m) => m.ButtonVariantsDemo),
    },
    {
      id: 'button-sizes',
      title: 'Sizes',
      description: 'Every size keeps a 44px minimum touch target.',
      component: () => import('./demos/button-sizes.demo').then((m) => m.ButtonSizesDemo),
    },
    {
      id: 'button-loading',
      title: 'Loading and disabled',
      description: 'While `loading` is set the button announces `aria-busy` and ignores clicks.',
      component: () => import('./demos/button-loading.demo').then((m) => m.ButtonLoadingDemo),
    },
    {
      id: 'button-link',
      title: 'As a link',
      description: 'Use `<a muiButton>` when the action navigates.',
      component: () => import('./demos/button-link.demo').then((m) => m.ButtonLinkDemo),
    },
  ],
  guidelines: {
    do: [
      'Use one `primary` button per view for the main action.',
      'Write labels as verbs that describe the outcome: "Save changes", not "OK".',
      'Use `destructive` for actions that delete or cannot be undone, and confirm them.',
    ],
    dont: [
      'Do not use the native `disabled` attribute. Use the `disabled` input so the button stays focusable.',
      'Do not put a `muiButton` on a `<div>` or `<span>`.',
      'Do not rely on colour alone to distinguish destructive actions. Say it in the label.',
    ],
  },
  a11y: {
    roles: [
      { element: 'button[muiButton]', role: 'button (native)' },
      { element: 'a[muiButton]', role: 'link (native)' },
      { element: 'host', role: '—', notes: '`aria-disabled="true"` when disabled or loading; `aria-busy="true"` while loading.' },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Moves focus to and from the button, including when disabled.' },
      { keys: 'Enter / Space', action: 'Activates the button. Ignored while disabled or loading.' },
    ],
    notes: [
      'Icon-only buttons need an `aria-label` that describes the action.',
      'The loading spinner is decorative (`aria-hidden`). Change the label text if the state matters.',
    ],
  },
  tokens: [
    '--mui-color-primary',
    '--mui-color-primary-hover',
    '--mui-color-danger',
    '--mui-radius-md',
    '--mui-touch-target',
    '--mui-color-focus-ring',
  ],
  related: ['dialog'],
};
```

- [ ] **Step 3: Register the page and update the allowlist**

`registry.ts`:
```ts
export const REGISTRY: readonly RegistryEntry[] = [
  {
    slug: 'button',
    name: 'Button',
    group: 'primitives',
    summary: 'Triggers an action or navigation, with variants, sizes and a loading state.',
    load: () => import('./components/button/button.docs').then((m) => m.doc),
  },
];
```

Remove `"Button"` from `undocumented.json`.

- [ ] **Step 4: Run the consistency spec**

Run: `npx nx test docs --no-watch`
Expected: FAIL. The Button doc links to the `dialog` and `tabs` slugs, which don't exist yet, so `links only to documented slugs` reports `dialog` and `tabs`. This is the consistency spec doing its job: Tasks 13 and 14 add those pages.

To keep this commit green, temporarily remove `alternative: 'tabs'`, `related: ['dialog']`, and the `[Dialog](dialog)` link (make it plain text "a Dialog"). Re-run, and expect PASS.

**Then add a note to Task 14 Step 4:** restore those three links (they are listed there).

- [ ] **Step 5: Verify in the browser**

Run: `npm run docs` (dev server at http://localhost:4300).

Open `/components/button` and check:
- The h1 is "Button".
- The hero demo renders four buttons.
- The Code tab shows highlighted source.
- The API table lists `variant` as `'primary' | 'secondary' | 'ghost' | 'destructive'` and shows `clicked` under Outputs.
- There are no console errors.

- [ ] **Step 6: Commit**

```bash
npx prettier --write projects/docs/src/content
npx nx lint docs
git add projects/docs/src/content
git commit -m "docs(site): add Button pilot page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Pilot page — Dialog

**Files:**
- Create:
  - `projects/docs/src/content/components/dialog/dialog.docs.ts`
  - `projects/docs/src/content/components/dialog/demos/dialog-basic.demo.ts`
  - `projects/docs/src/content/components/dialog/demos/dialog-sizes.demo.ts`
  - `projects/docs/src/content/components/dialog/demos/dialog-dismissal.demo.ts`
- Modify:
  - `projects/docs/src/content/registry.ts`
  - `projects/docs/src/content/undocumented.json` (remove `"Dialog"`)

- [ ] **Step 1: Write the demos**

`dialog-basic.demo.ts`:
```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Dialog } from '@mushilu-san/ui/feedback';
import { Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-dialog-basic-demo',
  imports: [Dialog, Button, Stack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button muiButton (clicked)="open.set(true)">Edit profile</button>

    <mui-dialog heading="Edit profile" [(open)]="open">
      <p>Changes are saved to your account and visible to your team.</p>
      <mui-stack slot="footer" direction="row" justify="end" [gap]="2">
        <button muiButton variant="secondary" (clicked)="open.set(false)">Cancel</button>
        <button muiButton (clicked)="open.set(false)">Save</button>
      </mui-stack>
    </mui-dialog>
  `,
})
export class DialogBasicDemo {
  protected readonly open = signal(false);
}
```

`dialog-sizes.demo.ts`:
```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Dialog, type DialogSize } from '@mushilu-san/ui/feedback';
import { Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-dialog-sizes-demo',
  imports: [Dialog, Button, Stack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-stack direction="row" [gap]="2" wrap>
      @for (s of sizes; track s) {
        <button muiButton variant="secondary" (clicked)="size.set(s); open.set(true)">{{ s }}</button>
      }
    </mui-stack>

    <mui-dialog [heading]="'Size: ' + size()" [size]="size()" [(open)]="open">
      <p>The panel width follows the <code>size</code> input and never exceeds the viewport.</p>
    </mui-dialog>
  `,
})
export class DialogSizesDemo {
  protected readonly sizes: DialogSize[] = ['sm', 'md', 'lg'];
  protected readonly size = signal<DialogSize>('md');
  protected readonly open = signal(false);
}
```

`DialogSize` is `'sm' | 'md' | 'lg'` (from `dialog.types.ts`).

`dialog-dismissal.demo.ts`:
```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Dialog } from '@mushilu-san/ui/feedback';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-dialog-dismissal-demo',
  imports: [Dialog, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button muiButton variant="secondary" (clicked)="open.set(true)">Open locked dialog</button>

    <mui-dialog
      heading="Finish setup"
      [closeOnBackdrop]="false"
      [closeOnEscape]="false"
      [(open)]="open"
    >
      <p>Backdrop clicks and Escape are disabled. Use the close button or the action below.</p>
      <button muiButton slot="footer" (clicked)="open.set(false)">Done</button>
    </mui-dialog>
  `,
})
export class DialogDismissalDemo {
  protected readonly open = signal(false);
}
```

- [ ] **Step 2: Write `dialog.docs.ts`**

```ts
import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'dialog',
  name: 'Dialog',
  group: 'feedback',
  selector: 'mui-dialog',
  apiClasses: ['Dialog'],
  summary: 'A modal window for focused tasks, built on the native <dialog> element.',
  description: [
    'Dialog renders a native `<dialog>` opened with `showModal()`. The browser makes the rest of the page inert, traps focus, and returns it to the trigger when the dialog closes.',
    'Open state is a two-way `open` model. Bind it with `[(open)]` and close the dialog from your own actions by setting it to `false`.',
  ],
  whenToUse: [
    'A short, focused task that must be finished or cancelled before continuing, such as editing a record.',
    'Content that needs the user’s full attention but not a separate page.',
  ],
  whenNotToUse: [
    { text: 'Long or multi-step flows. Use a page.' },
    { text: 'Non-blocking confirmations. Show a toast instead.' },
  ],
  demos: [
    {
      id: 'dialog-basic',
      title: 'Basic',
      component: () => import('./demos/dialog-basic.demo').then((m) => m.DialogBasicDemo),
    },
    {
      id: 'dialog-sizes',
      title: 'Sizes',
      component: () => import('./demos/dialog-sizes.demo').then((m) => m.DialogSizesDemo),
    },
    {
      id: 'dialog-dismissal',
      title: 'Controlling dismissal',
      description: 'Turn off `closeOnBackdrop` and `closeOnEscape` when closing by accident would lose work.',
      component: () => import('./demos/dialog-dismissal.demo').then((m) => m.DialogDismissalDemo),
    },
  ],
  guidelines: {
    do: [
      'Always set a `heading`. It becomes the dialog’s accessible name.',
      'Put actions in the `slot="footer"` area, with the primary action last.',
      'Keep the content short enough to scan without scrolling on a phone.',
    ],
    dont: [
      'Do not open a dialog on page load.',
      'Do not stack dialogs on top of each other.',
      'Do not disable every way to close the dialog. Keep at least one visible action.',
    ],
  },
  a11y: {
    roles: [
      { element: 'dialog', role: 'dialog (native, modal)', notes: '`aria-labelledby` points at the heading when `heading` is set.' },
      { element: 'close button', role: 'button', notes: 'Labelled "Close dialog".' },
    ],
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Cycles focus within the dialog while it is open.' },
      { keys: 'Escape', action: 'Closes the dialog unless `closeOnEscape` is false.' },
    ],
    notes: [
      'Focus moves into the dialog on open and returns to the element that opened it on close.',
      'The page behind the dialog is inert while it is open. This is native `showModal()` behaviour.',
    ],
  },
  tokens: ['--mui-color-surface-raised', '--mui-color-overlay', '--mui-radius-lg', '--mui-shadow-5', '--mui-z-modal'],
  related: ['button'],
};
```

- [ ] **Step 3: Register the page**

Append to `REGISTRY`:
```ts
  {
    slug: 'dialog',
    name: 'Dialog',
    group: 'feedback',
    summary: 'A modal window for focused tasks, built on the native <dialog> element.',
    load: () => import('./components/dialog/dialog.docs').then((m) => m.doc),
  },
```
Remove `"Dialog"` from `undocumented.json`. Restore `related: ['dialog']` and the `[Dialog](dialog)` inline link in `button.docs.ts`.

- [ ] **Step 4: Test and verify**

Run: `npx nx test docs --no-watch`
Expected: PASS.

Run: `npm run docs`. Open `/components/dialog` and check:
1. Opening the basic demo moves focus inside the dialog.
2. Escape closes it.
3. Focus returns to the "Edit profile" button.

- [ ] **Step 5: Commit**

```bash
npx prettier --write projects/docs/src/content
npx nx lint docs
git add projects/docs/src/content
git commit -m "docs(site): add Dialog pilot page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Pilot page — Tabs

**Files:**
- Create:
  - `projects/docs/src/content/components/tabs/tabs.docs.ts`
  - `projects/docs/src/content/components/tabs/demos/tabs-basic.demo.ts`
  - `projects/docs/src/content/components/tabs/demos/tabs-vertical.demo.ts`
  - `projects/docs/src/content/components/tabs/demos/tabs-disabled.demo.ts`
- Modify:
  - `projects/docs/src/content/registry.ts`
  - `projects/docs/src/content/undocumented.json` (remove `"Tabs"`, `"TabList"`, `"Tab"`, `"TabPanel"`)
  - `projects/docs/src/content/components/button/button.docs.ts`

The library builds tab ids from `value` (`mui-tab-<value>`), so every demo uses values that are unique across the whole page.

- [ ] **Step 1: Write the demos**

`tabs-basic.demo.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab, TabList, TabPanel, Tabs } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-tabs-basic-demo',
  imports: [Tabs, TabList, Tab, TabPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-tabs activeTab="basic-account">
      <mui-tab-list aria-label="Account settings">
        <mui-tab value="basic-account">Account</mui-tab>
        <mui-tab value="basic-password">Password</mui-tab>
        <mui-tab value="basic-billing">Billing</mui-tab>
      </mui-tab-list>
      <mui-tab-panel value="basic-account">Update your name and email address.</mui-tab-panel>
      <mui-tab-panel value="basic-password">Change your password and enable two-factor sign-in.</mui-tab-panel>
      <mui-tab-panel value="basic-billing">Manage your plan and payment method.</mui-tab-panel>
    </mui-tabs>
  `,
})
export class TabsBasicDemo {}
```

`tabs-vertical.demo.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab, TabList, TabPanel, Tabs } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-tabs-vertical-demo',
  imports: [Tabs, TabList, Tab, TabPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    mui-tabs {
      display: flex;
      gap: var(--mui-space-4);
    }
    mui-tab-list {
      min-width: 140px;
    }
  `,
  template: `
    <mui-tabs activeTab="vert-profile" orientation="vertical">
      <mui-tab-list aria-label="Profile sections">
        <mui-tab value="vert-profile">Profile</mui-tab>
        <mui-tab value="vert-notifications">Notifications</mui-tab>
        <mui-tab value="vert-security">Security</mui-tab>
      </mui-tab-list>
      <div>
        <mui-tab-panel value="vert-profile">Public profile details.</mui-tab-panel>
        <mui-tab-panel value="vert-notifications">Email and push preferences.</mui-tab-panel>
        <mui-tab-panel value="vert-security">Sessions and connected devices.</mui-tab-panel>
      </div>
    </mui-tabs>
  `,
})
export class TabsVerticalDemo {}
```

`tabs-disabled.demo.ts`:
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab, TabList, TabPanel, Tabs } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-tabs-disabled-demo',
  imports: [Tabs, TabList, Tab, TabPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-tabs activeTab="dis-overview">
      <mui-tab-list aria-label="Project">
        <mui-tab value="dis-overview">Overview</mui-tab>
        <mui-tab value="dis-reports" disabled>Reports</mui-tab>
        <mui-tab value="dis-members">Members</mui-tab>
      </mui-tab-list>
      <mui-tab-panel value="dis-overview">Project summary.</mui-tab-panel>
      <mui-tab-panel value="dis-reports">Reports are available on paid plans.</mui-tab-panel>
      <mui-tab-panel value="dis-members">Invite and manage members.</mui-tab-panel>
    </mui-tabs>
  `,
})
export class TabsDisabledDemo {}
```

- [ ] **Step 2: Write `tabs.docs.ts`**

```ts
import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'tabs',
  name: 'Tabs',
  group: 'navigation',
  selector: 'mui-tabs',
  apiClasses: ['Tabs', 'TabList', 'Tab', 'TabPanel'],
  summary: 'Switches between related panels of content in the same view.',
  description: [
    'Tabs is a compound component. `mui-tabs` holds the active value, `mui-tab-list` holds the `mui-tab` triggers, and each `mui-tab-panel` shows when its `value` matches.',
    'The active tab is a two-way `activeTab` model, so you can bind it with `[(activeTab)]` to sync it with the URL or other state.',
  ],
  whenToUse: [
    'Grouping related content that users switch between without leaving the page.',
    'Settings or detail screens with a few peer sections.',
  ],
  whenNotToUse: [
    { text: 'Triggering an action. Tabs only switch views.', alternative: 'button' },
    { text: 'Sequential steps that must be done in order. Use a stepper or a multi-step form.' },
    { text: 'More than about six sections. Use a sidebar or a menu.' },
  ],
  demos: [
    { id: 'tabs-basic', title: 'Basic', component: () => import('./demos/tabs-basic.demo').then((m) => m.TabsBasicDemo) },
    {
      id: 'tabs-vertical',
      title: 'Vertical',
      description: 'With `orientation="vertical"`, Up and Down arrows move between tabs.',
      component: () => import('./demos/tabs-vertical.demo').then((m) => m.TabsVerticalDemo),
    },
    {
      id: 'tabs-disabled',
      title: 'Disabled tab',
      description: 'Disabled tabs are skipped by arrow-key navigation and cannot be activated.',
      component: () => import('./demos/tabs-disabled.demo').then((m) => m.TabsDisabledDemo),
    },
  ],
  guidelines: {
    do: [
      'Give every `mui-tab-list` an `aria-label` that names the group.',
      'Keep tab labels short, one or two words.',
      'Use `value`s that are unique on the page. Tab ids are derived from them.',
    ],
    dont: [
      'Do not nest tabs inside tabs.',
      'Do not put the only path to critical content behind a disabled tab without explaining why.',
    ],
  },
  a11y: {
    roles: [
      { element: 'mui-tab-list', role: 'tablist', notes: '`aria-orientation` follows the `orientation` input.' },
      { element: 'mui-tab', role: 'tab', notes: '`aria-selected`, `aria-controls`; `aria-disabled` when disabled.' },
      { element: 'mui-tab-panel', role: 'tabpanel', notes: '`aria-labelledby` points at its tab.' },
    ],
    keyboard: [
      { keys: 'ArrowLeft / ArrowRight', action: 'Moves focus between tabs (horizontal). Wraps at the ends.' },
      { keys: 'ArrowUp / ArrowDown', action: 'Moves focus between tabs (vertical).' },
      { keys: 'Home / End', action: 'Moves focus to the first or last enabled tab.' },
      { keys: 'Enter / Space', action: 'Activates the focused tab.' },
    ],
    notes: [
      'Activation is manual. Arrow keys move focus, and Enter or Space selects. This avoids loading panels the user is only passing over.',
    ],
  },
  tokens: ['--mui-color-primary', '--mui-color-border', '--mui-color-text-muted', '--mui-touch-target'],
  related: ['button'],
};
```

- [ ] **Step 3: Register the page**

Append to `REGISTRY`:
```ts
  {
    slug: 'tabs',
    name: 'Tabs',
    group: 'navigation',
    summary: 'Switches between related panels of content in the same view.',
    load: () => import('./components/tabs/tabs.docs').then((m) => m.doc),
  },
```
Remove `"Tabs"`, `"TabList"`, `"Tab"`, `"TabPanel"` from `undocumented.json`. Restore `alternative: 'tabs'` on the first `whenNotToUse` entry in `button.docs.ts`.

- [ ] **Step 4: Test and verify**

Run: `npx nx test docs --no-watch`
Expected: PASS. The consistency spec now sees all three pilots, and the links between them resolve.

Run: `npx nx build docs`
Expected: `dist/docs/browser/components/{button,dialog,tabs}/index.html` all exist. Each contains its `<h1>` and the "Overview" heading in the prerendered HTML, which proves the `resource` was awaited during prerender:
```bash
grep -l '<h2 id="overview-h"' dist/docs/browser/components/*/index.html
```
Expected: three file paths.

- [ ] **Step 5: Commit**

```bash
npx prettier --write projects/docs/src/content
npx nx lint docs
git add projects/docs/src/content
git commit -m "docs(site): add Tabs pilot page and cross-link pilots

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Home, Getting started, Components index, Group page

**Files:**
- Create:
  - `projects/docs/src/app/shared/component-card/component-card.ts`
  - `projects/docs/src/app/pages/getting-started/getting-started.ts`
  - `projects/docs/src/app/pages/components-index/components-index.ts`
  - `projects/docs/src/app/pages/group/group-page.ts`
  - `projects/docs/src/app/pages/pages.spec.ts`
- Modify:
  - `projects/docs/src/app/pages/home/home.ts`
  - `projects/docs/src/app/pages/home/home.spec.ts`
  - `projects/docs/src/app/app.routes.ts` (point the three placeholder routes at the real pages)

**Interfaces:**
- Consumes: `DOCS_REGISTRY`, `GROUPS`, `CodeBlock` + `plainLines`, `Button`, `Badge`.
- Produces:
  - `ComponentCard` (`docs-component-card`, input `entry: RegistryEntry`)
  - `GettingStarted`
  - `ComponentsIndex`
  - `GroupPage` (route input `group`)
  - The real `Home`

- [ ] **Step 1: Write the failing tests**

`pages/pages.spec.ts`:
```ts
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { provideMushiluUi } from '@mushilu-san/ui';
import { DOCS_REGISTRY } from '../../content/tokens';
import type { RegistryEntry } from '../../content/types';
import { ComponentsIndex } from './components-index/components-index';
import { GettingStarted } from './getting-started/getting-started';
import { GroupPage } from './group/group-page';

const registry: RegistryEntry[] = [
  { slug: 'button', name: 'Button', group: 'primitives', summary: 'Clicks.', load: () => Promise.reject(new Error('unused')) },
  { slug: 'tabs', name: 'Tabs', group: 'navigation', summary: 'Switches.', load: () => Promise.reject(new Error('unused')) },
];
const providers = [provideRouter([]), provideMushiluUi(), { provide: DOCS_REGISTRY, useValue: registry }];

describe('GettingStarted', () => {
  it('shows install, provider and styles steps', async () => {
    await render(GettingStarted, { providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Installation' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Terminal source' })).toHaveTextContent('npm install @mushilu-san/ui');
    expect(screen.getByRole('region', { name: 'app.config.ts source' })).toHaveTextContent('provideMushiluUi()');
  });
});

describe('ComponentsIndex', () => {
  it('lists documented components grouped, linking to each page', async () => {
    await render(ComponentsIndex, { providers });
    expect(screen.getByRole('heading', { level: 2, name: 'Primitives' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Button/ })).toHaveAttribute('href', '/components/button');
    expect(screen.queryByRole('heading', { level: 2, name: 'Forms' })).not.toBeInTheDocument();
  });
});

describe('GroupPage', () => {
  it('shows the group description, import path and its components', async () => {
    await render(GroupPage, { inputs: { group: 'navigation' }, providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Navigation' })).toBeInTheDocument();
    expect(screen.getByText('@mushilu-san/ui/navigation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Tabs/ })).toBeInTheDocument();
  });

  it('says when a group has no documented components yet', async () => {
    await render(GroupPage, { inputs: { group: 'forms' }, providers });
    expect(screen.getByText(/documentation for this group is coming soon/i)).toBeInTheDocument();
  });

  it('renders not-found for an unknown group', async () => {
    await render(GroupPage, { inputs: { group: 'nope' }, providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
  });
});
```

Update `home.spec.ts`:
```ts
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { provideMushiluUi } from '@mushilu-san/ui';
import { Home } from './home';

describe('Home', () => {
  it('renders the hero, primary calls to action and the group grid', async () => {
    await render(Home, { providers: [provideRouter([]), provideMushiluUi()] });
    expect(screen.getByRole('heading', { level: 1, name: 'Mushilu-San UI' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/getting-started');
    expect(screen.getByRole('link', { name: 'Browse components' })).toHaveAttribute('href', '/components');
    expect(screen.getAllByRole('link', { name: /Primitives|Forms|Layout/ }).length).toBeGreaterThanOrEqual(3);
  });
});
```

Run: `npx nx test docs --no-watch`
Expected: FAIL, because the modules are not found.

- [ ] **Step 2: Implement `ComponentCard`**

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { RegistryEntry } from '../../../content/types';

@Component({
  selector: 'docs-component-card',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    a {
      display: block;
      height: 100%;
      min-height: var(--mui-touch-target);
      padding: var(--mui-space-4);
      border: 1px solid var(--mui-color-border);
      border-radius: var(--mui-radius-lg);
      color: var(--mui-color-text);
      text-decoration: none;
      transition: border-color var(--mui-duration-fast) var(--mui-easing-default);
    }
    a:hover {
      border-color: var(--mui-color-primary);
    }
    .name {
      display: block;
      font-weight: var(--mui-font-weight-semibold);
    }
    .summary {
      display: block;
      margin-top: var(--mui-space-1);
      color: var(--mui-color-text-muted);
      font-size: var(--mui-font-size-sm);
    }
  `,
  template: `
    <a [routerLink]="['/components', entry().slug]">
      <span class="name">{{ entry().name }}</span>
      <span class="summary">{{ entry().summary }}</span>
    </a>
  `,
})
export class ComponentCard {
  readonly entry = input.required<RegistryEntry>();
}
```

- [ ] **Step 3: Implement `GettingStarted`**

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlock, plainLines } from '../../shared/code-block/code-block';

const INSTALL = 'npm install @mushilu-san/ui';
const CONFIG = `import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideMushiluUi } from '@mushilu-san/ui';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), provideMushiluUi()],
};`;
const STYLES = `"styles": [
  "node_modules/@mushilu-san/ui/styles/reset.css",
  "node_modules/@mushilu-san/ui/styles/tokens.css",
  "src/styles.css"
]`;
const USAGE = `import { Component } from '@angular/core';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'app-root',
  imports: [Button],
  template: \`<button muiButton (clicked)="save()">Save</button>\`,
})
export class App {
  save() {}
}`;

@Component({
  selector: 'docs-getting-started',
  imports: [CodeBlock, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      max-width: var(--docs-content-max);
    }
    ol {
      padding-inline-start: var(--mui-space-5);
    }
    li + li {
      margin-top: var(--mui-space-8);
    }
    docs-code-block {
      margin-top: var(--mui-space-3);
    }
  `,
  template: `
    <h1>Installation</h1>
    <p>Add the package, register the provider, and include the design tokens. Every component is standalone. Import only what you use from its group entry point.</p>
    <ol>
      <li>
        <h2>Install</h2>
        <docs-code-block label="Terminal" [lines]="installLines" [source]="install" />
      </li>
      <li>
        <h2>Provide the library</h2>
        <p>The library is zoneless and needs Angular 22.</p>
        <docs-code-block label="app.config.ts" [lines]="configLines" [source]="config" />
      </li>
      <li>
        <h2>Include the styles</h2>
        <p><code>tokens.css</code> defines every <code>--mui-*</code> token, including dark mode. <code>reset.css</code> is optional.</p>
        <docs-code-block label="angular.json (build options)" [lines]="stylesLines" [source]="styles" />
      </li>
      <li>
        <h2>Use a component</h2>
        <docs-code-block label="app.ts" [lines]="usageLines" [source]="usage" />
        <p>Next: browse <a routerLink="/components">all components</a>.</p>
      </li>
    </ol>
  `,
})
export class GettingStarted {
  protected readonly install = INSTALL;
  protected readonly installLines = plainLines(INSTALL);
  protected readonly config = CONFIG;
  protected readonly configLines = plainLines(CONFIG);
  protected readonly styles = STYLES;
  protected readonly stylesLines = plainLines(STYLES);
  protected readonly usage = USAGE;
  protected readonly usageLines = plainLines(USAGE);
}
```

The styles paths assume the package ships `styles/` at its root, as CLAUDE.md says (`dist/ui/styles/`). Confirm that with `ls dist/ui/styles` after `npm run build`. If the folder name differs, use the real one.

- [ ] **Step 4: Implement `ComponentsIndex` and `GroupPage`**

`components-index.ts`:
```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GROUPS } from '../../../content/groups';
import { DOCS_REGISTRY } from '../../../content/tokens';
import { ComponentCard } from '../../shared/component-card/component-card';

@Component({
  selector: 'docs-components-index',
  imports: [ComponentCard, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--mui-space-4);
      padding: 0;
      list-style: none;
    }
    h2 a {
      color: inherit;
      text-decoration: none;
    }
  `,
  template: `
    <h1>Components</h1>
    <p>Every documented component, by entry point.</p>
    @for (g of groups; track g.id) {
      <section [attr.aria-labelledby]="'g-' + g.id">
        <h2 [id]="'g-' + g.id"><a [routerLink]="['/components/group', g.id]">{{ g.label }}</a></h2>
        <ul class="grid">
          @for (e of g.entries; track e.slug) {
            <li><docs-component-card [entry]="e" /></li>
          }
        </ul>
      </section>
    }
  `,
})
export class ComponentsIndex {
  private readonly registry = inject(DOCS_REGISTRY);
  protected readonly groups = GROUPS.map((g) => ({
    ...g,
    entries: this.registry.filter((e) => e.group === g.id),
  })).filter((g) => g.entries.length > 0);
}
```

`group/group-page.ts`:
```ts
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { GROUPS } from '../../../content/groups';
import { DOCS_REGISTRY } from '../../../content/tokens';
import { ComponentCard } from '../../shared/component-card/component-card';
import { NotFound } from '../not-found/not-found';

@Component({
  selector: 'docs-group-page',
  imports: [ComponentCard, NotFound],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--mui-space-4);
      padding: 0;
      list-style: none;
    }
  `,
  template: `
    @if (info(); as g) {
      <h1>{{ g.label }}</h1>
      <p>{{ g.description }}</p>
      <p>Import from <code>{{ g.entry }}</code></p>
      @if (entries().length > 0) {
        <ul class="grid">
          @for (e of entries(); track e.slug) {
            <li><docs-component-card [entry]="e" /></li>
          }
        </ul>
      } @else {
        <p>Documentation for this group is coming soon. Meanwhile, see the Storybook.</p>
      }
    } @else {
      <docs-not-found />
    }
  `,
})
export class GroupPage {
  readonly group = input.required<string>();
  private readonly registry = inject(DOCS_REGISTRY);
  protected readonly info = computed(() => GROUPS.find((g) => g.id === this.group()));
  protected readonly entries = computed(() => this.registry.filter((e) => e.group === this.group()));
}
```

- [ ] **Step 5: Implement the real `Home`**

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stack } from '@mushilu-san/ui/layout';
import { Badge, Button } from '@mushilu-san/ui/primitives';
import { GROUPS } from '../../../content/groups';

@Component({
  selector: 'docs-home',
  imports: [RouterLink, Button, Badge, Stack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .hero {
      max-width: 720px;
      padding-block: var(--mui-space-12) var(--mui-space-10);
    }
    h1 {
      margin: var(--mui-space-3) 0;
      font-size: clamp(2rem, 6vw, 3.25rem);
      line-height: 1.1;
      letter-spacing: -0.02em;
    }
    .lede {
      color: var(--mui-color-text-muted);
      font-size: var(--mui-font-size-lg);
    }
    .facts {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mui-space-2);
      margin-top: var(--mui-space-6);
      padding: 0;
      list-style: none;
    }
    .groups {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--mui-space-4);
      padding: 0;
      list-style: none;
    }
    .groups a {
      display: block;
      height: 100%;
      padding: var(--mui-space-5);
      border: 1px solid var(--mui-color-border);
      border-radius: var(--mui-radius-lg);
      color: var(--mui-color-text);
      text-decoration: none;
    }
    .groups a:hover {
      border-color: var(--mui-color-primary);
    }
    .groups strong {
      display: block;
    }
    .groups span {
      color: var(--mui-color-text-muted);
      font-size: var(--mui-font-size-sm);
    }
  `,
  template: `
    <section class="hero">
      <mui-badge variant="primary" size="sm">Angular 22 · zoneless</mui-badge>
      <h1>Mushilu-San UI</h1>
      <p class="lede">Mobile-first, token-themed, accessible Angular components, with no runtime dependencies beyond Angular itself.</p>
      <mui-stack direction="row" [gap]="3" wrap>
        <a muiButton routerLink="/getting-started">Get started</a>
        <a muiButton variant="secondary" routerLink="/components">Browse components</a>
      </mui-stack>
      <ul class="facts">
        <li><mui-badge>Signals API</mui-badge></li>
        <li><mui-badge>WCAG AA</mui-badge></li>
        <li><mui-badge>44px touch targets</mui-badge></li>
        <li><mui-badge>Dark mode</mui-badge></li>
      </ul>
    </section>
    <section aria-labelledby="groups-h">
      <h2 id="groups-h">Entry points</h2>
      <ul class="groups">
        @for (g of groups; track g.id) {
          <li>
            <a [routerLink]="['/components/group', g.id]">
              <strong>{{ g.label }}</strong>
              <span>{{ g.description }}</span>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
})
export class Home {
  protected readonly groups = GROUPS;
}
```

- [ ] **Step 6: Wire the real routes**

In `app.routes.ts`, replace the three `NotFound` placeholders:
```ts
  { path: 'getting-started', title: 'Installation', loadComponent: () => import('./pages/getting-started/getting-started').then((m) => m.GettingStarted) },
  { path: 'components', title: 'Components', loadComponent: () => import('./pages/components-index/components-index').then((m) => m.ComponentsIndex) },
  { path: 'components/group/:group', title: groupTitle, loadComponent: () => import('./pages/group/group-page').then((m) => m.GroupPage) },
```

- [ ] **Step 7: Test**

Run: `npx nx test docs --no-watch`
Expected: PASS.

If the `Home` group-link assertion matches the "Browse components" link too, narrow it with `getByRole('link', { name: /^Primitives/ })`.

- [ ] **Step 8: Commit**

```bash
npx prettier --write projects/docs/src/app
npx nx lint docs
git add projects/docs/src/app
git commit -m "feat(docs): add home, installation, components index and group pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 16: Build smoke check (`verify-build.mjs`)

**Files:**
- Create:
  - `projects/docs/scripts/verify-build.mjs`
  - `projects/docs/scripts/verify-build.spec.mjs`
- Modify:
  - `projects/docs/project.json` (add the `verify-build` target)
  - `package.json` (add a `docs:verify` script)

**Interfaces:**
- Produces:
  - `verifyBuild(browserDir: string, expectedRoutes: string[]): string[]`, which returns a list of problems (empty means OK)
  - `expectedRoutes(slugs: string[], groups: string[]): string[]`
  - A CLI that reads slugs from `src/content/registry.ts` with a regex (`slug: '<x>'`) and groups from `GROUPS` in `extract-api.mjs`. It exits 1 if there are problems.

- [ ] **Step 1: Write the failing tests**

`verify-build.spec.mjs`:
```js
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { expectedRoutes, verifyBuild } from './verify-build.mjs';

function site(paths) {
  const dir = mkdtempSync(join(tmpdir(), 'site-'));
  for (const p of paths) {
    mkdirSync(join(dir, p), { recursive: true });
    writeFileSync(join(dir, p, 'index.html'), '<h1>x</h1>');
  }
  writeFileSync(join(dir, 'index.csr.html'), '');
  return dir;
}

describe('expectedRoutes', () => {
  it('includes static pages, groups and slugs', () => {
    expect(expectedRoutes(['button'], ['forms'])).toEqual([
      '',
      'getting-started',
      'components',
      'components/group/forms',
      'components/button',
    ]);
  });
});

describe('verifyBuild', () => {
  it('passes when every route has an index.html and index.csr.html exists', () => {
    const routes = expectedRoutes(['button'], ['forms']);
    expect(verifyBuild(site(routes), routes)).toEqual([]);
  });

  it('reports missing routes', () => {
    const routes = expectedRoutes(['button'], ['forms']);
    expect(verifyBuild(site(['', 'components']), routes)).toContain(
      'missing prerendered page: components/button/index.html',
    );
  });
});
```

- [ ] **Step 2: Implement `verify-build.mjs`**

```js
// Verifies the static docs build: every registry route was prerendered and the
// client-render fallback exists. Usage: node projects/docs/scripts/verify-build.mjs
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { GROUPS } from './extract-api.mjs';

export function expectedRoutes(slugs, groups) {
  return [
    '',
    'getting-started',
    'components',
    ...groups.map((g) => `components/group/${g}`),
    ...slugs.map((s) => `components/${s}`),
  ];
}

export function verifyBuild(browserDir, routes) {
  const problems = [];
  for (const route of routes) {
    const rel = join(route, 'index.html');
    if (!existsSync(join(browserDir, rel))) problems.push(`missing prerendered page: ${rel}`);
  }
  if (!existsSync(join(browserDir, 'index.csr.html'))) problems.push('missing index.csr.html (404 fallback)');
  return problems;
}

function main() {
  const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const registry = readFileSync(resolve(docsRoot, 'src/content/registry.ts'), 'utf8');
  const slugs = [...registry.matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => m[1]);
  const browserDir = resolve(docsRoot, '../../dist/docs/browser');
  const problems = verifyBuild(browserDir, expectedRoutes(slugs, GROUPS));
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log(`verify-build: ${slugs.length} component pages + ${GROUPS.length} groups OK`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
```

- [ ] **Step 3: Run the tests**

Run: `npm run test:scripts`
Expected: PASS.

- [ ] **Step 4: Wire the target and script, then run against a real build**

`project.json`:
```json
"verify-build": {
  "executor": "nx:run-commands",
  "dependsOn": ["build"],
  "options": { "command": "node projects/docs/scripts/verify-build.mjs" }
}
```
`package.json` scripts: `"docs:verify": "nx run docs:verify-build"`. Do not regenerate the lockfile: adding a script doesn't affect dependency resolution. CLAUDE.md rule 1 still applies, though, so run `npm install` anyway. It should be a no-op diff on `package-lock.json`. Commit both files if the lockfile changes.

Run: `npm run docs:verify`
Expected: `verify-build: 3 component pages + 8 groups OK`.

- [ ] **Step 5: Commit**

```bash
npx prettier --write projects/docs/scripts projects/docs/project.json package.json
git add projects/docs/scripts projects/docs/project.json package.json package-lock.json
git commit -m "test(docs): verify every registry route is prerendered

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 17: E2E and axe for the docs site

**Files:**
- Create:
  - `playwright.docs.config.ts`
  - `projects/docs/e2e/docs.e2e.ts`
  - `projects/docs/e2e/a11y.e2e.ts`
- Modify:
  - `package.json` and `package-lock.json` (add `@axe-core/playwright` and the `e2e:docs` script)

**Interfaces:**
- Consumes: the production build in `dist/docs/browser`, served at `http://localhost:4301` with `baseHref` `/`.
- Produces: the npm script `e2e:docs`.

- [ ] **Step 1: Install axe**

```bash
npm install -D @axe-core/playwright@^4.10.0
```
In `package.json` scripts, add:
```json
"e2e:docs": "nx build docs && playwright test -c playwright.docs.config.ts",
```

- [ ] **Step 2: Create `playwright.docs.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './projects/docs/e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4301',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx http-server dist/docs/browser -p 4301 -c-1 --silent',
    port: 4301,
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
```

`http-server` serves `components/button/` → `components/button/index.html` automatically.

- [ ] **Step 3: Write `projects/docs/e2e/docs.e2e.ts`**

```ts
import { type ConsoleMessage, expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/getting-started/',
  '/components/',
  '/components/group/navigation/',
  '/components/button/',
  '/components/dialog/',
  '/components/tabs/',
];

for (const route of ROUTES) {
  test(`${route} loads without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto(route);
    await expect(page.locator('main h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
}

test('client navigation moves focus to the new h1', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop sidebar');
  await page.goto('/components/button/');
  await page.getByRole('complementary').getByRole('link', { name: 'Tabs' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Tabs' })).toBeFocused();
  await expect(page).toHaveTitle('Tabs · Mushilu-San UI');
});

test('theme toggle persists across reloads', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Theme: system/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: /^Theme: light/ })).toBeVisible();
});

test('copy button copies demo source', async ({ page, context, isMobile }) => {
  test.skip(isMobile, 'clipboard permissions are desktop-only in Playwright');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/components/button/');
  const hero = page.locator('docs-demo-viewer').first();
  await hero.getByRole('tab', { name: 'Code' }).click();
  await hero.getByRole('button', { name: 'Copy code' }).click();
  await expect(hero.getByRole('button', { name: 'Copied' })).toBeVisible();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain('ButtonVariantsDemo');
});

test('dialog demo: focus moves in, Escape closes, focus returns', async ({ page }) => {
  await page.goto('/components/dialog/');
  const trigger = page.getByRole('button', { name: 'Edit profile' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Edit profile' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(':focus')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('mobile nav sheet: opens, Escape closes, focus returns', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open navigation' });
  await menu.click();
  const sheet = page.getByRole('dialog', { name: 'Navigation' });
  await expect(sheet).toBeVisible();
  await expect(sheet.locator(':focus')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(menu).toBeFocused();
});

test('unknown URL falls back to client-rendered not-found', async ({ page }) => {
  const res = await page.goto('/does-not-exist/');
  expect(res?.status()).toBe(404);
});
```

`http-server` does not serve `404.html` the way Pages does, so the last test only asserts the status. The Pages 404 fallback is covered by the deploy step in Task 18.

- [ ] **Step 4: Write `projects/docs/e2e/a11y.e2e.ts`**

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = ['/', '/getting-started/', '/components/button/', '/components/dialog/', '/components/tabs/'];

for (const theme of ['light', 'dark'] as const) {
  for (const route of PAGES) {
    test(`axe: ${route} (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('docs-theme', t), theme);
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
    });
  }
}

test('axe: code tab contrast on a pilot page', async ({ page, isMobile }) => {
  test.skip(isMobile, 'covered by desktop');
  await page.goto('/components/tabs/');
  await page.locator('docs-demo-viewer').first().getByRole('tab', { name: 'Code' }).click();
  const results = await new AxeBuilder({ page }).include('docs-code-block').withTags(['wcag2aa']).analyze();
  expect(results.violations).toEqual([]);
});
```

- [ ] **Step 5: Run and fix**

Run:
```bash
npx playwright install chromium
npm run e2e:docs
```
Expected: all tests PASS on the `chromium` and `mobile` projects.

When axe reports violations:
- Fix them in the docs code.
- If a violation comes from a **library** component (for example, a duplicate id inside `mui-tabs`):
  1. Open an audit issue: `./scripts/open-audit-issues.sh --new <ID> <SEVERITY> accessibility "<title>" "<desc>"`.
  2. Exclude only that rule for that selector with `.exclude('<selector>')`, plus a comment that links the issue.
  3. Never disable rules globally.

- [ ] **Step 6: Commit**

```bash
npx prettier --write playwright.docs.config.ts projects/docs/e2e package.json
git add playwright.docs.config.ts projects/docs/e2e package.json package-lock.json
git commit -m "test(docs): add Playwright E2E and axe checks for the docs site

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 18: CI, local CI mirror, deploy workflow, dev helper

**Files:**
- Modify:
  - `.github/workflows/ci.yml`
  - `scripts/ci-verify.sh`
  - `dev.sh`
- Delete: `.github/workflows/storybook-deploy.yml`
- Create: `.github/workflows/docs-deploy.yml`

**Interfaces:**
- Consumes: the npm scripts `lint` (which now covers docs), `test:docs`, `docs:verify`, and `e2e:docs`.

- [ ] **Step 1: Add the docs steps to `ci.yml` (`ci-matrix` job)**

After the existing "Test release scripts" step, add:
```yaml
      # 3c. Docs site unit tests (registry consistency, components, shell)
      - name: Test docs site
        run: npm run test:docs
```

After "Build Storybook" (canonical leg only), add:
```yaml
      # 7b. Docs site: prerender every route and verify the output
      - name: Build docs site
        if: matrix.node == ''
        run: npm run docs:verify

      - name: Upload docs build
        if: matrix.node == ''
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: docs-dist-${{ github.sha }}
          path: dist/docs/browser/
          retention-days: 1
          if-no-files-found: error
```

Add a new job after `e2e`:
```yaml
  e2e-docs:
    name: E2E docs site (Playwright)
    needs: ci-matrix
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
      - uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Download docs build
        uses: actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c # v8.0.1
        with:
          name: docs-dist-${{ github.sha }}
          path: dist/docs/browser/
      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps
      - name: Run docs E2E
        run: npx playwright test -c playwright.docs.config.ts
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: playwright-docs-report-${{ github.sha }}
          path: playwright-report/
          retention-days: 7
          if-no-files-found: ignore
```

`npm run lint` already covers docs, because the `lint` script changed in Task 1.

- [ ] **Step 2: Mirror the same steps in `scripts/ci-verify.sh`**

After `npm run test:scripts`:
```bash
echo "==> Test docs site"
npm run test:docs
```

After `npm run storybook:build`:
```bash
echo "==> Build + verify docs site"
npm run docs:verify
```

After the E2E block:
```bash
echo "==> Docs site E2E"
npx playwright test -c playwright.docs.config.ts
```

Update the usage comment on line 3 to read `… -> storybook build -> docs build -> e2e -> docs e2e.`

- [ ] **Step 3: Replace the deploy workflow**

```bash
git rm .github/workflows/storybook-deploy.yml
```

`.github/workflows/docs-deploy.yml`:
```yaml
name: Deploy docs

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    timeout-minutes: 25
    steps:
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0

      - uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'

      - name: Cache Angular build cache
        uses: actions/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0
        with:
          path: .angular/cache
          key: angular-cache-${{ runner.os }}-nvmrc-${{ hashFiles('package-lock.json') }}-${{ github.sha }}
          restore-keys: |
            angular-cache-${{ runner.os }}-nvmrc-${{ hashFiles('package-lock.json') }}-
            angular-cache-${{ runner.os }}-nvmrc-

      - name: Install dependencies
        run: npm ci

      - uses: actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6.0.0
        id: pages

      # Pages serves this repo under /<repo>/ — base path comes from configure-pages.
      - name: Build docs site
        run: npx nx build docs --baseHref="${{ steps.pages.outputs.base_path }}/"

      - name: Build Storybook into /storybook
        run: |
          npm run storybook:build
          cp -R storybook-static dist/docs/browser/storybook

      # Unknown URLs: GitHub Pages serves 404.html; use the client-render shell.
      - name: Add 404 fallback
        run: cp dist/docs/browser/index.csr.html dist/docs/browser/404.html

      - uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5.0.0
        with:
          path: dist/docs/browser

      - id: deployment
        uses: actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128 # v5.0.0
```

The `deploy-pages` pin is copied verbatim from the old `storybook-deploy.yml`.

- [ ] **Step 4: Add docs commands to `dev.sh`**

Add these entries to the header comment's command list:
```
#   docs              Start the docs site dev server on port 4300
#   docs:build        Build + verify the prerendered docs site → dist/docs/browser
#   test:docs         Run docs site unit tests (single pass)
```
Add these cases before `clean)`:
```bash
  docs)
    npx nx serve docs
    ;;

  docs:build)
    npm run docs:verify
    ;;

  test:docs)
    npm run test:docs
    ;;
```
Extend `clean` to also remove `dist/docs projects/docs/src/generated`. Read the existing `clean)` case first and append those two paths to its `rm -rf` line.

- [ ] **Step 5: Run the full local mirror**

Run: `./scripts/ci-verify.sh`
Expected: it ends with `✅ All CI steps passed locally.`

Any failure blocks the commit. Fix the root cause and do not skip steps.

- [ ] **Step 6: Commit**

```bash
npx prettier --write .github/workflows/docs-deploy.yml .github/workflows/ci.yml
git add .github/workflows scripts/ci-verify.sh dev.sh
git commit -m "ci(docs): build, test and deploy the docs site; move Storybook to /storybook

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 19: Visual design pass and final verification

**Files:**
- Modify: CSS in `projects/docs/src/**` as findings require.
- Modify: `CLAUDE.md` (document the docs app)
- Modify: `docs/superpowers/specs/2026-10-09-docs-site-phase1-design.md` (record the deviations)

- [ ] **Step 1: Screenshot review**

Run `npm run docs`. Capture the following at 375px, 768px, and 1440px, in both light and dark themes:
- the home page
- the Button page
- the Tabs page

Use the browser preview tools.

Check against this list:
- One clear visual hierarchy per page.
- No more than two type sizes per section.
- Consistent `--mui-space-*` rhythm.
- The code blocks and demo stages read as distinct surfaces.
- The TOC doesn't collide with the content at 1280px.
- There is no horizontal page scroll at 375px.
- Every interactive element has a visible focus ring when you Tab through.

- [ ] **Step 2: Run the design review**

Invoke the `frontend-design` skill on `projects/docs/src/app` with the screenshots attached. Apply only the findings that keep to the token rules in Global Constraints. Re-run `npx nx test docs --no-watch` and `npm run e2e:docs` after the CSS changes.

- [ ] **Step 3: Document the docs app in `CLAUDE.md`**

Under "Directory map", add `projects/docs/` with a one-line description of each of `scripts/`, `src/content/`, `src/app/`, and `e2e/`.

Under "Common commands", add:
```bash
# Docs site (Angular app, port 4300) — content in projects/docs/src/content
./dev.sh docs
./dev.sh docs:build
./dev.sh test:docs
```

Under "Per-component checklist" item 10 (MDX), add:

> …and add a docs page: `projects/docs/src/content/components/<slug>/` (`<slug>.docs.ts` + `demos/*.demo.ts`), register it in `registry.ts`, and remove its classes from `undocumented.json`. The registry consistency spec fails until you do.

- [ ] **Step 4: Record the deviations in the spec**

Append to the spec:
```markdown
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
```

- [ ] **Step 5: Final verification**

Run: `./scripts/ci-verify.sh`
Expected: all green.

Run: `git status`
Expected: clean, apart from the files that were already untracked before this plan (`.bug-hunt/`, `scripts/file-hunt-issues.sh`, `scripts/audit-findings.json` changes). Do not stage those.

- [ ] **Step 6: Commit**

```bash
npx prettier --write projects/docs CLAUDE.md
git add projects/docs CLAUDE.md docs/superpowers/specs/2026-10-09-docs-site-phase1-design.md
git commit -m "docs(site): design polish, CLAUDE.md docs-app guide, spec implementation notes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Self-review (completed while writing)

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| Storybook kept, moved to `/storybook/` | 18 |
| Angular app in Nx, library compiled from source | 1 |
| Static prerender of registry routes | 1, 11 |
| `@angular/ssr` with the lockfile | 1 |
| Deploy, `baseHref`, 404 fallback | 18 |
| CI and `ci-verify` | 18 |
| `ComponentDoc` model | 5 |
| Inline text without `innerHTML` | 5 |
| Registry | 5 |
| Page template: all 8 sections and the TOC | 11 |
| Home, getting-started, index, group pages | 15 |
| `demo-viewer` | 8 |
| `extract-api`: all fields, services, parts, coverage line | 3 |
| Validation errors | 5 (consistency spec) |
| `collect-demos` | 4 |
| `tokenize` | 2 |
| Visual design with library components | 10, 11, 15, 19 |
| Dark mode with no flash | 1 (inline script), 6 |
| Site a11y: skip link, landmarks, h1 focus, live region, 44px, reduced motion, Sheet | 1, 10, 17 |
| Unit tests | 5–15 |
| Script tests | 2–4, 16 |
| E2E and axe | 17 |
| Build smoke check | 16 |
| Three pilot pages | 12–14 |

**Known risks, flagged inline:**

- Angular's `resource` option name (Task 11 Step 4).
- `DocsNav` `inject` placement (Task 10 Step 5; the corrected code is given).
- The `banner` role on a custom element (Task 10 Step 7).
- Library prerender safety (Task 1 Step 12).
