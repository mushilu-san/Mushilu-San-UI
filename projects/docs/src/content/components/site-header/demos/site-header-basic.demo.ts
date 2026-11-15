import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavLink, SiteHeader } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-site-header-basic-demo',
  imports: [SiteHeader, NavLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-site-header>
    <a slot="brand" href="#home">Loom</a>
    <a muiNavLink href="#blog" [active]="true">Blog</a>
    <a muiNavLink href="#tags">Tags</a>
    <a muiNavLink href="#about">About</a>
  </mui-site-header>`,
})
export class SiteHeaderBasicDemo {}
