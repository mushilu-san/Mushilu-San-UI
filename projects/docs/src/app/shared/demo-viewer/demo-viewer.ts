import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type Type,
  afterNextRender,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { Tab, TabList, TabPanel, Tabs } from '@mushilu-san/ui/navigation';
import { Button } from '@mushilu-san/ui/primitives';
import { DEMO_SOURCE_INDEX } from '../../../content/source-tokens';
import type { DemoRef } from '../../../content/types';
import { CodeBlock } from '../code-block/code-block';

@Component({
  selector: 'docs-demo-viewer',
  imports: [NgComponentOutlet, Tabs, TabList, Tab, TabPanel, CodeBlock, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo-viewer.css',
  template: `
    <mui-tabs [(activeTab)]="tab">
      <mui-tab-list [attr.aria-label]="demo().title + ' example'">
        <mui-tab [value]="previewValue()">Preview</mui-tab>
        <mui-tab [value]="codeValue()">Code</mui-tab>
      </mui-tab-list>
      <mui-tab-panel [value]="previewValue()">
        <div class="toolbar" role="group" aria-label="Preview options">
          <button
            muiButton
            variant="ghost"
            size="sm"
            type="button"
            [attr.aria-pressed]="mobile()"
            (clicked)="mobile.set(!mobile())"
          >
            Mobile frame
          </button>
          <button
            muiButton
            variant="ghost"
            size="sm"
            type="button"
            [attr.aria-pressed]="rtl()"
            (clicked)="rtl.set(!rtl())"
          >
            Right to left
          </button>
        </div>
        <div
          class="stage"
          part="stage"
          [class.stage--mobile]="mobile()"
          [attr.dir]="rtl() ? 'rtl' : null"
        >
          @if (component(); as cmp) {
            <ng-container *ngComponentOutlet="cmp" />
          } @else if (failed()) {
            <p role="alert">This example failed to load.</p>
          } @else {
            <p class="placeholder" aria-busy="true">Loading example…</p>
          }
        </div>
      </mui-tab-panel>
      <mui-tab-panel [value]="codeValue()">
        @if (source(); as src) {
          <docs-code-block
            [lines]="src.lines"
            [source]="src.source"
            [label]="demo().id + '.demo.ts'"
          />
        }
      </mui-tab-panel>
    </mui-tabs>
  `,
})
export class DemoViewer {
  readonly demo = input.required<DemoRef>();

  private readonly sources = inject(DEMO_SOURCE_INDEX);
  protected readonly previewValue = computed(() => `preview-${this.demo().id}`);
  protected readonly codeValue = computed(() => `code-${this.demo().id}`);
  protected readonly tab = linkedSignal(() => this.previewValue());
  protected readonly source = computed(() => this.sources[this.demo().id]);
  protected readonly component = signal<Type<unknown> | null>(null);
  protected readonly failed = signal(false);
  /** Shows the example in a phone-width frame. Preview only; the code tab is unchanged. */
  protected readonly mobile = signal(false);
  /** Renders the example with `dir="rtl"` on the stage, so library components mirror. */
  protected readonly rtl = signal(false);

  constructor() {
    afterNextRender(() => {
      void this.load();
    });
  }

  private async load(): Promise<void> {
    try {
      this.component.set(await this.demo().component());
    } catch {
      this.failed.set(true);
    }
  }
}
