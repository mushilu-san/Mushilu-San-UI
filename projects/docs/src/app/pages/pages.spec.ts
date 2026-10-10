import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { provideMushiluUi } from '@mushilu-san/ui';
import { DOCS_REGISTRY } from '../../content/tokens';
import type { RegistryEntry } from '../../content/types';
import { ComponentsIndex } from './components-index/components-index';
import { GettingStarted } from './getting-started/getting-started';
import { GroupPage } from './group/group-page';

const registry: RegistryEntry[] = [
  {
    slug: 'button',
    name: 'Button',
    group: 'primitives',
    summary: 'Clicks.',
    load: () => Promise.reject(new Error('unused')),
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    group: 'navigation',
    summary: 'Switches.',
    load: () => Promise.reject(new Error('unused')),
  },
];
const providers = [
  provideRouter([]),
  provideMushiluUi(),
  { provide: DOCS_REGISTRY, useValue: registry },
];

describe('GettingStarted', () => {
  it('shows install, provider and styles steps', async () => {
    await render(GettingStarted, { providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Installation' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Terminal source' })).toHaveTextContent(
      'npm install @mushilu-san/ui',
    );
    expect(screen.getByRole('region', { name: 'app.config.ts source' })).toHaveTextContent(
      'provideMushiluUi()',
    );
  });
});

describe('ComponentsIndex', () => {
  it('lists documented components grouped, linking to each page', async () => {
    await render(ComponentsIndex, { providers });
    expect(screen.getByRole('heading', { level: 2, name: 'Primitives' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Button/ })).toHaveAttribute(
      'href',
      '/components/button',
    );
    expect(screen.queryByRole('heading', { level: 2, name: 'Forms' })).not.toBeInTheDocument();
  });
});

describe('GroupPage', () => {
  it('shows the group description, import path and its components', async () => {
    await render(GroupPage, { inputs: { group: 'navigation' }, providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Navigation' })).toBeInTheDocument();
    expect(screen.getByText('@mushilu-san/ui/navigation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Tabs/ })).toBeInTheDocument();
  });

  it('says when a group has no documented components yet', async () => {
    await render(GroupPage, { inputs: { group: 'forms' }, providers });
    expect(screen.getByText(/documentation for this group is coming soon/i)).toBeInTheDocument();
  });

  it('renders not-found for an unknown group', async () => {
    await render(GroupPage, { inputs: { group: 'nope' }, providers });
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
  });
});
