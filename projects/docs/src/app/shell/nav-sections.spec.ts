import type { RegistryEntry } from '../../content/types';
import { buildNavSections } from './nav-sections';

const entry = (slug: string, name: string, group: RegistryEntry['group']): RegistryEntry => ({
  slug,
  name,
  group,
  summary: '',
  load: () => Promise.reject(new Error('unused')),
});

describe('buildNavSections', () => {
  it('starts with Get started, then one section per non-empty group in GROUPS order, sorted by name', () => {
    const sections = buildNavSections([
      entry('tabs', 'Tabs', 'navigation'),
      entry('button', 'Button', 'primitives'),
      entry('badge', 'Badge', 'primitives'),
    ]);
    expect(sections.map((s) => s.label)).toEqual(['Get started', 'Primitives', 'Navigation']);
    expect(sections[0]?.links.map((l) => l.path)).toEqual(['/', '/getting-started', '/components']);
    expect(sections[1]?.links).toEqual([
      { label: 'Badge', path: '/components/badge' },
      { label: 'Button', path: '/components/button' },
    ]);
  });
});
