import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Pager, PagerLink } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-pager-basic-demo',
  imports: [Pager, PagerLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-pager label="Series navigation"
    ><a muiPagerLink direction="previous" href="#p1" directionLabel="Previous">Part 1</a
    ><a muiPagerLink direction="next" href="#p3" directionLabel="Next">Part 3</a></mui-pager
  >`,
})
export class PagerBasicDemo {}
