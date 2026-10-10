import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Dialog } from '@mushilu-san/ui/feedback';
import { Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-dialog-basic-demo',
  imports: [Dialog, Button, Stack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button muiButton (clicked)="open.set(true)">Edit profile</button>

    <mui-dialog heading="Edit profile" [(open)]="open">
      <p>Changes are saved to your account and visible to your team.</p>
      <mui-stack slot="footer" direction="row" justify="end" [gap]="2">
        <button muiButton variant="secondary" (clicked)="open.set(false)">Cancel</button>
        <button muiButton (clicked)="open.set(false)">Save</button>
      </mui-stack>
    </mui-dialog>
  `,
})
export class DialogBasicDemo {
  protected readonly open = signal(false);
}
