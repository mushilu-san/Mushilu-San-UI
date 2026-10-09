/** 'start'/'end' are logical: left/right in LTR, right/left in RTL. */
export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end';

export interface ComputePositionOptions {
  /** Resolve logical 'start'/'end' for a right-to-left layout. Default false. */
  rtl?: boolean;
}

export interface PositionResult {
  top: number;
  left: number;
  /** Physical placement actually used (logical start/end resolved). */
  resolvedPlacement: 'top' | 'bottom' | 'left' | 'right';
}

export function computePosition(
  anchorRect: DOMRect,
  floatingWidth: number,
  floatingHeight: number,
  placement: Placement,
  gap = 8,
  viewportMargin = 4,
  options: ComputePositionOptions = {},
): PositionResult {
  const rtl = options.rtl === true;
  const resolved: PositionResult['resolvedPlacement'] =
    placement === 'start'
      ? rtl
        ? 'right'
        : 'left'
      : placement === 'end'
        ? rtl
          ? 'left'
          : 'right'
        : placement;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;

  let top: number;
  let left: number;

  switch (resolved) {
    case 'bottom':
      top = anchorRect.bottom + gap;
      left = anchorRect.left + (anchorRect.width - floatingWidth) / 2;
      break;
    case 'left':
      top = anchorRect.top + (anchorRect.height - floatingHeight) / 2;
      left = anchorRect.left - floatingWidth - gap;
      break;
    case 'right':
      top = anchorRect.top + (anchorRect.height - floatingHeight) / 2;
      left = anchorRect.right + gap;
      break;
    case 'top':
    default:
      top = anchorRect.top - floatingHeight - gap;
      left = anchorRect.left + (anchorRect.width - floatingWidth) / 2;
      break;
  }

  top = Math.max(viewportMargin, Math.min(top, vh - floatingHeight - viewportMargin));
  left = Math.max(viewportMargin, Math.min(left, vw - floatingWidth - viewportMargin));

  return { top, left, resolvedPlacement: resolved };
}
