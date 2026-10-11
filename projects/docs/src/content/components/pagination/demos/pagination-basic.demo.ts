import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Pagination } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-pagination-basic-demo',
  imports: [Pagination],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-pagination [totalPages]="10" [(page)]="page" />
    <p>Page {{ page() }} of 10</p>`,
})
export class PaginationBasicDemo {
  protected readonly page = signal(1);
}
