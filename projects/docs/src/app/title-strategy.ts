import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { type RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE = 'Mushilu-San UI';

@Injectable({ providedIn: 'root' })
export class DocsTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = this.buildTitle(snapshot);
    this.title.setTitle(page ? `${page} · ${SITE}` : SITE);
  }
}
