import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Grid } from '@mushilu-san/ui/layout';

@Component({
  selector: 'docs-grid-columns-demo',
  imports: [Grid],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-grid [columns]="3" [gap]="3">
      @for (n of items; track n) {
        <div class="tile">Tile {{ n }}</div>
      }
    </mui-grid>
    <style>
      .tile {
        padding: var(--mui-space-4);
        border: 1px solid var(--mui-color-border);
        border-radius: var(--mui-radius-md);
        background: var(--mui-color-surface-raised);
      }
    </style>`,
})
export class GridColumnsDemo {
  protected readonly items = [1, 2, 3, 4, 5, 6];
}
