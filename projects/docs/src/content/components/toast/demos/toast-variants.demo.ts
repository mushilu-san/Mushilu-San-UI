import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastContainer, ToastService } from '@mushilu-san/ui/feedback';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-toast-variants-demo',
  imports: [ToastContainer, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div style="display: flex; flex-wrap: wrap; gap: var(--mui-space-2);">
      <button muiButton variant="secondary" (clicked)="toasts.info('Link copied')">Info</button>
      <button muiButton variant="secondary" (clicked)="toasts.success('Changes saved')">
        Success
      </button>
      <button muiButton variant="secondary" (clicked)="toasts.warning('Storage is almost full')">
        Warning
      </button>
      <button
        muiButton
        variant="secondary"
        (clicked)="toasts.danger('Upload failed', { duration: 0 })"
      >
        Danger, stays
      </button>
    </div>
    <mui-toast-container placement="bottom-end" />`,
})
export class ToastVariantsDemo {
  protected readonly toasts = inject(ToastService);
}
