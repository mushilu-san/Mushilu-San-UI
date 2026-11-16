import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Stepper — an ordered list of numbered `mui-step` items.
 *
 * Numbers are generated automatically; set `[number]` on a step to override it.
 */
@Component({
  selector: 'mui-stepper',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './stepper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    role: 'list',
    '[attr.part]': '"root"',
  },
})
export class Stepper {}
