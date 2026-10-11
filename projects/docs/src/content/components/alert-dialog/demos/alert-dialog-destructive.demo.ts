import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AlertDialog } from '@mushilu-san/ui/feedback';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-alert-dialog-destructive-demo',
  imports: [AlertDialog, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button muiButton variant="destructive" (clicked)="open.set(true)">
      Delete project
    </button>
    <p>{{ status() }}</p>
    <mui-alert-dialog
      heading="Delete this project?"
      confirmLabel="Delete project"
      cancelLabel="Keep project"
      [destructive]="true"
      [(open)]="open"
      (confirmed)="status.set('Project deleted.')"
      (cancelled)="status.set('Nothing was deleted.')"
    >
      This removes the project and all its files. This cannot be undone.
    </mui-alert-dialog>`,
})
export class AlertDialogDestructiveDemo {
  protected readonly open = signal(false);
  protected readonly status = signal('');
}
