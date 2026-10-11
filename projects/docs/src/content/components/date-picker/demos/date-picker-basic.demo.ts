import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DatePicker, FormField } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-date-picker-basic-demo',
  imports: [DatePicker, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-form-field label="Start date" controlId="start-date">
    <mui-date-picker
      id="start-date"
      [(value)]="start"
      [minDate]="today"
      placeholder="Pick a date"
    />
  </mui-form-field>`,
})
export class DatePickerBasicDemo {
  protected readonly start = signal<Date | null>(null);
  protected readonly today = new Date();
}
