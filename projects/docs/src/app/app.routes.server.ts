import { RenderMode, type ServerRoute } from '@angular/ssr';
import { GROUPS } from '../content/groups';
import { REGISTRY } from '../content/registry';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'getting-started', renderMode: RenderMode.Prerender },
  { path: 'components', renderMode: RenderMode.Prerender },
  {
    path: 'components/group/:group',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => GROUPS.map((g) => ({ group: g.id })),
  },
  {
    path: 'components/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => REGISTRY.map((e) => ({ slug: e.slug })),
  },
  // Unknown URLs render client-side; deploy copies index.csr.html to 404.html.
  { path: '**', renderMode: RenderMode.Client },
];
