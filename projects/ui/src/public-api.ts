/*
 * Primary public API surface of @mushilu-san/ui.
 * Components live in secondary entry points (e.g. @mushilu-san/ui/primitives).
 * This entry exports only the root provider and cross-cutting tokens.
 */

export { provideMushiluUi } from './core/tokens/provider';
export type { MushiluUiConfig } from './core/tokens/provider';
export { createDrag } from './core/drag/create-drag';
export type { DragCallbacks, DragSession } from './core/drag/create-drag';
export { useCva } from './core/forms/use-cva';
export type { CvaState } from './core/forms/use-cva';
export { handleRovingFocus } from './core/a11y/roving-focus';
export type { RovingFocusConfig, RovingOrientation } from './core/a11y/roving-focus';
export { computePosition } from './core/positioning/compute-position';
export type { Placement, PositionResult } from './core/positioning/compute-position';
