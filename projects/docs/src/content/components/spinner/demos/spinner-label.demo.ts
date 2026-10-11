import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Spinner } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-spinner-label-demo',
  imports: [Spinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-spinner label="Saving draft" color="primary" />`,
})
export class SpinnerLabelDemo {}
