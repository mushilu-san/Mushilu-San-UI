import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { handleRovingFocus } from '@mushilu-san/ui';
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
    const items = Array.from(
      this.el.nativeElement.querySelectorAll('[muiMenubarItem]:not([aria-disabled="true"])'),
    ) as HTMLElement[];
    if (handleRovingFocus(event, items, this.doc.activeElement)) {
      event.stopPropagation();
    }
  }
}
