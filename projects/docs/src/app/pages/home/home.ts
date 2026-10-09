import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'docs-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>Mushilu-San UI</h1>`,
})
export class Home {}
