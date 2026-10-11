import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from '@mushilu-san/ui/data-display';

@Component({
  selector: 'docs-card-variants-demo',
  imports: [Card],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    style="display: grid; gap: var(--mui-space-3); grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));"
  >
    <mui-card variant="flat"
      ><strong>Flat</strong>
      <p>Border only.</p></mui-card
    >
    <mui-card variant="outlined"
      ><strong>Outlined</strong>
      <p>Stronger border.</p></mui-card
    >
    <mui-card variant="elevated"
      ><strong>Elevated</strong>
      <p>Raised shadow.</p></mui-card
    >
  </div>`,
})
export class CardVariantsDemo {}
