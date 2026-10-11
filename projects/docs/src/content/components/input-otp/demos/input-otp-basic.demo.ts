import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputOtp } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-input-otp-basic-demo',
  imports: [InputOtp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-input-otp [length]="6" [value]="code()" (valueChange)="code.set($event)" />
    <p>Entered: {{ code() || '—' }}</p>`,
})
export class InputOtpBasicDemo {
  protected readonly code = signal('');
}
