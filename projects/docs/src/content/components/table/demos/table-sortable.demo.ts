import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Table } from '@mushilu-san/ui/data-display';

@Component({
  selector: 'docs-table-sortable-demo',
  imports: [Table],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-table
      caption="Recent orders"
      [columns]="columns"
      [rows]="rows"
      (sortChange)="lastSort.set($event.key + ' ' + ($event.direction ?? 'none'))"
    />
    <p>Last sort: {{ lastSort() }}</p>`,
})
export class TableSortableDemo {
  protected readonly lastSort = signal('none');
  protected readonly columns = [
    { key: 'order', label: 'Order', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'total', label: 'Total', sortable: true },
  ];
  protected readonly rows = [
    { order: '#1041', customer: 'Dana Levi', total: 240 },
    { order: '#1042', customer: 'Noa Cohen', total: 85 },
    { order: '#1043', customer: 'Amir Katz', total: 190 },
  ];
}
