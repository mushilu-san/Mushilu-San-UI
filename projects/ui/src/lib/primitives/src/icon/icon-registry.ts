import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import type { EnvironmentProviders } from '@angular/core';

/** Stroke paths of one icon, drawn in a 24x24 box. */
export interface IconData {
  paths: string[];
}

/** Extra icons registered with `provideMuiIcons()`, keyed by name. Multi-provided. */
export const MUI_ICONS = new InjectionToken<Record<string, IconData>[]>('MUI_ICONS');

/**
 * Registers extra icons for `mui-icon`, so an app does not fall back to inline SVG.
 * A registered name overrides a built-in icon of the same name.
 *
 * @example
 * provideMuiIcons({ 'my-logo': { paths: ['M4 4h16v16H4z'] } })
 */
export function provideMuiIcons(icons: Record<string, IconData>): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: MUI_ICONS, useValue: icons, multi: true }]);
}
