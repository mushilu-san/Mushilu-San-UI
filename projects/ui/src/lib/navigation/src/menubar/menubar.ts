import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Signal,
  ViewEncapsulation,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { MENUBAR_CONTEXT, MenubarContext } from './menubar-context';

@Component({
  selector: 'mui-menubar',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './menubar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [{ provide: MENUBAR_CONTEXT, useExisting: forwardRef(() => Menubar) }],
  host: {
    role: 'menubar',
    '[attr.aria-label]': 'label()',
    '[attr.part]': '"root"',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Menubar implements MenubarContext {
  label = input('Menu bar');

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly _openId = signal<string | null>(null);
  readonly openId: Signal<string | null> = this._openId.asReadonly();

  setOpen(id: string | null): void {
    this._openId.set(id);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const triggers = Array.from(
      (this.el.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('[muiMenubarTrigger]'),
    );
    if (!triggers.length) return;

    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return;
    const idx = triggers.indexOf(active);

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const n = triggers.length;
      const next = event.key === 'ArrowRight' ? (idx + 1) % n : (idx - 1 + n) % n;
      if (this._openId()) {
        const nextTrigger = triggers[next];
        const menuEl = nextTrigger.closest<HTMLElement>('[data-menubar-menu]');
        this._openId.set(menuEl?.dataset['menubarMenuId'] ?? null);
      }
      triggers[next].focus();
    } else if (event.key === 'Escape') {
      this._openId.set(null);
      if (idx >= 0) triggers[idx].focus();
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this._openId.set(null);
    }
  }
}
