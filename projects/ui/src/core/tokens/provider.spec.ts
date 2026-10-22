import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MUSHILU_UI_CONFIG, provideMushiluUi } from './provider';

describe('provideMushiluUi', () => {
  it('H-U-bc1c03: token has an empty-config default without a provider', () => {
    TestBed.configureTestingModule({});
    expect(TestBed.inject(MUSHILU_UI_CONFIG)).toEqual({});
  });

  it('H-U-bc1c03: provideMushiluUi() provides an empty config by default', () => {
    TestBed.configureTestingModule({ providers: [provideMushiluUi()] });
    expect(TestBed.inject(MUSHILU_UI_CONFIG)).toEqual({});
  });

  it('H-D-c3eb0a: does not expose the removed idPrefix option', () => {
    TestBed.configureTestingModule({ providers: [provideMushiluUi()] });
    expect(TestBed.inject(MUSHILU_UI_CONFIG)).not.toHaveProperty('idPrefix');
  });

  it('H-U-bc1c03: copies the passed config rather than sharing the reference', () => {
    const config = {};
    TestBed.configureTestingModule({ providers: [provideMushiluUi(config)] });
    expect(TestBed.inject(MUSHILU_UI_CONFIG)).not.toBe(config);
  });

  it('H-U-bc1c03: explicit undefined falls back to the default config', () => {
    TestBed.configureTestingModule({ providers: [provideMushiluUi(undefined)] });
    expect(TestBed.inject(MUSHILU_UI_CONFIG)).toEqual({});
  });
});
