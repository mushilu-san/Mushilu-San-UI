import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-navigation-menu-basic-demo',
  imports: [
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-navigation-menu>
    <mui-navigation-menu-item>
      <button muiNavMenuTrigger>Products</button>
      <mui-navigation-menu-content>
        <a muiNavMenuLink href="#chairs">Chairs</a>
        <a muiNavMenuLink href="#desks">Desks</a>
      </mui-navigation-menu-content>
    </mui-navigation-menu-item>
    <mui-navigation-menu-item>
      <a muiNavMenuLink href="#about">About</a>
    </mui-navigation-menu-item>
  </mui-navigation-menu>`,
})
export class NavigationMenuBasicDemo {}
