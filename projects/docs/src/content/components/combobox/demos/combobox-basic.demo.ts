import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Combobox, ComboboxItem } from '@mushilu-san/ui/overlays';

@Component({
  selector: 'docs-combobox-basic-demo',
  imports: [Combobox, ComboboxItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-combobox [(value)]="country" placeholder="Choose a country" aria-label="Country">
      <mui-combobox-item value="il">Israel</mui-combobox-item>
      <mui-combobox-item value="us">United States</mui-combobox-item>
      <mui-combobox-item value="fr">France</mui-combobox-item>
      <mui-combobox-item value="jp" [disabled]="true">Japan (unavailable)</mui-combobox-item>
    </mui-combobox>
    <p>Selected: {{ country() || 'none' }}</p>`,
})
export class ComboboxBasicDemo {
  protected readonly country = signal('');
}
