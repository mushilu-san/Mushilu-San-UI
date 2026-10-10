import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge } from '@mushilu-san/ui/primitives';
import { groupInfo } from '../../../content/groups';
import { findEntry } from '../../../content/registry';
import { API_INDEX, DOCS_REGISTRY } from '../../../content/tokens';
import { A11ySection } from '../../shared/a11y-section/a11y-section';
import { ApiReference } from '../../shared/api-reference/api-reference';
import { CodeBlock, plainLines } from '../../shared/code-block/code-block';
import { DemoViewer } from '../../shared/demo-viewer/demo-viewer';
import { InlineText } from '../../shared/inline-text/inline-text';
import { NotFound } from '../not-found/not-found';
import { importStatement, pageSections } from './page-sections';

@Component({
  selector: 'docs-component-page',
  imports: [
    RouterLink,
    Badge,
    A11ySection,
    ApiReference,
    CodeBlock,
    DemoViewer,
    InlineText,
    NotFound,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-page.html',
  styleUrl: './component-page.css',
})
export class ComponentPage {
  readonly slug = input.required<string>();

  private readonly registry = inject(DOCS_REGISTRY);
  private readonly api = inject(API_INDEX);

  protected readonly entry = computed(() => findEntry(this.slug(), this.registry));
  protected readonly groupLabel = computed(() => {
    const e = this.entry();
    return e ? groupInfo(e.group).label : '';
  });
  protected readonly doc = resource({
    params: () => this.entry(),
    loader: ({ params }) => params.load(),
  });
  protected readonly loaded = computed(() => (this.doc.hasValue() ? this.doc.value() : undefined));
  protected readonly sections = computed(() => {
    const d = this.loaded();
    return d ? pageSections(d) : [];
  });
  protected readonly extraDemos = computed(() => this.loaded()?.demos.slice(1) ?? []);
  protected readonly importText = computed(() => {
    const d = this.loaded();
    return d ? importStatement(d, this.api) : '';
  });
  protected readonly importLines = computed(() => plainLines(this.importText()));

  protected nameOf(slug: string): string {
    return findEntry(slug, this.registry)?.name ?? slug;
  }
}
