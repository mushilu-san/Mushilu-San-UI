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
      <p>
        Import from <code>{{ g.entry }}</code>
      </p>
      @if (entries().length > 0) {
        <ul class="grid">
          @for (e of entries(); track e.slug) {
            <li><docs-component-card [entry]="e" /></li>
          }
        </ul>
      } @else {
        <p>
          Documentation for this group is coming soon. Meanwhile, see the
          <a href="storybook/">Storybook</a>.
        </p>
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
  protected readonly entries = computed(() =>
    this.registry.filter((e) => e.group === this.group()),
  );
}
