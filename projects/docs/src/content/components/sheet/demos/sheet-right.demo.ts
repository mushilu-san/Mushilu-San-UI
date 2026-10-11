import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Sheet } from '@mushilu-san/ui/feedback';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-sheet-right-demo',
  imports: [Sheet, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button muiButton variant="secondary" (clicked)="open.set(true)">Open filters</button>
    <mui-sheet side="right" heading="Filters" [(open)]="open">
      <p>Filter results by category, price or availability.</p>
      <div slot="footer">
        <button muiButton (clicked)="open.set(false)">Apply filters</button>
      </div>
    </mui-sheet>`,
})
export class SheetRightDemo {
  protected readonly open = signal(false);
}
