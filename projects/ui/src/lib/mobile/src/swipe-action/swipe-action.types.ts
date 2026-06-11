export type SwipeActionColor = 'primary' | 'danger' | 'success' | 'warning' | 'surface';
export type SwipeSide = 'left' | 'right';

export interface SwipeActionItem {
  /** Unique key for this action. */
  key: string;
  /** Visible label text. */
  label: string;
  /** Which side this action lives on. */
  side: SwipeSide;
  /** Color theme. */
  color?: SwipeActionColor;
}
