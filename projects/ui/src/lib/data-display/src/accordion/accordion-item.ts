import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import type { AccordionItemRef } from './accordion.types';
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
export class AccordionItem implements OnInit, OnDestroy, AccordionItemRef {
  /** Visible heading text of the trigger button. */
  heading = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });

  protected readonly triggerId = `mui-accordion-trigger-${itemUid}`;
  protected readonly panelId = `mui-accordion-panel-${itemUid++}`;

  private readonly group = inject(ACCORDION_CONTEXT, { optional: true });

  readonly isOpen = computed(() => this.group?.openIds().has(this.triggerId) ?? false);

  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  ngOnInit(): void {
    this.group?.register(this);
  }
  ngOnDestroy(): void {
    this.group?.unregister(this);
  }

  focusTrigger(): void {
    this.triggerRef()?.nativeElement.focus();
  }

  protected toggle(): void {
    if (!this.disabled()) this.group?.toggle(this.triggerId);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.group?.focusNext(this);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.group?.focusPrev(this);
        break;
      case 'Home':
        event.preventDefault();
        this.group?.focusFirst();
        break;
      case 'End':
        event.preventDefault();
        this.group?.focusLast();
        break;
    }
  }
}
