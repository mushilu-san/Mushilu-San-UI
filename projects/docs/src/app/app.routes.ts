import type { Routes } from '@angular/router';
import { componentTitle, groupTitle } from './route-titles';

export const routes: Routes = [
  {
    path: '',
    title: 'Introduction',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'getting-started',
    title: 'Installation',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: 'components',
    title: 'Components',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: 'components/group/:group',
    title: groupTitle,
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: 'components/:slug',
    title: componentTitle,
    loadComponent: () =>
      import('./pages/component-page/component-page').then((m) => m.ComponentPage),
  },
  {
    path: '**',
    title: 'Not found',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
