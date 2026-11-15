import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';

/** `undefined` (attribute absent) stays `undefined`, so a plain chip carries no selected state. */
const optionalBoolean = (v: unknown): boolean | undefined =>
  v === undefined || v === null ? undefined : booleanAttribute(v);

@Component({
  selector: 'a[muiChip], button[muiChip], mui-chip',
  standalone: true,
  templateUrl: './chip.html',
  styleUrl: './chip.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
    '[attr.data-selected]': 'selected() ? "" : null',
    '[attr.data-interactive]': 'tag !== "MUI-CHIP" ? "" : null',
    // A link marks the current page; a button is a toggle only when `selected` is bound.
    '[attr.aria-current]': 'tag === "A" && selected() ? "page" : null',
    '[attr.aria-pressed]': 'tag === "BUTTON" && selected() !== undefined ? selected() : null',
  },
})
export class Chip {
  /**
   * Selected state. On a link it sets `aria-current="page"`; on a button it sets `aria-pressed`
   * (leave it unset for a button that is not a toggle).
   */
  selected = input<boolean | undefined, unknown>(undefined, { transform: optionalBoolean });
  /** Text shown before the label, such as `#` for a tag. It is decorative and hidden from screen readers. */
  leading = input<string>();

  protected readonly tag = (inject(ElementRef).nativeElement as HTMLElement).tagName;
}
