import { Directive, input } from '@angular/core';

@Directive({ selector: '[muiFixtureTip]' })
export class FixtureTip {
  muiFixtureTip = input.required<string>();
}
