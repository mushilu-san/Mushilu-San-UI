import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Chip } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-chip-toggle-demo',
  imports: [Chip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button muiChip [selected]="drafts()" (click)="drafts.set(!drafts())">
    Only drafts
  </button>`,
})
export class ChipToggleDemo {
  protected readonly drafts = signal(false);
}
