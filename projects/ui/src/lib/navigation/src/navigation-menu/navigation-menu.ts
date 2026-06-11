import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Signal,
  ViewEncapsulation,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { NAV_MENU_CONTEXT, NavMenuContext } from './navigation-menu-context';

@Component({
  selector: 'mui-navigation-menu',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './navigation-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: NAV_MENU_CONTEXT,
      useExisting: forwardRef(() => NavigationMenu),
    },
  ],
  host: {
    'role':          'navigation',
    '[attr.aria-label]': 'label()',
    '[attr.part]':   '"root"',
  },
})
export class NavigationMenu implements NavMenuContext {
  label = input('Main navigation');

  private readonly el      = inject(ElementRef<HTMLElement>);
  private readonly _openId = signal<string | null>(null);
  readonly openId: Signal<string | null> = this._openId.asReadonly();

  setOpen(id: string | null): void {
    this._openId.set(id);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this._openId.set(null);
    }
  }

  @HostListener('keydown.escape')
  protected onEscape(): void {
    this._openId.set(null);
  }
}
