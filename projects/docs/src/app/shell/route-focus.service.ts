import { DOCUMENT } from '@angular/common';
import { Injectable, Injector, afterNextRender, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/** After each client-side navigation: focus the page h1 and announce the new title. */
@Injectable({ providedIn: 'root' })
export class RouteFocus {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly title = inject(Title);
  private readonly msg = signal('');
  readonly message = this.msg.asReadonly();
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    let first = true;
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        if (first) {
          first = false;
          return;
        }
        afterNextRender(
          () => {
            const h1 = this.document.querySelector<HTMLElement>('main h1');
            if (h1) {
              h1.setAttribute('tabindex', '-1');
              h1.focus();
            }
            this.msg.set(this.title.getTitle());
          },
          { injector: this.injector },
        );
      });
  }
}
