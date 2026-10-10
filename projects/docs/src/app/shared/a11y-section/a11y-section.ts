import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ComponentDoc } from '../../../content/types';
import { InlineText } from '../inline-text/inline-text';
import { parseKeys } from './parse-keys';

@Component({
  selector: 'docs-a11y-section',
  imports: [InlineText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../doc-table.css'],
  styles: `
    :host {
      display: block;
    }
    .combo + .combo::before {
      content: ' or ';
      color: var(--mui-color-text-muted);
    }
    .plus {
      padding-inline: 2px;
      color: var(--mui-color-text-muted);
    }
  `,
  template: `
    @if (a11y().roles.length > 0) {
      <h3>Roles and attributes</h3>
      <div class="scroll" tabindex="0" role="region" aria-label="ARIA roles">
        <table aria-label="ARIA roles and attributes">
          <thead>
            <tr>
              <th scope="col">Element</th>
              <th scope="col">Role</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            @for (r of a11y().roles; track r.element) {
              <tr>
                <td>
                  <code>{{ r.element }}</code>
                </td>
                <td>{{ r.role }}</td>
                <td>
                  @if (r.notes; as notes) {
                    <docs-inline-text [text]="notes" />
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
    @if (keyboard().length > 0) {
      <h3>Keyboard</h3>
      <div class="scroll" tabindex="0" role="region" aria-label="Keyboard">
        <table aria-label="Keyboard interactions">
          <thead>
            <tr>
              <th scope="col">Keys</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (k of keyboard(); track k.keys) {
              <tr>
                <td>
                  @for (combo of k.parsed; track $index) {
                    <span class="combo">
                      @for (key of combo; track $index; let last = $last) {
                        <kbd>{{ key }}</kbd>
                        @if (!last) {
                          <span class="plus" aria-hidden="true">+</span>
                        }
                      }
                    </span>
                  }
                </td>
                <td><docs-inline-text [text]="k.action" /></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
    @if (a11y().notes.length > 0) {
      <ul>
        @for (note of a11y().notes; track $index) {
          <li><docs-inline-text [text]="note" /></li>
        }
      </ul>
    }
  `,
})
export class A11ySection {
  readonly a11y = input.required<ComponentDoc['a11y']>();
  protected readonly keyboard = computed(() =>
    this.a11y().keyboard.map((k) => ({ ...k, parsed: parseKeys(k.keys) })),
  );
}
