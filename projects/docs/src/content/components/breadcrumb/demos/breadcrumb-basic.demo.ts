import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Breadcrumb } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-breadcrumb-basic-demo',
  imports: [Breadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-breadcrumb [items]="items" />`,
})
export class BreadcrumbBasicDemo {
  protected readonly items = [
    { label: 'Home', href: '#home' },
    { label: 'Furniture', href: '#furniture' },
    { label: 'Chairs', href: '#chairs' },
    { label: 'Oak armchair' },
  ];
}
