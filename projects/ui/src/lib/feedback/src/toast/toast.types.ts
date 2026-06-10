export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  /** Severity; drives styling and live-region politeness. Default `info`. */
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. `0` keeps the toast until dismissed. Default `5000`. */
  duration?: number;
  /** Optional bold title rendered above the message. */
  title?: string;
}

export interface ToastRef {
  readonly id: number;
  readonly message: string;
  readonly variant: ToastVariant;
  readonly duration: number;
  readonly title?: string;
}
