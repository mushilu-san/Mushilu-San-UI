import { DOCUMENT } from '@angular/common';
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
import { handleRovingFocus } from '@mushilu-san/ui';
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
  private readonly doc = inject(DOCUMENT);
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

    if (event.key === 'Escape') {
      const active = this.doc.activeElement;
      const idx = active instanceof HTMLElement ? triggers.indexOf(active) : -1;
      this._openId.set(null);
      if (idx >= 0) triggers[idx].focus();
      return;
    }

    const wasOpen = this._openId() !== null;
    const moved = handleRovingFocus(event, triggers, this.doc.activeElement, {
      orientation: 'horizontal',
    });
    if (moved && wasOpen) {
      const nextTrigger = this.doc.activeElement;
      const menuEl =
        nextTrigger instanceof HTMLElement
          ? nextTrigger.closest<HTMLElement>('[data-menubar-menu]')
          : null;
      this._openId.set(menuEl?.dataset['menubarMenuId'] ?? null);
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this._openId.set(null);
    }
  }
}
