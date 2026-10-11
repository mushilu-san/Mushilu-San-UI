import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Card } from '@mushilu-san/ui/data-display';

@Component({
  selector: 'docs-card-clickable-demo',
  imports: [Card],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-card
    variant="outlined"
    [clickable]="true"
    (clicked)="openCount.set(openCount() + 1)"
  >
    <strong>Oak armchair</strong>
    <p>Opened {{ openCount() }} times.</p>
  </mui-card>`,
})
export class CardClickableDemo {
  protected readonly openCount = signal(0);
}
