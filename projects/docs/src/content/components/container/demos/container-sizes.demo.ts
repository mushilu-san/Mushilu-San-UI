import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Container } from '@mushilu-san/ui/layout';

@Component({
  selector: 'docs-container-sizes-demo',
  imports: [Container],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-container size="sm"
      ><p>Small container: a narrow reading column.</p></mui-container
    >
    <mui-container size="lg"
      ><p>Large container (default): the usual page width.</p></mui-container
    >`,
})
export class ContainerSizesDemo {}
