import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Spinner } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-spinner-sizes-demo',
  imports: [Spinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-spinner size="sm" />
    <mui-spinner size="md" />
    <mui-spinner size="lg" color="primary" />
    <mui-spinner size="xl" color="muted" />`,
})
export class SpinnerSizesDemo {}
