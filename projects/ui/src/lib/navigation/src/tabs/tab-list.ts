import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  inject,
} from '@angular/core';
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

  @HostListener('keydown', ['$event'])
  onKeydown(event: Event): void {
    const e = event as KeyboardEvent;
    const isHorizontal = this.ctx.orientation() === 'horizontal';
    const prev = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const next = isHorizontal ? 'ArrowRight' : 'ArrowDown';

    if (e.key !== prev && e.key !== next && e.key !== 'Home' && e.key !== 'End') return;

    const tabs = Array.from(
      this.el.nativeElement.querySelectorAll('[role="tab"]:not([aria-disabled="true"])')
    ) as HTMLElement[];
    if (!tabs.length) return;

    const active = document.activeElement as HTMLElement;
    const idx = tabs.indexOf(active);

    let target: HTMLElement | undefined;
    if (e.key === prev) target = idx > 0 ? tabs[idx - 1] : tabs[tabs.length - 1];
    else if (e.key === next) target = idx < tabs.length - 1 ? tabs[idx + 1] : tabs[0];
    else if (e.key === 'Home') target = tabs[0];
    else if (e.key === 'End') target = tabs[tabs.length - 1];

    if (target) {
      e.preventDefault();
      target.focus();
    }
  }
}
