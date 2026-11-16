import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Step, Stepper } from '@mushilu-san/ui/data-display';

@Component({
  selector: 'docs-stepper-basic-demo',
  imports: [Step, Stepper],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-stepper aria-label="Series parts"
    ><mui-step label="Setup"><span slot="meta">5 min</span>Install the tools.</mui-step
    ><mui-step label="Build" href="/build">Write the first component.</mui-step
    ><mui-step label="Ship">Publish it.</mui-step></mui-stepper
  >`,
})
export class StepperBasicDemo {}
