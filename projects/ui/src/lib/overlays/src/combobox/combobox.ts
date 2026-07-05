import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  InjectionToken,
  Injector,
  Signal,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  model,
  output,
  runInInjectionContext,
  signal,
  viewChild,
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
        open: self.open,
        search: self.search,
        selectedLabel: self.selectedLabel,
        setSearch: (v: string) => self.search.set(v),
        selectItem: (v: string, label: string) => self.onSelect(v, label),
        close: () => self.open.set(false),
      }),
      deps: [Combobox],
    },
  ],
  host: {
    '[attr.part]': '"root"',
    style: 'position:relative;display:inline-block;',
  },
})
export class Combobox {
  value = model('');
  placeholder = input('Select…');
  disabled = input(false, { transform: booleanAttribute });

  readonly opened = output<void>();
  readonly closed = output<void>();

  protected readonly open = signal(false);
  protected readonly search = signal('');
  protected readonly selectedLabel = signal('');

  private readonly injector = inject(Injector);
  private readonly el = inject(ElementRef);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('triggerButton');

  constructor() {
    // H-E-93d6a6: the panel's own `(keydown)="$event.stopPropagation()"` (see
    // combobox.html) halts bubbling before it ever reaches a bubble-phase
    // `document:keydown.escape` HostListener, so Escape pressed inside the panel/search
    // input would never be observed here. A capture-phase listener runs on the way
    // *down* to the target, before that stopPropagation() call (which only takes effect
    // during the later bubble phase) and before the search input's own local
    // (keydown.escape) binding — so it reliably sees the key while `open()` is still true.
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') this.onEscape(event);
    };
    this.doc.addEventListener('keydown', handleKeydown, { capture: true });
    this.destroyRef.onDestroy(() => {
      this.doc.removeEventListener('keydown', handleKeydown, { capture: true });
    });
  }

  protected toggle(): void {
    if (this.disabled()) return;
    this.open.update((v) => !v);
    if (this.open()) {
      this.search.set('');
      this.opened.emit();
      // H-E-beee38: focus the search input once the panel has rendered.
      runInInjectionContext(this.injector, () => {
        afterNextRender(() => {
          this.searchInputRef()?.nativeElement.focus();
        });
      });
    }
  }

  protected onSelect(val: string, label: string): void {
    this.value.set(val);
    this.selectedLabel.set(label);
    this.open.set(false);
    this.search.set('');
    this.closed.emit();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (this.open() && !target.closest('mui-combobox')) {
      this.open.set(false);
      this.closed.emit();
    }
  }

  protected onEscape(event: Event): void {
    // Only react to an Escape that originated inside this combobox instance — this
    // listener is registered once per instance on the shared document (see constructor).
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!(this.el.nativeElement as HTMLElement).contains(target)) return;

    if (this.open()) {
      this.open.set(false);
      this.closed.emit();
    }
    // H-E-93d6a6: display:none on close force-blurs the search input, so the
    // trigger button must be re-focused explicitly, matching DropdownMenu's Escape handling.
    const trigger = this.triggerRef();
    if (!trigger) return;
    trigger.nativeElement.focus();
  }
}
