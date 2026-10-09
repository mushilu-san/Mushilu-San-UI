import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { Directionality, resolveDirection } from './direction';

function mount(html: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap);
  return wrap;
}

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('dir');
  document.body.removeAttribute('dir');
});

describe('resolveDirection', () => {
  it('H-B-61716a: dir on self', () => {
    const w = mount('<div id="x" dir="rtl"></div>');
    expect(resolveDirection(w.querySelector('#x'))).toBe('rtl');
  });

  it('dir on ancestor', () => {
    const w = mount('<div dir="rtl"><p><span id="x"></span></p></div>');
    expect(resolveDirection(w.querySelector('#x'))).toBe('rtl');
  });

  it('nested override wins', () => {
    const w = mount('<div dir="rtl"><div dir="ltr"><span id="x"></span></div></div>');
    expect(resolveDirection(w.querySelector('#x'))).toBe('ltr');
  });

  it('falls back to document dir', () => {
    document.documentElement.dir = 'rtl';
    const w = mount('<span id="x"></span>');
    expect(resolveDirection(w.querySelector('#x'))).toBe('rtl');
  });

  it('defaults to ltr with no dir anywhere', () => {
    const w = mount('<span id="x"></span>');
    expect(resolveDirection(w.querySelector('#x'))).toBe('ltr');
    expect(resolveDirection(null)).toBe('ltr');
  });

  it('ignores dir="auto" and continues upward', () => {
    const w = mount('<div dir="rtl"><div dir="auto"><span id="x"></span></div></div>');
    expect(resolveDirection(w.querySelector('#x'))).toBe('rtl');
  });

  it('auto with no other dir resolves to ltr', () => {
    const w = mount('<div dir="auto"><span id="x"></span></div>');
    expect(resolveDirection(w.querySelector('#x'))).toBe('ltr');
  });

  it('uses computed direction for CSS-driven rtl', () => {
    const w = mount('<div style="direction: rtl"><span id="x"></span></div>');
    expect(resolveDirection(w.querySelector('#x'))).toBe('rtl');
  });
});

describe('Directionality', () => {
  it('reads document dir and reacts to changes', async () => {
    document.documentElement.dir = 'rtl';
    const svc = TestBed.inject(Directionality);
    expect(svc.value()).toBe('rtl');
    document.documentElement.dir = 'ltr';
    await new Promise((r) => setTimeout(r));
    expect(svc.value()).toBe('ltr');
  });

  it('disconnects observer on destroy', () => {
    const svc = TestBed.inject(Directionality);
    svc.ngOnDestroy();
    document.documentElement.dir = 'rtl';
    expect(svc.value()).toBe('ltr');
  });
});
