export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface PositionResult {
  top: number;
  left: number;
}

export function computePosition(
  anchorRect: DOMRect,
  floatingWidth: number,
  floatingHeight: number,
  placement: Placement,
  gap = 8,
  viewportMargin = 4,
): PositionResult {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;

  let top: number;
  let left: number;

  switch (placement) {
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

  return { top, left };
}
