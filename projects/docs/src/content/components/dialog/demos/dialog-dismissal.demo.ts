import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Dialog } from '@mushilu-san/ui/feedback';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-dialog-dismissal-demo',
  imports: [Dialog, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button muiButton variant="secondary" (clicked)="open.set(true)">Open locked dialog</button>

    <mui-dialog
      heading="Finish setup"
      [closeOnBackdrop]="false"
      [closeOnEscape]="false"
      [(open)]="open"
    >
      <p>Backdrop clicks and Escape are disabled. Use the close button or the action below.</p>
      <button muiButton slot="footer" (clicked)="open.set(false)">Done</button>
    </mui-dialog>
  `,
})
export class DialogDismissalDemo {
  protected readonly open = signal(false);
}
