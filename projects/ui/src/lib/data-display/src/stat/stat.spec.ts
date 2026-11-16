import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Stat } from './stat';
import { Stats } from './stats';

describe('Stat', () => {
  it('renders the value and label', async () => {
    await renderTemplate('<mui-stat value="1,200" label="Readers" />', { imports: [Stat] });
    const host = document.querySelector('mui-stat')!;
    expect(host.querySelector('.value')?.textContent).toBe('1,200');
    expect(host.querySelector('.label')?.textContent).toBe('Readers');
  });

  it('accepts a numeric value', async () => {
    await renderTemplate('<mui-stat [value]="48" label="Articles" />', { imports: [Stat] });
    expect(document.querySelector('mui-stat .value')?.textContent).toBe('48');
  });

  it('has listitem role', async () => {
    await renderTemplate('<mui-stat value="1" label="A" />', { imports: [Stat] });
    expect(document.querySelector('mui-stat')).toHaveAttribute('role', 'listitem');
  });

  it('exposes root, value and label parts', async () => {
    await renderTemplate('<mui-stat value="1" label="A" />', { imports: [Stat] });
    const host = document.querySelector('mui-stat')!;
    expect(host).toHaveAttribute('part', 'root');
    expect(host.querySelector('[part="value"]')).not.toBeNull();
    expect(host.querySelector('[part="label"]')).not.toBeNull();
  });
});

describe('Stats', () => {
  it('has list role and contains its stats', async () => {
    await renderTemplate(
      '<mui-stats aria-label="Totals"><mui-stat value="1" label="A" /><mui-stat value="2" label="B" /></mui-stats>',
      { imports: [Stats, Stat] },
    );
    const list = document.querySelector('mui-stats')!;
    expect(list).toHaveAttribute('role', 'list');
    expect(list.querySelectorAll('[role="listitem"]').length).toBe(2);
  });
});
