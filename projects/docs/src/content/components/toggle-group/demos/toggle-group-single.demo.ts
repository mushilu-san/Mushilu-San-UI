import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ToggleGroup, ToggleGroupItem } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-toggle-group-single-demo',
  imports: [ToggleGroup, ToggleGroupItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-toggle-group type="single" aria-label="Text alignment" [(value)]="align">
      <mui-toggle-group-item value="left" aria-label="Align left">Left</mui-toggle-group-item>
      <mui-toggle-group-item value="center" aria-label="Align centre">Centre</mui-toggle-group-item>
      <mui-toggle-group-item value="right" aria-label="Align right">Right</mui-toggle-group-item>
    </mui-toggle-group>
    <p>Selected: {{ align() || 'none' }}</p>`,
})
export class ToggleGroupSingleDemo {
  protected readonly align = signal('left');
}
