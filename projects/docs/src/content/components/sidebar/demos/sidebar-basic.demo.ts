import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Sidebar, SidebarItem, SidebarSection, SidebarTrigger } from '@mushilu-san/ui/layout';
import { Icon } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-sidebar-basic-demo',
  imports: [Sidebar, SidebarItem, SidebarSection, SidebarTrigger, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-sidebar [(expanded)]="expanded">
      <button muiSidebarTrigger>Toggle</button>
      <mui-sidebar-section label="Workspace">
        <a muiSidebarItem href="#home" label="Home" [active]="true"
          ><mui-icon slot="icon" name="home"
        /></a>
        <a muiSidebarItem href="#search" label="Search"><mui-icon slot="icon" name="search" /></a>
      </mui-sidebar-section>
      <mui-sidebar-section label="Account">
        <a muiSidebarItem href="#profile" label="Profile"><mui-icon slot="icon" name="user" /></a>
      </mui-sidebar-section>
    </mui-sidebar>
    <p>Sidebar is {{ expanded() ? 'expanded' : 'collapsed' }}.</p>`,
})
export class SidebarBasicDemo {
  protected readonly expanded = signal(true);
}
