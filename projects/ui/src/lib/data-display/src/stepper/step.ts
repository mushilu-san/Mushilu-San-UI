import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

/**
 * Step — one item of a `mui-stepper`: numbered marker, a label (optionally a link),
 * an optional meta slot (`slot="meta"`) and projected description content.
 */
@Component({
  selector: 'mui-step',
  standalone: true,
  templateUrl: './step.html',
  styleUrl: './step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    role: 'listitem',
    '[attr.part]': '"root"',
    '[style.counter-set]': 'counterSet()',
  },
})
export class Step {
  /** Step heading. */
  label = input.required<string>();
  /** Explicit number; defaults to the automatic position in the list. */
  number = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v == null ? undefined : numberAttribute(v)),
  });
  /** When set the label becomes a link stretched over the whole step. */
  href = input<string | undefined>(undefined);
  /** Anchor `target` when `href` is set. */
  target = input<string | undefined>(undefined);
  /** Anchor `rel` when `href` is set. */
  rel = input<string | undefined>(undefined);

  protected readonly counterSet = computed(() => {
    const n = this.number();
    return n === undefined ? null : `mui-step ${n}`;
  });
}
