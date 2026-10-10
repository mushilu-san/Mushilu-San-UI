import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { parseInline } from './parse-inline';

@Component({
  selector: 'docs-inline-text',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: inline;
    }
  `,
  // Single line on purpose: any whitespace between segments would render as stray spaces.
  // prettier-ignore
  template: `@for (seg of segments(); track $index) {@switch (seg.kind) {@case ('code') {<code>{{ seg.value }}</code>}@case ('link') {<a [routerLink]="['/components', seg.slug]">{{ seg.value }}</a>}@default {{{ seg.value }}}}}`,
})
export class InlineText {
  readonly text = input.required<string>();
  protected readonly segments = computed(() => parseInline(this.text()));
}
