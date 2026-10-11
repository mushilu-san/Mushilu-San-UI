import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavLink } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-nav-link-bar-demo',
  imports: [NavLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<nav aria-label="Site">
    <a muiNavLink href="#home" [active]="true">Home</a>
    <a muiNavLink href="#projects">Projects</a>
    <a muiNavLink href="#about" variant="primary">About</a>
  </nav>`,
})
export class NavLinkBarDemo {}
