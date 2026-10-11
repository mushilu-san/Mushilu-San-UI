import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@mushilu-san/ui/overlays';

@Component({
  selector: 'docs-context-menu-file-demo',
  imports: [ContextMenu, ContextMenuTrigger, ContextMenuItem, ContextMenuSeparator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-context-menu [(open)]="open">
      <div
        muiContextMenuTrigger
        style="padding: var(--mui-space-4); border: 1px dashed var(--mui-color-border);"
      >
        Right-click (or long-press) this area
      </div>
      <mui-context-menu-item (selected)="last.set('Renamed')">Rename</mui-context-menu-item>
      <mui-context-menu-item (selected)="last.set('Copied')">Copy</mui-context-menu-item>
      <mui-context-menu-separator />
      <mui-context-menu-item color="danger" (selected)="last.set('Deleted')"
        >Delete</mui-context-menu-item
      >
    </mui-context-menu>
    <p>Last action: {{ last() }}</p>`,
})
export class ContextMenuFileDemo {
  protected readonly open = signal(false);
  protected readonly last = signal('none');
}
