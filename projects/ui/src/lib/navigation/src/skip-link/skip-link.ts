import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';

@Component({
  selector: 'a[muiSkipLink]',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './skip-link.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"skip-link"',
    '(click)': 'onClick($event)',
  },
})
export class SkipLink {
  private readonly doc = inject(DOCUMENT);

  /**
   * Moves focus to the element the `href` hash names. A plain `#main` link breaks under
   * `<base href>` (it navigates to the base URL), so the jump is done here instead.
   */
  protected onClick(event: Event): void {
    const hash = (event.currentTarget as HTMLElement).getAttribute('href')?.split('#')[1];
    if (!hash) return;
    const target = this.doc.getElementById(decodeURIComponent(hash));
    if (!target) return;
    event.preventDefault();
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
  }
}
