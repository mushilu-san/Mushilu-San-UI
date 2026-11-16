import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CopyButton } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-copy-button-basic-demo',
  imports: [CopyButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-copy-button text="npm i @mushilu-san/ui" />`,
})
export class CopyButtonBasicDemo {}
