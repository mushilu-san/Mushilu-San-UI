import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MobileNav, MobileNavItem } from '@mushilu-san/ui/mobile';

@Component({
  selector: 'docs-mobile-nav-basic-demo',
  imports: [MobileNav, MobileNavItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-mobile-nav [(activeItem)]="active">
      <mui-mobile-nav-item value="home" label="Home" />
      <mui-mobile-nav-item value="inbox" label="Inbox" [badge]="3" />
      <mui-mobile-nav-item value="profile" label="Profile" />
    </mui-mobile-nav>
    <p>Active: {{ active() }}</p>`,
})
export class MobileNavBasicDemo {
  protected readonly active = signal('home');
}
