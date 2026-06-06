import { InjectionToken, makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';

export interface MushiluUiConfig {
  /** Prefix for generated element IDs. Defaults to 'mui'. */
  idPrefix?: string;
}

export const MUSHILU_UI_CONFIG = new InjectionToken<MushiluUiConfig>('MUSHILU_UI_CONFIG', {
  factory: () => ({ idPrefix: 'mui' }),
});

export function provideMushiluUi(config: MushiluUiConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: MUSHILU_UI_CONFIG, useValue: { idPrefix: 'mui', ...config } },
  ]);
}
