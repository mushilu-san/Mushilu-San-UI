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
    h2 a:focus-visible {
      outline: var(--mui-focus-ring-width) solid var(--mui-color-focus-ring);
      outline-offset: var(--mui-focus-ring-offset);
    }
  `,
  template: `
    <h1>Components</h1>
    <p>Every documented component, by entry point.</p>
    @for (g of groups; track g.id) {
      <section [attr.aria-labelledby]="'g-' + g.id">
        <h2 [id]="'g-' + g.id">
          <a [routerLink]="['/components/group', g.id]">{{ g.label }}</a>
        </h2>
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
