import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { handleRovingFocus } from '@mushilu-san/ui';
import { TABS_CONTEXT } from './tabs';

@Component({
  selector: 'mui-tab-list',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './tabs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    role: 'tablist',
    '[attr.aria-orientation]': 'ctx.orientation()',
    '[attr.part]': '"tab-list"',
  },
})
export class TabList {
  protected ctx = inject(TABS_CONTEXT);
  private el = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);

  @HostListener('keydown', ['$event'])
  onKeydown(event: Event): void {
    const e = event as KeyboardEvent;
    const tabs = Array.from(
      this.el.nativeElement.querySelectorAll('[role="tab"]:not([aria-disabled="true"])'),
    ) as HTMLElement[];
    handleRovingFocus(e, tabs, this.doc.activeElement, {
      orientation: this.ctx.orientation(),
    });
  }
}
