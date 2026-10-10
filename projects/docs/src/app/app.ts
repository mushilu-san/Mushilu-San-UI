import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sheet } from '@mushilu-san/ui/feedback';
import { DocsHeader } from './shell/docs-header';
import { DocsNav } from './shell/docs-nav';
import { RouteFocus } from './shell/route-focus.service';

@Component({
  selector: 'docs-root',
  imports: [RouterOutlet, Sheet, DocsHeader, DocsNav],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly navOpen = signal(false);
  protected readonly routeFocus = inject(RouteFocus);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.routeFocus.init();
  }

  protected skipToMain(): void {
    this.document.getElementById('main')?.focus();
  }
}
