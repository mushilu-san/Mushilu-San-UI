import { GROUPS } from '../../content/groups';
import type { RegistryEntry } from '../../content/types';

export interface NavLink {
  label: string;
  path: string;
}

export interface NavSection {
  label: string;
  links: NavLink[];
}

export function buildNavSections(registry: readonly RegistryEntry[]): NavSection[] {
  const start: NavSection = {
    label: 'Get started',
    links: [
      { label: 'Introduction', path: '/' },
      { label: 'Installation', path: '/getting-started' },
      { label: 'All components', path: '/components' },
    ],
  };
  const groups = GROUPS.map((g) => ({
    label: g.label,
    links: registry
      .filter((e) => e.group === g.id)
      .map((e) => ({ label: e.name, path: `/components/${e.slug}` }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  })).filter((s) => s.links.length > 0);
  return [start, ...groups];
}
