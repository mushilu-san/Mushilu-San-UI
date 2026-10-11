import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Fab } from '@mushilu-san/ui/mobile';

@Component({
  selector: 'docs-fab-variants-demo',
  imports: [Fab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-fab label="Compose" [extended]="true" (clicked)="count.set(count() + 1)" />
    <mui-fab label="Add item" variant="secondary" />
    <mui-fab label="Saving" [loading]="true" />
    <p>Compose pressed {{ count() }} times.</p>`,
})
export class FabVariantsDemo {
  protected readonly count = signal(0);
}
