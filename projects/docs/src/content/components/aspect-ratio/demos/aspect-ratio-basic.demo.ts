import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AspectRatio } from '@mushilu-san/ui/layout';

@Component({
  selector: 'docs-aspect-ratio-basic-demo',
  imports: [AspectRatio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-aspect-ratio [ratio]="16 / 9">
    <div
      style="display: grid; place-items: center; height: 100%; background: var(--mui-color-surface-raised);"
    >
      16 : 9
    </div>
  </mui-aspect-ratio>`,
})
export class AspectRatioBasicDemo {}
