import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mui-input-group-addon',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './input-group-addon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: { '[attr.part]': '"addon"' },
})
export class InputGroupAddon {}
