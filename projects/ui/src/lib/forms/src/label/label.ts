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
    '[attr.part]': '"root"',
  },
})
export class Label {
  /** Id of the control this label names. Sets the `for` attribute. */
  for = input<string>();
  /** Shows a required marker after the text. The marker is decorative; set `required` on the control too. */
  required = input(false, { transform: booleanAttribute });
  /** Dims the label to match a disabled control. */
  disabled = input(false, { transform: booleanAttribute });
}
