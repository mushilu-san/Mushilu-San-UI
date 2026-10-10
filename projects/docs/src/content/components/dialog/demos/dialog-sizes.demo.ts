import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Dialog, type DialogSize } from '@mushilu-san/ui/feedback';
import { Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-dialog-sizes-demo',
  imports: [Dialog, Button, Stack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-stack direction="row" [gap]="2" wrap>
      @for (s of sizes; track s) {
        <button muiButton variant="secondary" (clicked)="show(s)">{{ s }}</button>
      }
    </mui-stack>

    <mui-dialog [heading]="'Size: ' + size()" [size]="size()" [(open)]="open">
      <p>The panel width follows the <code>size</code> input and never exceeds the viewport.</p>
    </mui-dialog>
  `,
})
export class DialogSizesDemo {
  protected readonly sizes: DialogSize[] = ['sm', 'md', 'lg'];
  protected readonly size = signal<DialogSize>('md');
  protected readonly open = signal(false);

  protected show(s: DialogSize): void {
    this.size.set(s);
    this.open.set(true);
  }
}
