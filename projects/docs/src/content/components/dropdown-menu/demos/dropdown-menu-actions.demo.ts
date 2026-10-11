import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
} from '@mushilu-san/ui/overlays';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-dropdown-menu-actions-demo',
  imports: [DropdownMenu, DropdownTrigger, DropdownItem, DropdownSeparator, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-dropdown-menu [(open)]="open">
      <button muiButton variant="secondary" muiDropdownTrigger>Report actions</button>
      <mui-dropdown-item (itemClick)="last.set('Duplicated')">Duplicate</mui-dropdown-item>
      <mui-dropdown-item (itemClick)="last.set('Exported')" shortcut="⌘E">Export</mui-dropdown-item>
      <mui-dropdown-separator />
      <mui-dropdown-item color="danger" (itemClick)="last.set('Deleted')">Delete</mui-dropdown-item>
    </mui-dropdown-menu>
    <p>Last action: {{ last() }}</p>`,
})
export class DropdownMenuActionsDemo {
  protected readonly open = signal(false);
  protected readonly last = signal('none');
}
