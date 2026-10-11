import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Progress } from '@mushilu-san/ui/feedback';

@Component({
  selector: 'docs-progress-indeterminate-demo',
  imports: [Progress],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-progress label="Checking the server" [indeterminate]="true" />`,
})
export class ProgressIndeterminateDemo {}
