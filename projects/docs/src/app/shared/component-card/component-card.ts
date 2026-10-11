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
    a:focus-visible {
      outline: var(--mui-focus-ring-width) solid var(--mui-color-focus-ring);
      outline-offset: var(--mui-focus-ring-offset);
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
    @media (prefers-reduced-motion: reduce) {
      a {
        transition: none;
      }
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
