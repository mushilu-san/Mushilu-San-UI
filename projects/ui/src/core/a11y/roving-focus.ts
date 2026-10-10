export type RovingOrientation = 'horizontal' | 'vertical' | 'both';

export interface RovingFocusConfig {
  orientation?: RovingOrientation;
  wrap?: boolean;
  /** Right-to-left layout: swaps ArrowLeft/ArrowRight for horizontal/both. Default false. */
  rtl?: boolean;
}

export function handleRovingFocus(
  event: KeyboardEvent,
  items: HTMLElement[],
  activeElement: Element | null,
  config: RovingFocusConfig = {},
): boolean {
  const { orientation = 'vertical', wrap = true, rtl = false } = config;
  if (!items.length) return false;

  const startKey = rtl ? 'ArrowRight' : 'ArrowLeft';
  const endKey = rtl ? 'ArrowLeft' : 'ArrowRight';
  const prev =
    orientation === 'horizontal'
      ? [startKey]
      : orientation === 'vertical'
        ? ['ArrowUp']
        : [startKey, 'ArrowUp'];
  const next =
    orientation === 'horizontal'
      ? [endKey]
      : orientation === 'vertical'
        ? ['ArrowDown']
        : [endKey, 'ArrowDown'];

  const key = event.key;
  const idx = items.indexOf(activeElement as HTMLElement);

  let target: HTMLElement | undefined;

  if (prev.includes(key)) {
    target = idx > 0 ? items[idx - 1] : wrap ? items[items.length - 1] : undefined;
  } else if (next.includes(key)) {
    target = idx < items.length - 1 ? items[idx + 1] : wrap ? items[0] : undefined;
  } else if (key === 'Home') {
    target = items[0];
  } else if (key === 'End') {
    target = items[items.length - 1];
  } else {
    return false;
  }

  if (target) {
    event.preventDefault();
    target.focus();
  }
  return true;
}
