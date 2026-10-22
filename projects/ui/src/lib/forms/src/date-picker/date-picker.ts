import {
  ChangeDetectionStrategy,
  Injector,
  afterNextRender,
  Component,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  model,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { useCva } from '@mushilu-san/ui';
import { Calendar } from '../calendar/calendar';

let nextId = 0;

function norm(d: Date): Date {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

@Component({
  selector: 'mui-date-picker',
  standalone: true,
  imports: [Calendar],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePicker),
      multi: true,
    },
  ],
  host: {
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.part]': '"root"',
  },
})
export class DatePicker implements ControlValueAccessor {
  /** Text shown in the trigger when no date is chosen. Default `Pick a date`. */
  placeholder = input('Pick a date');
  /** Earliest selectable date. Days before it are disabled. */
  minDate = input<Date | null>(null);
  /** Latest selectable date. Days after it are disabled. */
  maxDate = input<Date | null>(null);
  /** BCP 47 locale used to format the date and calendar names. Default `en-US`. */
  locale = input('en-US');
  /** Disables the trigger and the calendar. */
  disabled = input(false, { transform: booleanAttribute });
  /** Selected date, or `null` when none is chosen. Two-way bindable with `[(value)]`. */
  value = model<Date | null>(null);

  protected readonly uid = `dp-${++nextId}`;
  protected readonly panelId = `dp-panel-${this.uid}`;
  protected readonly isOpen = signal(false);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly _cva = useCva<Date | null>(this.disabled);
  protected readonly isDisabled = this._cva.isDisabled;

  protected readonly displayValue = computed(() => {
    const v = this.value();
    if (!v) return this.placeholder();
    return v.toLocaleDateString(this.locale(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  protected toggle(): void {
    if (this.isDisabled()) return;
    const open = !this.isOpen();
    this.isOpen.set(open);
    if (open) this.focusAfterRender('.dp-panel button.cal-day[tabindex="0"]');
  }

  /** Moves focus once Angular has rendered the target (panel content, or the trigger). */
  private focusAfterRender(selector: string): void {
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        (this.el.nativeElement as HTMLElement).querySelector<HTMLElement>(selector)?.focus();
      });
    });
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected onCalendarSelect(date: Date | null): void {
    const n = date ? norm(date) : null;
    this.value.set(n);
    this._cva.onChange(n);
    this._cva.onTouched();
    this.isOpen.set(false);
    this.focusAfterRender('.dp-trigger');
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    if (!(this.el.nativeElement as HTMLElement).contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('keydown.escape')
  protected onEscape(): void {
    if (!this.isOpen()) return;
    this.close();
    this.focusAfterRender('.dp-trigger');
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
