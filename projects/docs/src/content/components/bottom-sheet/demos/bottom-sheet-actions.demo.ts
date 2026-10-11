import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BottomSheet } from '@mushilu-san/ui/mobile';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-bottom-sheet-actions-demo',
  imports: [BottomSheet, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button muiButton variant="secondary" (clicked)="open.set(true)">
      Actions for this file
    </button>
    <p>Last action: {{ last() }}</p>
    <mui-bottom-sheet heading="Actions for report.pdf" [(open)]="open">
      <div style="display: grid; gap: var(--mui-space-2);">
        <button muiButton variant="secondary" (clicked)="choose('Shared')">Share</button>
        <button muiButton variant="secondary" (clicked)="choose('Downloaded')">Download</button>
        <button muiButton variant="destructive" (clicked)="choose('Deleted')">Delete</button>
      </div>
    </mui-bottom-sheet>`,
})
export class BottomSheetActionsDemo {
  protected readonly open = signal(false);
  protected readonly last = signal('none');

  protected choose(action: string): void {
    this.last.set(action);
    this.open.set(false);
  }
}
