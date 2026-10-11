import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Popover, PopoverTrigger } from '@mushilu-san/ui/overlays';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-popover-filter-demo',
  imports: [Popover, PopoverTrigger, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-popover heading="Filter by status" placement="bottom" [(open)]="open">
    <button muiButton variant="secondary" muiPopoverTrigger>Filter</button>
    <p>Choose the statuses to show.</p>
    <button muiButton (clicked)="open.set(false)">Apply</button>
  </mui-popover>`,
})
export class PopoverFilterDemo {
  protected readonly open = signal(false);
}
