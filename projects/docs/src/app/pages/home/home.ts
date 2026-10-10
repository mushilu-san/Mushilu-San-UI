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
      line-height: var(--mui-line-height-tight);
      letter-spacing: var(--mui-letter-spacing-tight);
    }
    .lede {
      margin: 0 0 var(--mui-space-6);
      color: var(--mui-color-text-muted);
      font-size: var(--mui-font-size-lg);
    }
    h2 {
      margin-bottom: var(--mui-space-4);
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
      min-height: var(--mui-touch-target);
      padding: var(--mui-space-5);
      border: 1px solid var(--mui-color-border);
      border-radius: var(--mui-radius-lg);
      color: var(--mui-color-text);
      text-decoration: none;
    }
    .groups a:hover {
      border-color: var(--mui-color-primary);
    }
    .groups a:focus-visible {
      outline: var(--mui-focus-ring-width) solid var(--mui-color-focus-ring);
      outline-offset: var(--mui-focus-ring-offset);
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
      <p class="lede">
        Mobile-first, token-themed, accessible Angular components, with no runtime dependencies
        beyond Angular itself.
      </p>
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
