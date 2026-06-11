import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  InjectionToken,
  Signal,
  ViewEncapsulation,
  booleanAttribute,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export interface ComboboxContext {
  readonly open: Signal<boolean>;
  readonly search: Signal<string>;
  readonly selectedLabel: Signal<string>;
  setSearch(value: string): void;
  selectItem(value: string, label: string): void;
  close(): void;
}

export const COMBOBOX_CONTEXT = new InjectionToken<ComboboxContext>('COMBOBOX_CONTEXT');

/**
 * Combobox — a trigger input that opens a searchable Command dropdown.
 *
 * Usage:
 *   <mui-combobox [(value)]="selected" placeholder="Select framework…">
 *     <mui-combobox-item value="angular">Angular</mui-combobox-item>
 *     <mui-combobox-item value="react">React</mui-combobox-item>
 *     <mui-combobox-item value="vue">Vue</mui-combobox-item>
 *   </mui-combobox>
 */
@Component({
  selector: 'mui-combobox',
  standalone: true,
  templateUrl: './combobox.html',
  styleUrl: './combobox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: COMBOBOX_CONTEXT,
      useFactory: (self: Combobox) => ({
        open:          self.open,
        search:        self.search,
        selectedLabel: self.selectedLabel,
        setSearch:     (v: string) => self.search.set(v),
        selectItem:    (v: string, label: string) => self.onSelect(v, label),
        close:         () => self.open.set(false),
      }),
      deps: [Combobox],
    },
  ],
  host: {
    '[attr.part]': '"root"',
    'style': 'position:relative;display:inline-block;',
  },
})
export class Combobox {
  value       = model('');
  placeholder = input('Select…');
  disabled    = input(false, { transform: booleanAttribute });

  readonly valueChange = output<string>();
  readonly opened      = output<void>();
  readonly closed      = output<void>();

  protected readonly open          = signal(false);
  protected readonly search        = signal('');
  protected readonly selectedLabel = signal('');

  protected toggle(): void {
    if (this.disabled()) return;
    this.open.update(v => !v);
    if (this.open()) {
      this.search.set('');
      this.opened.emit();
    }
  }

  protected onSelect(val: string, label: string): void {
    this.value.set(val);
    this.selectedLabel.set(label);
    this.open.set(false);
    this.search.set('');
    this.valueChange.emit(val);
    this.closed.emit();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    // Close when clicking outside this host element
    if (this.open() && !(event.target as Element)?.closest('mui-combobox')) {
      this.open.set(false);
      this.closed.emit();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.open.set(false);
      this.closed.emit();
    }
  }
}
