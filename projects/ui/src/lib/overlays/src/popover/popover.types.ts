/**
 * '*-start' / '*-end' on top/bottom are inline-axis (start = left in LTR, right in RTL).
 * Bare 'start' / 'end' place the panel on the inline start/end side of the trigger.
 */
export type PopoverPlacement =
  | 'start'
  | 'end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';
