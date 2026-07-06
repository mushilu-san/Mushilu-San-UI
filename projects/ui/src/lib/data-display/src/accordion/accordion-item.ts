import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { handleRovingFocus } from '@mushilu-san/ui';
import { ACCORDION_CONTEXT } from './accordion.types';

let itemUid = 0;

@Component({
  selector: 'mui-accordion-item',
  standalone: true,
  templateUrl: './accordion-item.html',
  styleUrl: './accordion-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"item"',
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class AccordionItem {
  /** Visible heading text of the trigger button. */
  heading = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });

  protected readonly triggerId = `mui-accordion-trigger-${itemUid}`;
  protected readonly panelId = `mui-accordion-panel-${itemUid++}`;

  private readonly group = inject(ACCORDION_CONTEXT, { optional: true });
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);

  readonly isOpen = computed(() => this.group?.openIds().has(this.triggerId) ?? false);

  protected toggle(): void {
    if (!this.disabled()) this.group?.toggle(this.triggerId);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: Event): void {
    const e = event as KeyboardEvent;
    const triggers = Array.from(
      this.el.nativeElement
        .closest('mui-accordion')
        ?.querySelectorAll('.mui-accordion-item__trigger:not([aria-disabled="true"])') ?? [],
    ) as HTMLElement[];
    handleRovingFocus(e, triggers, this.doc.activeElement, { orientation: 'vertical' });
  }
}
