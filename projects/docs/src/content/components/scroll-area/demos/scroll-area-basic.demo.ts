import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollArea } from '@mushilu-san/ui/layout';

@Component({
  selector: 'docs-scroll-area-basic-demo',
  imports: [ScrollArea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-scroll-area
    style="height: 160px; border: 1px solid var(--mui-color-border); border-radius: var(--mui-radius-md); padding: var(--mui-space-3);"
  >
    @for (n of rows; track n) {
      <p>Activity item {{ n }}</p>
    }
  </mui-scroll-area>`,
})
export class ScrollAreaBasicDemo {
  protected readonly rows = Array.from({ length: 20 }, (_, i) => i + 1);
}
