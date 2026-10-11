import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Page not found</h1>
    <p>That page doesn't exist. Browse <a routerLink="/components">all components</a> instead.</p>
  `,
})
export class NotFound {}
