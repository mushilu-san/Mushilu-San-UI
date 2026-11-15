import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  untracked,
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
  /**
   * Visible heading text of the trigger button. Leave it empty and project the heading with
   * `slot="heading"` when it needs markup.
   */
  heading = input<string>('');
  /**
   * Wraps the trigger in a real heading of this level (1 to 6), the WAI-ARIA accordion pattern.
   * Unset keeps the trigger without a heading wrapper.
   */
  headingLevel = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => {
      const n = numberAttribute(v, 0);
      return n >= 1 && n <= 6 ? n : undefined;
    },
  });
  /**
   * Two-way open state. Set it to start open or to open the item from outside. Inside an
   * accordion group it stays in sync with the group's open items.
   */
  open = model(false);
  /** Disables this item so it cannot be opened. */
  disabled = input(false, { transform: booleanAttribute });

  protected readonly triggerId = `mui-accordion-trigger-${itemUid}`;
  protected readonly panelId = `mui-accordion-panel-${itemUid++}`;

  private readonly group = inject(ACCORDION_CONTEXT, { optional: true });
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly doc = inject(DOCUMENT);

  readonly isOpen = computed(() =>
    this.group ? this.group.openIds().has(this.triggerId) : this.open(),
  );

  constructor() {
    // Item -> group first, so an initial `[open]="true"` is not overwritten by the group sync.
    // `open` set from outside opens or closes this item in the group.
    effect(() => {
      const group = this.group;
      const want = this.open();
      if (!group) return;
      untracked(() => {
        if (want !== group.openIds().has(this.triggerId)) group.toggle(this.triggerId);
      });
    });
    // Group -> item: reflect the group's state in `open` (single-open mode closes siblings).
    effect(() => {
      const group = this.group;
      if (!group) return;
      const inGroup = group.openIds().has(this.triggerId);
      untracked(() => {
        if (this.open() !== inGroup) this.open.set(inGroup);
      });
    });
  }

  protected toggle(): void {
    if (this.disabled()) return;
    if (this.group) this.group.toggle(this.triggerId);
    else this.open.update((v) => !v);
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
