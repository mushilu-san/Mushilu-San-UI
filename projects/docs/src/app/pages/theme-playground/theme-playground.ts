import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Alert } from '@mushilu-san/ui/feedback';
import { Card } from '@mushilu-san/ui/data-display';
import { Input } from '@mushilu-san/ui/forms';
import { Badge, Button } from '@mushilu-san/ui/primitives';
import { LIGHT_THEME } from '../../../content/light-theme';
import {
  CONTRAST_PAIRS,
  THEME_TOKENS,
  buildCss,
  changedTokens,
  contrastRatio,
  scopeStyle,
} from './playground.logic';

@Component({
  selector: 'docs-theme-playground',
  imports: [Alert, Card, Input, Badge, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      max-width: 60rem;
    }
    h2 {
      margin-block: var(--mui-space-6) var(--mui-space-2);
      font-size: var(--mui-font-size-lg);
    }
    .colours {
      display: grid;
      gap: var(--mui-space-2);
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    }
    .row {
      display: flex;
      align-items: center;
      gap: var(--mui-space-2);
      min-height: var(--mui-touch-target);
    }
    .row label {
      flex: 1;
      font-weight: var(--mui-font-weight-medium);
    }
    input[type='color'] {
      width: var(--mui-touch-target);
      height: var(--mui-touch-target);
      padding: 0;
      border: 1px solid var(--mui-color-border);
      border-radius: var(--mui-radius-md);
      background: none;
      cursor: pointer;
    }
    code {
      color: var(--mui-color-text-muted);
      font-size: var(--mui-font-size-xs);
      overflow-wrap: anywhere;
    }
    .contrast li {
      margin-block: var(--mui-space-1);
    }
    .pass {
      color: var(--mui-color-success-text);
    }
    .fail {
      color: var(--mui-color-danger);
    }
    .preview {
      display: grid;
      gap: var(--mui-space-3);
      padding: var(--mui-space-4);
      border: 1px solid var(--mui-color-border);
      border-radius: var(--mui-radius-lg);
      background: var(--mui-color-surface);
      color: var(--mui-color-text);
    }
    .preview-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mui-space-2);
    }
    textarea {
      width: 100%;
      min-height: 8rem;
      padding: var(--mui-space-2);
      border: 1px solid var(--mui-color-border);
      border-radius: var(--mui-radius-md);
      background: var(--mui-color-surface-raised);
      color: var(--mui-color-text);
      font-family: var(--mui-font-mono, ui-monospace, monospace);
      font-size: var(--mui-font-size-sm);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mui-space-2);
      margin-block-start: var(--mui-space-3);
    }
  `,
  template: `
    <h1>Theme playground</h1>
    <p>
      Change a colour and see the effect on the preview. Changes stay on this page. When you are
      happy, copy the CSS and add it to your app's stylesheet.
    </p>

    <h2 id="colours-heading">Colours</h2>
    <div class="colours" role="group" aria-labelledby="colours-heading">
      @for (token of tokens; track token.name) {
        <div class="row">
          <label [attr.for]="inputId(token.name)">{{ token.label }}</label>
          <input
            type="color"
            [id]="inputId(token.name)"
            [value]="values()[token.name]"
            (input)="setToken(token.name, $event)"
          />
          <code>{{ token.name }}</code>
        </div>
      }
    </div>
    <div class="actions">
      <button muiButton variant="secondary" type="button" (clicked)="reset()">
        Reset to defaults
      </button>
    </div>

    <h2 id="contrast-heading">Contrast</h2>
    <p>WCAG AA minimums: 4.5:1 for text, 3:1 for boundaries and focus rings.</p>
    <ul class="contrast" aria-labelledby="contrast-heading">
      @for (pair of pairs; track pair.label) {
        <li>
          {{ pair.label }}: {{ ratio(pair.fg, pair.bg) }}:1
          @if (passes(pair.fg, pair.bg, pair.min)) {
            <span class="pass">passes (needs {{ pair.min }}:1)</span>
          } @else {
            <span class="fail">fails (needs {{ pair.min }}:1)</span>
          }
        </li>
      }
    </ul>

    <h2 id="preview-heading">Preview</h2>
    <div class="preview" aria-labelledby="preview-heading" [style]="scope()">
      <div class="preview-row">
        <button muiButton type="button">Save changes</button>
        <button muiButton variant="secondary" type="button">Cancel</button>
        <button muiButton variant="destructive" type="button">Delete</button>
      </div>
      <div class="preview-row">
        <mui-badge variant="primary">Primary</mui-badge>
        <mui-badge variant="success">Active</mui-badge>
        <mui-badge variant="danger">Failed</mui-badge>
      </div>
      <mui-alert variant="warning" heading="Check your address">
        The postcode does not match the city.
      </mui-alert>
      <mui-card variant="outlined">
        <strong>Oak armchair</strong>
        <p>In stock. Ships in three to five days.</p>
      </mui-card>
      <input muiInput aria-label="Sample text field" placeholder="Type here" />
    </div>

    <h2 id="css-heading">CSS</h2>
    <textarea readonly aria-labelledby="css-heading" [value]="css()"></textarea>
    <div class="actions">
      <button muiButton type="button" (clicked)="copy()">Copy CSS</button>
    </div>
    <p role="status" aria-live="polite">{{ copyStatus() }}</p>
  `,
})
export class ThemePlayground {
  protected readonly tokens = THEME_TOKENS;
  protected readonly pairs = CONTRAST_PAIRS;
  protected readonly values = signal<Record<string, string>>(
    Object.fromEntries(THEME_TOKENS.map((t) => [t.name, t.value])),
  );
  protected readonly changed = computed(() => changedTokens(this.values()));
  protected readonly css = computed(() => buildCss(this.changed()));
  /** The preview is always light: every light colour token, then the user's changes on top. */
  protected readonly scope = computed(() => scopeStyle({ ...LIGHT_THEME, ...this.values() }));
  protected readonly copyStatus = signal('');

  private readonly doc = inject(DOCUMENT);

  protected inputId(name: string): string {
    return `token-${name.replace(/^--mui-/, '')}`;
  }

  protected setToken(name: string, event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    this.values.update((current) => ({ ...current, [name]: input.value }));
    this.copyStatus.set('');
  }

  protected reset(): void {
    this.values.set(Object.fromEntries(THEME_TOKENS.map((t) => [t.name, t.value])));
    this.copyStatus.set('Reset to the default theme.');
  }

  protected ratio(fg: string, bg: string): string {
    const v = this.valueOf(fg);
    const b = this.valueOf(bg);
    const r = contrastRatio(v, b);
    return r === null ? '—' : r.toFixed(2);
  }

  protected passes(fg: string, bg: string, min: number): boolean {
    const r = contrastRatio(this.valueOf(fg), this.valueOf(bg));
    return r !== null && r >= min;
  }

  protected async copy(): Promise<void> {
    const clipboard = this.doc.defaultView?.navigator.clipboard;
    if (!clipboard) {
      this.copyStatus.set('Copy is not available here. Select the CSS and copy it by hand.');
      return;
    }
    try {
      await clipboard.writeText(this.css());
      this.copyStatus.set('CSS copied.');
    } catch {
      this.copyStatus.set('Copy failed. Select the CSS and copy it by hand.');
    }
  }

  private valueOf(token: string): string {
    return this.values()[token] ?? '';
  }
}
