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
      display: contents;
    }
    header {
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
    a:focus-visible {
      outline: var(--mui-focus-ring-width) solid var(--mui-color-focus-ring);
      outline-offset: var(--mui-focus-ring-offset);
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
    <header>
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
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <a class="brand" routerLink="/">
        <img src="favicon.svg" alt="" width="24" height="24" />
        Mushilu-San UI
      </a>
      <span class="spacer"></span>
      <a class="ext" href="storybook/">Storybook</a>
      <a class="ext" href="https://github.com/mushilu-san/Mushilu-San-UI" rel="noopener">GitHub</a>
      <docs-theme-toggle />
    </header>
  `,
})
export class DocsHeader {
  readonly menuOpen = input(false, { transform: booleanAttribute });
  readonly menu = output<void>();
}
