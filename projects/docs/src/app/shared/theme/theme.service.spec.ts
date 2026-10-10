import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  const root = () => TestBed.inject(DOCUMENT).documentElement;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });
  afterEach(() => vi.restoreAllMocks());

  it('defaults to system and leaves data-theme unset', () => {
    const svc = TestBed.inject(ThemeService);
    TestBed.tick();
    expect(svc.preference()).toBe('system');
    expect(root()).not.toHaveAttribute('data-theme');
  });

  it('restores a stored preference', () => {
    localStorage.setItem('docs-theme', 'dark');
    const svc = TestBed.inject(ThemeService);
    TestBed.tick();
    expect(svc.preference()).toBe('dark');
    expect(root()).toHaveAttribute('data-theme', 'dark');
  });

  it('cycles system → light → dark → system and persists', () => {
    const svc = TestBed.inject(ThemeService);
    svc.cycle();
    TestBed.tick();
    expect(root()).toHaveAttribute('data-theme', 'light');
    expect(localStorage.getItem('docs-theme')).toBe('light');
    svc.cycle();
    TestBed.tick();
    expect(root()).toHaveAttribute('data-theme', 'dark');
    svc.cycle();
    TestBed.tick();
    expect(root()).not.toHaveAttribute('data-theme');
    expect(localStorage.getItem('docs-theme')).toBeNull();
  });

  it('keeps working when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const svc = TestBed.inject(ThemeService);
    expect(svc.preference()).toBe('system');
    expect(() => svc.set('dark')).not.toThrow();
    TestBed.tick();
    expect(root()).toHaveAttribute('data-theme', 'dark');
  });
});
