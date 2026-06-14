import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('starts with no toasts', () => {
    expect(service.toasts().length).toBe(0);
  });

  it('show() adds a toast and returns its ref', () => {
    const ref = service.show('Hello');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0]).toBe(ref);
    expect(ref.message).toBe('Hello');
    expect(ref.variant).toBe('info');
    expect(ref.duration).toBe(5000);
  });

  it('show() assigns incrementing unique ids', () => {
    const a = service.show('A');
    const b = service.show('B');
    const c = service.show('C');
    expect(b.id).toBe(a.id + 1);
    expect(c.id).toBe(b.id + 1);
  });

  it('show() respects custom options', () => {
    const ref = service.show('Msg', { variant: 'danger', duration: 0, title: 'Oops' });
    expect(ref.variant).toBe('danger');
    expect(ref.duration).toBe(0);
    expect(ref.title).toBe('Oops');
  });

  it('toasts appear oldest-first', () => {
    service.show('first');
    service.show('second');
    const [a, b] = service.toasts();
    expect(a.message).toBe('first');
    expect(b.message).toBe('second');
  });

  it('info() sets variant to info', () => {
    const ref = service.info('msg');
    expect(ref.variant).toBe('info');
  });

  it('success() sets variant to success', () => {
    const ref = service.success('msg');
    expect(ref.variant).toBe('success');
  });

  it('warning() sets variant to warning', () => {
    const ref = service.warning('msg');
    expect(ref.variant).toBe('warning');
  });

  it('danger() sets variant to danger', () => {
    const ref = service.danger('msg');
    expect(ref.variant).toBe('danger');
  });

  it('variant helpers pass through options', () => {
    const ref = service.success('ok', { duration: 0, title: 'Done' });
    expect(ref.duration).toBe(0);
    expect(ref.title).toBe('Done');
    expect(ref.variant).toBe('success');
  });

  it('dismiss() removes only the matching toast', () => {
    const a = service.show('A');
    const b = service.show('B');
    service.dismiss(a.id);
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0]).toBe(b);
  });

  it('dismiss() of unknown id is a no-op', () => {
    service.show('A');
    expect(() => service.dismiss(9999)).not.toThrow();
    expect(service.toasts().length).toBe(1);
  });

  it('clear() empties all toasts', () => {
    service.show('A');
    service.show('B');
    service.clear();
    expect(service.toasts().length).toBe(0);
  });

  it('toasts signal is read-only (no .set on the public signal)', () => {
    expect(typeof (service.toasts as unknown as { set?: unknown }).set).toBe('undefined');
  });
});
