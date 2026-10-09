export type SwipeActionColor = 'primary' | 'danger' | 'success' | 'warning' | 'surface';
/**
 * `start`/`end` are logical (flip under RTL); `left`/`right` are physical aliases.
 */
export type SwipeSide = 'left' | 'right' | 'start' | 'end';

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
