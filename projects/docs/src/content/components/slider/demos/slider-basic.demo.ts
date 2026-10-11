import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Slider } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-slider-basic-demo',
  imports: [Slider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Volume: {{ volume() }}</p>
    <mui-slider [min]="0" [max]="100" [step]="5" [(value)]="volume" aria-label="Volume" />`,
})
export class SliderBasicDemo {
  protected readonly volume = signal(40);
}
