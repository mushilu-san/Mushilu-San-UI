import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';

export type TypographyVariant =
  'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'lead' | 'large' | 'small' | 'muted' | 'code' | 'blockquote';

/**
 * Typography — styled prose text component.
 *
 * Usage:
 *   <mui-typography variant="h1">Page heading</mui-typography>
 *   <mui-typography variant="lead">A leading paragraph.</mui-typography>
 *   <mui-typography variant="muted">Helper text</mui-typography>
 */
@Component({
  selector: 'mui-typography',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './typography.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.role]': 'headingLevel() ? "heading" : null',
    '[attr.aria-level]': 'headingLevel()',
    '[attr.part]': '"root"',
  },
})
export class Typography {
  /** Type style: `h1`–`h4`, `p`, `lead`, `large`, `small`, `muted`, `code` or `blockquote`. Default `p`. */
  variant = input<TypographyVariant>('p');

  /**
   * Heading levels are exposed as `role="heading"` so screen readers see the outline (#725).
   * The text stays a styled host, so nothing is wrapped in a native heading element.
   */
  protected readonly headingLevel = computed(() => {
    const v = this.variant();
    return v === 'h1' || v === 'h2' || v === 'h3' || v === 'h4' ? Number(v.slice(1)) : null;
  });
}
