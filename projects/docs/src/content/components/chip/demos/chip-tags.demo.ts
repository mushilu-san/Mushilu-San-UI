import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chip } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-chip-tags-demo',
  imports: [Chip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<nav aria-label="Tags">
    <a muiChip href="#angular" leading="#" [selected]="true">angular</a>
    <a muiChip href="#signals" leading="#">signals</a>
    <a muiChip href="#rtl" leading="#">rtl</a>
  </nav>`,
})
export class ChipTagsDemo {}
