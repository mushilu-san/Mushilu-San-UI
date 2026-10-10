import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlock, plainLines } from '../../shared/code-block/code-block';

const INSTALL = 'npm install @mushilu-san/ui';
const REGISTRY = '@mushilu-san:registry=https://npm.pkg.github.com';
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
    <p>
      Add the package, register the provider, and include the design tokens. Every component is
      standalone. Import only what you use from its group entry point.
    </p>
    <ol>
      <li>
        <h2>Install</h2>
        <p>
          The package is published to GitHub Packages. Point the <code>&#64;mushilu-san</code> scope
          at that registry in your <code>.npmrc</code> first.
        </p>
        <docs-code-block label=".npmrc" [lines]="registryLines" [source]="registry" />
        <docs-code-block label="Terminal" [lines]="installLines" [source]="install" />
      </li>
      <li>
        <h2>Provide the library</h2>
        <p>The library is zoneless and needs Angular 22.</p>
        <docs-code-block label="app.config.ts" [lines]="configLines" [source]="config" />
      </li>
      <li>
        <h2>Include the styles</h2>
        <p>
          <code>tokens.css</code> defines every <code>--mui-*</code> token, including dark mode.
          <code>reset.css</code> is optional.
        </p>
        <docs-code-block
          label="angular.json (build options)"
          [lines]="stylesLines"
          [source]="styles"
        />
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
  protected readonly registry = REGISTRY;
  protected readonly registryLines = plainLines(REGISTRY);
  protected readonly config = CONFIG;
  protected readonly configLines = plainLines(CONFIG);
  protected readonly styles = STYLES;
  protected readonly stylesLines = plainLines(STYLES);
  protected readonly usage = USAGE;
  protected readonly usageLines = plainLines(USAGE);
}
