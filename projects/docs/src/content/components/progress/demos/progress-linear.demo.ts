import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Progress } from '@mushilu-san/ui/feedback';

@Component({
  selector: 'docs-progress-linear-demo',
  imports: [Progress],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-progress label="Uploading photos" [value]="40" />
    <mui-progress variant="circular" label="Export" [value]="75" size="lg" />`,
})
export class ProgressLinearDemo {}
