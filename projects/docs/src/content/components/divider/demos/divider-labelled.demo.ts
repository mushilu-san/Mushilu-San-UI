import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Divider } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-divider-labelled-demo',
  imports: [Divider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Continue with your email address.</p>
    <mui-divider label="or" />
    <p>Continue with a passkey.</p>`,
})
export class DividerLabelledDemo {}
