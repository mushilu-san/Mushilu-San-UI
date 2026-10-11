import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-stack-direction-demo',
  imports: [Stack, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-stack direction="column" [gap]="3">
    <p>Stacked in a column</p>
    <mui-stack direction="row" [gap]="2" align="center">
      <button muiButton>Save</button>
      <button muiButton variant="secondary">Cancel</button>
    </mui-stack>
  </mui-stack>`,
})
export class StackDirectionDemo {}
