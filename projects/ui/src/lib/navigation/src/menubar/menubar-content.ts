import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { MENUBAR_MENU_CONTEXT } from './menubar-context';

@Component({
  selector: 'mui-menubar-content',
  standalone: true,
  templateUrl: './menubar-content.html',
  styleUrl: './menubar-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    role: 'menu',
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.part]': '"content"',
    '(keydown)': 'onKeydown($event)',
  },
})
export class MenubarContent {
  private readonly ctx = inject(MENUBAR_MENU_CONTEXT);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);

  protected readonly isOpen = computed(() => this.ctx.isOpen());

  protected onKeydown(event: KeyboardEvent): void {
    if (
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    )
      return;
    event.preventDefault();
    event.stopPropagation();

    const items = Array.from(
      this.el.nativeElement.querySelectorAll('[muiMenubarItem]:not([aria-disabled="true"])'),
    ) as HTMLElement[];
    if (!items.length) return;

    const active = this.doc.activeElement as HTMLElement;
    const idx = items.indexOf(active);

    let next: number;
    if (event.key === 'ArrowDown') next = idx < items.length - 1 ? idx + 1 : 0;
    else if (event.key === 'ArrowUp') next = idx > 0 ? idx - 1 : items.length - 1;
    else if (event.key === 'Home') next = 0;
    else next = items.length - 1;

    (items[next] as HTMLElement).focus();
  }
}
