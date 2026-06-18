import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  runInInjectionContext,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { useCva } from '@mushilu-san/ui';

let nextId = 0;

function norm(d: Date): Date {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

interface CalDay {
  date: Date;
  time: number;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'mui-calendar',
  standalone: true,
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Calendar),
      multi: true,
    },
  ],
  host: { '[attr.part]': '"root"' },
})
export class Calendar implements ControlValueAccessor {
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  locale = input('en-US');
  disabled = input(false, { transform: booleanAttribute });
  value = model<Date | null>(null);

  protected readonly uid = `cal-${++nextId}`;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly _today = norm(new Date());

  private readonly _cva = useCva<Date | null>(this.disabled);
  protected readonly isDisabled = this._cva.isDisabled;

  /* ── Linked signals for navigation state ───────────────── */

  protected readonly viewMonth = linkedSignal<number>(() => {
    const v = this.value();
    return v ? norm(v).getMonth() : this._today.getMonth();
  });

  protected readonly viewYear = linkedSignal<number>(() => {
    const v = this.value();
    return v ? norm(v).getFullYear() : this._today.getFullYear();
  });

  protected readonly focusedDate = linkedSignal<Date>(() => {
    const v = this.value();
    return v ? norm(v) : this._today;
  });

  /* ── Display computations ───────────────────────────────── */

  /** P-1: formatters memoized per locale — recomputed only when locale() changes. */
  private readonly _fmt = computed(() => ({
    monthYear: new Intl.DateTimeFormat(this.locale(), { month: 'long', year: 'numeric' }),
    weekdayShort: new Intl.DateTimeFormat(this.locale(), { weekday: 'short' }),
    weekdayLong: new Intl.DateTimeFormat(this.locale(), { weekday: 'long' }),
    dayLabel: new Intl.DateTimeFormat(this.locale(), {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  }));

  protected readonly selectedTime = computed(() => {
    const v = this.value();
    return v ? norm(v).getTime() : -1;
  });

  protected readonly focusedTime = computed(() => this.focusedDate().getTime());

  protected readonly monthLabel = computed(() =>
    this._fmt().monthYear.format(new Date(this.viewYear(), this.viewMonth(), 1)),
  );

  protected readonly prevMonthLabel = computed(() => {
    let m = this.viewMonth() - 1,
      y = this.viewYear();
    if (m < 0) {
      m = 11;
      y--;
    }
    return this._fmt().monthYear.format(new Date(y, m, 1));
  });

  protected readonly nextMonthLabel = computed(() => {
    let m = this.viewMonth() + 1,
      y = this.viewYear();
    if (m > 11) {
      m = 0;
      y++;
    }
    return this._fmt().monthYear.format(new Date(y, m, 1));
  });

  protected readonly weekDayNames = computed(() => {
    const { weekdayShort, weekdayLong } = this._fmt();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2024, 0, 7 + i); // Jan 7, 2024 is a Sunday
      return {
        short: weekdayShort.format(date).slice(0, 2),
        long: weekdayLong.format(date),
      };
    });
  });

  protected readonly weeks = computed((): CalDay[][] => {
    const month = this.viewMonth();
    const year = this.viewYear();
    const minRaw = this.minDate();
    const maxRaw = this.maxDate();
    const min = minRaw ? norm(minRaw) : null;
    const max = maxRaw ? norm(maxRaw) : null;
    const todayTime = this._today.getTime();

    const firstOfMonth = new Date(year, month, 1);
    const start = new Date(firstOfMonth);
    start.setDate(start.getDate() - start.getDay()); // rewind to Sunday

    const weeks: CalDay[][] = [];
    const cursor = new Date(start);

    for (let w = 0; w < 6; w++) {
      const week: CalDay[] = [];
      for (let d = 0; d < 7; d++) {
        const date = norm(cursor);
        const isDisabled =
          (min != null && date.getTime() < min.getTime()) ||
          (max != null && date.getTime() > max.getTime()) ||
          date.getMonth() !== month; // outside month — not interactive
        week.push({
          date,
          time: date.getTime(),
          day: date.getDate(),
          isCurrentMonth: date.getMonth() === month,
          isToday: date.getTime() === todayTime,
          isDisabled,
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  });

  /* ── Navigation ─────────────────────────────────────────── */

  protected prevMonth(): void {
    let m = this.viewMonth() - 1,
      y = this.viewYear();
    if (m < 0) {
      m = 11;
      y--;
    }
    this.viewMonth.set(m);
    this.viewYear.set(y);
  }

  protected nextMonth(): void {
    let m = this.viewMonth() + 1,
      y = this.viewYear();
    if (m > 11) {
      m = 0;
      y++;
    }
    this.viewMonth.set(m);
    this.viewYear.set(y);
  }

  /* ── Day interaction ────────────────────────────────────── */

  protected onDayClick(day: CalDay): void {
    if (day.isDisabled || this.isDisabled()) return;
    this.commit(day.date);
  }

  protected onDayKeydown(event: KeyboardEvent, day: CalDay): void {
    if (this.isDisabled()) return;
    let next = new Date(this.focusedDate());

    switch (event.key) {
      case 'ArrowRight':
        next.setDate(next.getDate() + 1);
        break;
      case 'ArrowLeft':
        next.setDate(next.getDate() - 1);
        break;
      case 'ArrowDown':
        next.setDate(next.getDate() + 7);
        break;
      case 'ArrowUp':
        next.setDate(next.getDate() - 7);
        break;
      case 'Home':
        next.setDate(next.getDate() - next.getDay());
        break;
      case 'End':
        next.setDate(next.getDate() + (6 - next.getDay()));
        break;
      case 'PageUp':
        next.setMonth(next.getMonth() - 1);
        break;
      case 'PageDown':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!day.isDisabled) this.onDayClick(day);
        return;
      default:
        return;
    }

    event.preventDefault();
    next = norm(next);
    if (next.getMonth() !== this.viewMonth() || next.getFullYear() !== this.viewYear()) {
      this.viewMonth.set(next.getMonth());
      this.viewYear.set(next.getFullYear());
    }
    this.focusedDate.set(next);

    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        (this.el.nativeElement as HTMLElement)
          .querySelector<HTMLElement>('button[tabindex="0"]')
          ?.focus();
      });
    });
  }

  protected formatDayLabel(date: Date): string {
    return this._fmt().dayLabel.format(date);
  }

  /* ── CVA ────────────────────────────────────────────────── */

  protected onBlur(): void {
    this._cva.onTouched();
  }

  private commit(date: Date): void {
    const n = norm(date);
    this.value.set(n);
    this._cva.onChange(n);
    this._cva.onTouched();
  }

  writeValue(v: Date | null): void {
    this.value.set(v ? norm(v) : null);
  }
  registerOnChange(fn: (v: Date | null) => void): void {
    this._cva.registerOnChange(fn);
  }
  registerOnTouched(fn: () => void): void {
    this._cva.registerOnTouched(fn);
  }
  setDisabledState(isDisabled: boolean): void {
    this._cva.setDisabledState(isDisabled);
  }
}
