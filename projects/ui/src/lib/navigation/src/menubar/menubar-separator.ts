import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mui-menubar-separator',
  standalone: true,
  template: '',
  styles: [`:host { display: block; height: 1px; margin: var(--mui-space-1) 0;
    background-color: var(--mui-color-border); }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: { 'role': 'separator', '[attr.part]': '"separator"' },
})
export class MenubarSeparator {}
