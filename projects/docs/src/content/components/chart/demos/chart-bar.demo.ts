import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chart } from '@mushilu-san/ui/data-display';

@Component({
  selector: 'docs-chart-bar-demo',
  imports: [Chart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div style="height: 240px;">
      <mui-chart type="bar" label="Orders per month, first half of the year" [data]="data" />
    </div>
    <p>Orders: Jan 42, Feb 55, Mar 38, Apr 61, May 49, Jun 70.</p>`,
})
export class ChartBarDemo {
  protected readonly data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Orders', data: [42, 55, 38, 61, 49, 70] }],
  };
}
