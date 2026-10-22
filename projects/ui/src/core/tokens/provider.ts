import { InjectionToken, makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';

/**
 * Global library configuration. Currently has no options; reserved for future use.
 * (The unused `idPrefix` option was removed — see H-D-c3eb0a.)
 */
export type MushiluUiConfig = Record<string, never>;

export const MUSHILU_UI_CONFIG = new InjectionToken<MushiluUiConfig>('MUSHILU_UI_CONFIG', {
  factory: () => ({}),
});

export function provideMushiluUi(config: MushiluUiConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: MUSHILU_UI_CONFIG, useValue: { ...config } }]);
}
