import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  numberAttribute,
  input,
} from '@angular/core';

/**
 * AspectRatio — constrains its content to a specific width:height ratio.
 *
 * Usage:
 *   <mui-aspect-ratio [ratio]="16/9">
 *     <img src="…" alt="…" />
 *   </mui-aspect-ratio>
 *
 *   <mui-aspect-ratio ratio="1">  <!-- square -->
 *     <video …></video>
 *   </mui-aspect-ratio>
 */
@Component({
  selector: 'mui-aspect-ratio',
  standalone: true,
  template: `
    <div class="mui-aspect-ratio__inner" part="inner">
      <ng-content />
    </div>
  `,
  styleUrl: './aspect-ratio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[style.--_ratio]': 'ratio()',
    '[attr.part]': '"root"',
  },
})
export class AspectRatio {
  /** Numeric ratio — width divided by height. Default 16/9 ≈ 1.778. */
  ratio = input(16 / 9, { transform: numberAttribute });
}
