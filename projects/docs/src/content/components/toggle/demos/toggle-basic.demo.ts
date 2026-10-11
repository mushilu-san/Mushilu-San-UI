import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Toggle } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-toggle-basic-demo',
  imports: [Toggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-toggle label="Email alerts" [(checked)]="emailAlerts" />
    <p>Email alerts are {{ emailAlerts() ? 'on' : 'off' }}.</p>`,
})
export class ToggleBasicDemo {
  protected readonly emailAlerts = signal(true);
}
