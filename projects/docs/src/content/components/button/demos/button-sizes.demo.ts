import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-button-sizes-demo',
  imports: [Button, Stack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-stack direction="row" align="center" [gap]="3" wrap>
      <button muiButton size="sm">Small</button>
      <button muiButton size="md">Medium</button>
      <button muiButton size="lg">Large</button>
    </mui-stack>
  `,
})
export class ButtonSizesDemo {}
