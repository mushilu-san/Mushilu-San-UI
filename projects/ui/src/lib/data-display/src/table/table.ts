import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
  output,
  signal,
} from '@angular/core';
import type { SortDirection, SortState, TableColumn } from './table.types';

let tableUid = 0;

@Component({
  selector: 'mui-table',
  standalone: true,
  templateUrl: './table.html',
  styleUrl: './table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
    '[attr.role]': '"region"',
    '[attr.tabindex]': '"0"',
    // Prefer aria-labelledby (visible caption) when present; fall back to label.
    '[attr.aria-labelledby]': 'caption() ? captionId : null',
    '[attr.aria-label]': 'caption() ? null : "Data table"',
  },
})
export class Table {
  /** Column definitions. */
  columns = input.required<TableColumn[]>();
  /** Row data — each row is a plain record keyed by column key. */
  rows = input.required<readonly Record<string, unknown>[]>();
  /** Visible caption; also provides the region's accessible name. */
  caption = input<string>();
  /** Pin the header row when the table scrolls. */
  stickyHeader = input(false, { transform: booleanAttribute });

  /** Emitted whenever the user clicks a sortable column header. */
  readonly sortChange = output<SortState>();

  protected readonly captionId = `mui-table-caption-${tableUid++}`;
  protected readonly sortState = signal<SortState>({ key: '', direction: null });

  protected sort(col: TableColumn): void {
    if (!col.sortable) return;
    const curr = this.sortState();
    let direction: SortDirection;
    if (curr.key === col.key) {
      direction = curr.direction === 'asc' ? 'desc' : curr.direction === 'desc' ? null : 'asc';
    } else {
      direction = 'asc';
    }
    const next: SortState = { key: col.key, direction };
    this.sortState.set(next);
    this.sortChange.emit(next);
  }

  protected ariaSortAttr(key: string): string | null {
    const s = this.sortState();
    if (s.key !== key || s.direction === null) return null;
    return s.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected cellValue(row: Readonly<Record<string, unknown>>, key: string): string {
    return String(row[key] ?? '');
  }
}
