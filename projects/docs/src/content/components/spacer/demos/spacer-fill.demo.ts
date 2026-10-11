import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Spacer, Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-spacer-fill-demo',
  imports: [Spacer, Stack, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-stack direction="row" align="center">
    <strong>Invoices</strong>
    <mui-spacer />
    <button muiButton variant="secondary">Export</button>
  </mui-stack>`,
})
export class SpacerFillDemo {}
