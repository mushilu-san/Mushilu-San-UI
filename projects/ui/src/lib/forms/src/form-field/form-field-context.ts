import { ElementRef, InjectionToken, effect, inject, type Signal } from '@angular/core';

/** What a `mui-form-field` shares with the controls projected into it. */
export interface FormFieldContext {
  /** Id of the visible hint or error text, or `null` when neither is shown. */
  readonly describedBy: Signal<string | null>;
}

export const FORM_FIELD_CONTEXT = new InjectionToken<FormFieldContext>('FORM_FIELD_CONTEXT');

/**
 * Adds the surrounding form field's hint/error id to the host's `aria-describedby`.
 * Ids the consumer set themselves are kept. No-op outside a `mui-form-field`.
 * Call from a constructor (needs an injection context).
 */
export function linkFieldDescription(): void {
  const ctx = inject(FORM_FIELD_CONTEXT, { optional: true });
  if (!ctx) return;
  const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  let added: string | null = null;
  effect(() => {
    const id = ctx.describedBy();
    const ids = (host.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter((t) => t && t !== added);
    added = id;
    if (id) ids.push(id);
    if (ids.length) host.setAttribute('aria-describedby', ids.join(' '));
    else host.removeAttribute('aria-describedby');
  });
}
