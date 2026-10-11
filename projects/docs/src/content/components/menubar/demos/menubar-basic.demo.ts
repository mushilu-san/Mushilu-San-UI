import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-menubar-basic-demo',
  imports: [Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-menubar label="Application">
    <mui-menubar-menu>
      <button muiMenubarTrigger>File</button>
      <mui-menubar-content>
        <button muiMenubarItem>New file</button>
        <button muiMenubarItem>Open…</button>
        <mui-menubar-separator />
        <button muiMenubarItem>Close</button>
      </mui-menubar-content>
    </mui-menubar-menu>
    <mui-menubar-menu>
      <button muiMenubarTrigger>Edit</button>
      <mui-menubar-content>
        <button muiMenubarItem>Undo</button>
        <button muiMenubarItem>Redo</button>
      </mui-menubar-content>
    </mui-menubar-menu>
  </mui-menubar>`,
})
export class MenubarBasicDemo {}
