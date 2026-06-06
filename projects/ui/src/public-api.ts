/*
 * Primary public API surface of @mushilu-san/ui.
 * Components live in secondary entry points (e.g. @mushilu-san/ui/primitives).
 * This entry exports only the root provider and cross-cutting tokens.
 */

export { provideMushiluUi } from './core/tokens/provider';
export type { MushiluUiConfig } from './core/tokens/provider';
