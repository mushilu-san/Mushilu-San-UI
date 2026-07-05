import { DOCUMENT } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { renderComponent, renderTemplate } from './render';

@Component({
  selector: 'mui-test-render-probe',
  template: '',
})
class TestRenderProbe {}

describe('renderComponent theme option', () => {
  it('sets data-theme on documentElement', async () => {
    await renderComponent(TestRenderProbe, { theme: 'dark' });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('H-S-a000a7: resolves the document via TestBed.inject(DOCUMENT), not the raw global', async () => {
    const injectSpy = vi.spyOn(TestBed, 'inject');
    await renderComponent(TestRenderProbe, { theme: 'dark' });
    expect(injectSpy).toHaveBeenCalledWith(DOCUMENT);
    injectSpy.mockRestore();
  });
});

describe('renderTemplate theme option', () => {
  it('sets data-theme on documentElement', async () => {
    await renderTemplate('<mui-test-render-probe></mui-test-render-probe>', {
      imports: [TestRenderProbe],
      theme: 'light',
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('H-S-a000a7: resolves the document via TestBed.inject(DOCUMENT), not the raw global', async () => {
    const injectSpy = vi.spyOn(TestBed, 'inject');
    await renderTemplate('<mui-test-render-probe></mui-test-render-probe>', {
      imports: [TestRenderProbe],
      theme: 'light',
    });
    expect(injectSpy).toHaveBeenCalledWith(DOCUMENT);
    injectSpy.mockRestore();
  });
});
