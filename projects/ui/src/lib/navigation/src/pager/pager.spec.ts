import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Pager } from './pager';
import { PagerLink } from './pager-link';

const imports = [Pager, PagerLink];

describe('Pager', () => {
  it('is a navigation landmark with a translatable label', async () => {
    await renderTemplate('<mui-pager label="Series"></mui-pager>', { imports });
    const host = document.querySelector('mui-pager')!;
    expect(host).toHaveAttribute('role', 'navigation');
    expect(host).toHaveAttribute('aria-label', 'Series');
  });

  it('defaults the label to Pagination', async () => {
    await renderTemplate('<mui-pager></mui-pager>', { imports });
    expect(document.querySelector('mui-pager')).toHaveAttribute('aria-label', 'Pagination');
  });
});

describe('PagerLink', () => {
  it('defaults rel to prev / next by direction', async () => {
    await renderTemplate(
      '<a muiPagerLink direction="previous" href="/a">A</a><a muiPagerLink href="/b">B</a>',
      { imports },
    );
    const [prev, next] = Array.from(document.querySelectorAll('a'));
    expect(prev).toHaveAttribute('rel', 'prev');
    expect(next).toHaveAttribute('rel', 'next');
  });

  it('rel input overrides the default', async () => {
    await renderTemplate('<a muiPagerLink rel="nofollow" href="/b">B</a>', { imports });
    expect(document.querySelector('a')).toHaveAttribute('rel', 'nofollow');
  });

  it('renders the direction label and projected title', async () => {
    await renderTemplate(
      '<a muiPagerLink directionLabel="Previous" direction="previous" href="/a">Part 1</a>',
      { imports },
    );
    const a = document.querySelector('a')!;
    expect(a.querySelector('.direction')?.textContent).toBe('Previous');
    expect(a.querySelector('.title')?.textContent).toContain('Part 1');
  });

  it('omits the direction label element when not set', async () => {
    await renderTemplate('<a muiPagerLink href="/a">Part</a>', { imports });
    expect(document.querySelector('a .direction')).toBeNull();
  });

  it('chevron is decorative', async () => {
    await renderTemplate('<a muiPagerLink href="/a">Part</a>', { imports });
    expect(document.querySelector('a svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('reflects direction as data-direction', async () => {
    await renderTemplate('<a muiPagerLink direction="previous" href="/a">Part</a>', { imports });
    expect(document.querySelector('a')).toHaveAttribute('data-direction', 'previous');
  });
});
