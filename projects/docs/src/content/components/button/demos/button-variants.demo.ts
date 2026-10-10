import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-button-variants-demo',
  imports: [Button, Stack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-stack direction="row" align="center" [gap]="3" wrap>
      <button muiButton variant="primary">Save changes</button>
      <button muiButton variant="secondary">Cancel</button>
      <button muiButton variant="ghost">Learn more</button>
      <button muiButton variant="destructive">Delete</button>
    </mui-stack>
  `,
})
export class ButtonVariantsDemo {}
