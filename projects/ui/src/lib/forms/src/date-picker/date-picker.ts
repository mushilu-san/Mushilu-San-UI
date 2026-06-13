import {
  ChangeDetectionStrategy,
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
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
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
  placeholder = input('Pick a date');
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  locale = input('en-US');
  disabled = input(false, { transform: booleanAttribute });
  value = model<Date | null>(null);

  protected readonly uid = `dp-${++nextId}`;
  protected readonly panelId = `dp-panel-${this.uid}`;
  protected readonly isOpen = signal(false);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

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
    this.isOpen.update((o) => !o);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected onCalendarSelect(date: Date | null): void {
    const n = date ? norm(date) : null;
    this.value.set(n);
    this._onChange(n);
    this._onTouched();
    this.isOpen.set(false);
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
    (this.el.nativeElement as HTMLElement).querySelector<HTMLElement>('.dp-trigger')?.focus();
  }

  private _onChange: (v: Date | null) => void = () => undefined;
  private _onTouched: () => void = () => undefined;

  writeValue(v: Date | null): void {
    this.value.set(v ? norm(v) : null);
  }
  registerOnChange(fn: (v: Date | null) => void): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
