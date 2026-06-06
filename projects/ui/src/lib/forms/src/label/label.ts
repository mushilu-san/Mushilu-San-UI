import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';

@Component({
  selector: 'mui-label',
  standalone: true,
  templateUrl: './label.html',
  styleUrl: './label.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-required]': 'required() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.part]':          '"root"',
  },
})
export class Label {
  for      = input<string>();
  required = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
}
