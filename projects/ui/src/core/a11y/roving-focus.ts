export type RovingOrientation = 'horizontal' | 'vertical' | 'both';

export interface RovingFocusConfig {
  orientation?: RovingOrientation;
  wrap?: boolean;
}

export function handleRovingFocus(
  event: KeyboardEvent,
  items: HTMLElement[],
  activeElement: Element | null,
  config: RovingFocusConfig = {},
): boolean {
  const { orientation = 'vertical', wrap = true } = config;
  if (!items.length) return false;

  const prev =
    orientation === 'horizontal'
      ? ['ArrowLeft']
      : orientation === 'vertical'
        ? ['ArrowUp']
        : ['ArrowLeft', 'ArrowUp'];
  const next =
    orientation === 'horizontal'
      ? ['ArrowRight']
      : orientation === 'vertical'
        ? ['ArrowDown']
        : ['ArrowRight', 'ArrowDown'];

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
