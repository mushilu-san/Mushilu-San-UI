import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Stat, Stats } from '@mushilu-san/ui/data-display';

@Component({
  selector: 'docs-stat-basic-demo',
  imports: [Stat, Stats],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-stats aria-label="Site totals"
    ><mui-stat value="1,200" label="Readers" /><mui-stat value="48" label="Articles" /><mui-stat
      value="98%"
      label="Satisfaction"
  /></mui-stats>`,
})
export class StatBasicDemo {}
