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
  providers: [
    { provide: MENUBAR_CONTEXT, useExisting: forwardRef(() => Menubar) },
  ],
  host: {
    'role':              'menubar',
    '[attr.aria-label]': 'label()',
    '[attr.part]':       '"root"',
    '(keydown)':         'onKeydown($event)',
  },
})
export class Menubar implements MenubarContext {
  label = input('Menu bar');

  private readonly el      = inject(ElementRef<HTMLElement>);
  private readonly _openId = signal<string | null>(null);
  readonly openId: Signal<string | null> = this._openId.asReadonly();

  setOpen(id: string | null): void {
    this._openId.set(id);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const triggers = Array.from(
      this.el.nativeElement.querySelectorAll('[muiMenubarTrigger]'),
    ) as HTMLElement[];
    if (!triggers.length) return;

    const active = document.activeElement as HTMLElement;
    const idx    = triggers.indexOf(active);

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const n    = triggers.length;
      const next = event.key === 'ArrowRight' ? (idx + 1) % n : (idx - 1 + n) % n;
      /* If a menu is open, follow-open the next menu */
      if (this._openId()) {
        const nextTrigger = triggers[next];
        const menuEl = nextTrigger.closest('[data-menubar-menu]') as HTMLElement | null;
        this._openId.set(menuEl?.dataset['menubarMenuId'] ?? null);
      }
      (triggers[next] as HTMLElement).focus();
    } else if (event.key === 'Escape') {
      this._openId.set(null);
      /* Return focus to the active trigger */
      if (idx >= 0) (triggers[idx] as HTMLElement).focus();
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this._openId.set(null);
    }
  }
}
