import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  input,
  model,
  viewChild,
} from '@angular/core';

let headerUid = 0;

@Component({
  selector: 'mui-site-header',
  standalone: true,
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
    '[attr.data-open]': 'open() ? "" : null',
    '(keydown.escape)': 'onEscape()',
  },
})
export class SiteHeader {
  /** Two-way open state of the collapsed menu. Has no effect on wide screens. */
  open = model(false);
  /** Accessible name of the menu button. Translate it for non-English pages. Default `Menu`. */
  menuLabel = input('Menu');
  /** Accessible name of the navigation landmark. Default `Main`. */
  navLabel = input('Main');

  protected readonly navId = `mui-site-header-nav-${headerUid++}`;

  private readonly toggleRef = viewChild.required<ElementRef<HTMLButtonElement>>('toggleBtn');

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  /** Escape closes the menu and returns focus to the button that opened it. */
  protected onEscape(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.toggleRef().nativeElement.focus();
  }

  /** Following a link inside the menu closes it. */
  protected onNavClick(event: Event): void {
    if ((event.target as Element).closest('a[href]')) this.open.set(false);
  }
}
