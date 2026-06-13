import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'lead'
  | 'large'
  | 'small'
  | 'muted'
  | 'code'
  | 'blockquote';

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
    '[attr.part]': '"root"',
  },
})
export class Typography {
  variant = input<TypographyVariant>('p');
}
