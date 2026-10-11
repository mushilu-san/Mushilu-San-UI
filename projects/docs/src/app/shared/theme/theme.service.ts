import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';

/** Must match the key read by the inline bootstrap script in index.html. */
const STORAGE_KEY = 'docs-theme';
const ORDER: readonly ThemePreference[] = ['system', 'light', 'dark'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly pref = signal<ThemePreference>(this.read());
  readonly preference = this.pref.asReadonly();

  constructor() {
    effect(() => this.apply(this.pref()));
  }

  set(preference: ThemePreference): void {
    this.pref.set(preference);
    this.write(preference);
  }

  cycle(): void {
    const next = ORDER[(ORDER.indexOf(this.pref()) + 1) % ORDER.length];
    if (next) this.set(next);
  }

  private storage(): Storage | null {
    try {
      return this.document.defaultView?.localStorage ?? null;
    } catch {
      return null;
    }
  }

  private read(): ThemePreference {
    try {
      const value = this.storage()?.getItem(STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : 'system';
    } catch {
      return 'system';
    }
  }

  private write(preference: ThemePreference): void {
    try {
      const storage = this.storage();
      if (!storage) return;
      if (preference === 'system') storage.removeItem(STORAGE_KEY);
      else storage.setItem(STORAGE_KEY, preference);
    } catch {
      // Storage blocked (private mode, sandbox) — the choice lasts for this page view only.
    }
  }

  private apply(preference: ThemePreference): void {
    const root = this.document.documentElement;
    if (preference === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', preference);
  }
}
