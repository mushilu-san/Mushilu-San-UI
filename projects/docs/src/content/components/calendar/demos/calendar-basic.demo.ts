import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Calendar } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-calendar-basic-demo',
  imports: [Calendar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-calendar [(value)]="date" [minDate]="minDate" />
    <p>Selected: {{ date()?.toDateString() ?? 'none' }}</p>`,
})
export class CalendarBasicDemo {
  protected readonly date = signal<Date | null>(null);
  protected readonly minDate = new Date();
}
