import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Sidebar, SidebarItem, SidebarSection } from '@mushilu-san/ui/layout';
import { DOCS_REGISTRY } from '../../content/tokens';
import { buildNavSections } from './nav-sections';

@Component({
  selector: 'docs-nav',
  imports: [Sidebar, SidebarSection, SidebarItem, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
    mui-sidebar {
      width: 100%;
      height: auto;
      border: 0;
      background: transparent;
    }
  `,
  template: `
    <mui-sidebar label="Documentation" [collapsible]="false">
      @for (section of sections; track section.label) {
        <mui-sidebar-section [label]="section.label">
          @for (link of section.links; track link.path) {
            <!-- muiSidebarItem renders the [label] as the link's content -->
            <!-- eslint-disable-next-line @angular-eslint/template/elements-content -->
            <a
              muiSidebarItem
              [label]="link.label"
              [routerLink]="link.path"
              routerLinkActive
              #rla="routerLinkActive"
              [routerLinkActiveOptions]="{ exact: true }"
              [active]="rla.isActive"
              (click)="navigate.emit()"
            ></a>
          }
        </mui-sidebar-section>
      }
    </mui-sidebar>
  `,
})
export class DocsNav {
  readonly navigate = output<void>();
  private readonly registry = inject(DOCS_REGISTRY);
  /** The registry is static, so a plain field is enough (no computed). */
  protected readonly sections = buildNavSections(this.registry);
}
