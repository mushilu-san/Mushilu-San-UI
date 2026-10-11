import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Button } from '@mushilu-san/ui/primitives';
import type { CodeLines } from '../../../content/code-types';

export function plainLines(text: string): CodeLines {
  return text.split('\n').map((v) => (v ? [{ t: 'plain' as const, v }] : []));
}

@Component({
  selector: 'docs-code-block',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './code-block.css',
  template: `
    <div class="bar">
      <span class="label">{{ label() }}</span>
      <button
        muiButton
        variant="ghost"
        size="sm"
        type="button"
        class="copy"
        aria-label="Copy code"
        (click)="copy()"
      >
        {{ state() === 'copied' ? 'Copied' : state() === 'failed' ? 'Copy failed' : 'Copy' }}
      </button>
    </div>
    <!-- prettier-ignore -->
    <pre class="pre" role="region" tabindex="0" [attr.aria-label]="label() + ' source'"><code>@for (line of lines(); track $index) {<span class="line">@for (tok of line; track $index) {<span [class]="'tok-' + tok.t">{{ tok.v }}</span>}</span>}</code></pre>
    <span class="visually-hidden" role="status" aria-live="polite">{{
      state() === 'copied' ? 'Code copied to clipboard' : state() === 'failed' ? 'Copy failed' : ''
    }}</span>
  `,
})
export class CodeBlock {
  readonly lines = input.required<CodeLines>();
  readonly source = input.required<string>();
  readonly label = input('Code');

  protected readonly state = signal<'idle' | 'copied' | 'failed'>('idle');
  private readonly document = inject(DOCUMENT);
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
  }

  protected async copy(): Promise<void> {
    const clipboard = this.document.defaultView?.navigator.clipboard;
    if (!clipboard) {
      this.flash('failed');
      return;
    }
    try {
      await clipboard.writeText(this.source());
    } catch {
      this.flash('failed');
      return;
    }
    this.flash('copied');
  }

  private flash(next: 'copied' | 'failed'): void {
    this.state.set(next);
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.state.set('idle'), 2000);
  }
}
