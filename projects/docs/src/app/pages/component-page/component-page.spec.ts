import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { provideMushiluUi } from '@mushilu-san/ui';
import type { ApiIndex } from '../../../content/api-types';
import { API_INDEX, DEMO_SOURCE_INDEX, DOCS_REGISTRY } from '../../../content/tokens';
import type { ComponentDoc, RegistryEntry } from '../../../content/types';
import { ComponentPage } from './component-page';
import { importStatement, pageSections } from './page-sections';

@Component({
  selector: 'docs-widget-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p>widget demo</p>',
})
class WidgetDemo {}

const doc: ComponentDoc = {
  slug: 'widget',
  name: 'Widget',
  group: 'primitives',
  selector: 'mui-widget',
  apiClasses: ['Widget', 'WidgetService'],
  summary: 'A test widget.',
  description: ['Widget body with `code`.'],
  whenToUse: ['Always.'],
  whenNotToUse: [{ text: 'Never for gadgets.', alternative: 'gadget' }],
  demos: [
    { id: 'widget-basic', title: 'Basic', component: async () => WidgetDemo },
    { id: 'widget-more', title: 'More', component: async () => WidgetDemo },
  ],
  a11y: { roles: [], keyboard: [{ keys: 'Enter', action: 'Activates.' }], notes: [] },
  tokens: ['--mui-color-primary'],
};

const registry: RegistryEntry[] = [
  {
    slug: 'widget',
    name: 'Widget',
    group: 'primitives',
    summary: 'A test widget.',
    load: async () => doc,
  },
  {
    slug: 'gadget',
    name: 'Gadget',
    group: 'primitives',
    summary: 'g',
    load: () => Promise.reject(new Error('unused')),
  },
];

const api: ApiIndex = {
  Widget: {
    name: 'Widget',
    group: 'primitives',
    kind: 'component',
    selector: 'mui-widget',
    members: [],
    methods: [],
    parts: [],
  },
  WidgetService: {
    name: 'WidgetService',
    group: 'primitives',
    kind: 'service',
    providedIn: 'root',
    members: [],
    methods: [],
    parts: [],
  },
};

const providers = [
  provideRouter([]),
  provideMushiluUi(),
  { provide: DOCS_REGISTRY, useValue: registry },
  { provide: API_INDEX, useValue: api },
  { provide: DEMO_SOURCE_INDEX, useValue: {} },
];

describe('pageSections', () => {
  it('lists only the sections the doc has, in page order', () => {
    expect(pageSections(doc).map((s) => s.id)).toEqual([
      'overview',
      'examples',
      'accessibility',
      'api',
      'tokens',
    ]);
  });
});

describe('importStatement', () => {
  it('imports every API class from the group entry point', () => {
    expect(importStatement(doc, api)).toBe(
      "import { Widget, WidgetService } from '@mushilu-san/ui/primitives';",
    );
  });
});

describe('ComponentPage', () => {
  it('renders the h1 from the registry immediately and the doc sections once loaded', async () => {
    await render(ComponentPage, { inputs: { slug: 'widget' }, providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Widget' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 2, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Accessibility' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'API' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'More' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gadget' })).toHaveAttribute(
      'href',
      '/components/gadget',
    );
  });

  it('renders an "On this page" navigation', async () => {
    await render(ComponentPage, { inputs: { slug: 'widget' }, providers });
    const toc = await screen.findByRole('navigation', { name: 'On this page' });
    expect(toc).toHaveTextContent('Examples');
  });

  it('shows not-found for an unknown slug', async () => {
    await render(ComponentPage, { inputs: { slug: 'nope' }, providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
  });
});
