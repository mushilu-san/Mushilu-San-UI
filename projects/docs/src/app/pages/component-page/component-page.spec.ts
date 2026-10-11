import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { provideMushiluUi } from '@mushilu-san/ui';
import type { ApiIndex } from '../../../content/api-types';
import { API_INDEX, DEMO_SOURCE_INDEX, DOCS_REGISTRY } from '../../../content/tokens';
import type { ComponentDoc, RegistryEntry } from '../../../content/types';
import { componentDocResolver } from './component-doc.resolver';
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

describe('componentDocResolver', () => {
  const run = (slug: string) =>
    TestBed.runInInjectionContext(() =>
      componentDocResolver({ paramMap: convertToParamMap({ slug }) } as never, {} as never),
    );

  beforeEach(() => TestBed.configureTestingModule({ providers }));

  it('resolves the loaded doc for a known slug', async () => {
    expect(await run('widget')).toBe(doc);
  });

  it('resolves undefined for an unknown slug', () => {
    expect(run('nope')).toBeUndefined();
  });

  it('resolves undefined when the doc fails to load', async () => {
    expect(await run('gadget')).toBeUndefined();
  });
});

describe('ComponentPage', () => {
  it('renders the h1 and the doc sections synchronously from the resolved doc', async () => {
    await render(ComponentPage, { inputs: { slug: 'widget', doc }, providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Widget' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Overview' })).toBeInTheDocument();
    expect(screen.queryByText(/Loading documentation/)).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Accessibility' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'API' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'More' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gadget' })).toHaveAttribute(
      'href',
      '/components/gadget',
    );
  });

  it('renders an "On this page" navigation', async () => {
    await render(ComponentPage, { inputs: { slug: 'widget', doc }, providers });
    const toc = screen.getByRole('navigation', { name: 'On this page' });
    expect(toc).toHaveTextContent('Examples');
  });

  it('shows a failure message when the doc could not be loaded', async () => {
    await render(ComponentPage, { inputs: { slug: 'widget', doc: undefined }, providers });
    expect(screen.getByRole('alert')).toHaveTextContent('failed to load');
  });

  it('shows not-found for an unknown slug', async () => {
    await render(ComponentPage, { inputs: { slug: 'nope' }, providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
  });
});
