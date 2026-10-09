import { fireEvent } from '@testing-library/angular';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { SwipeAction } from './swipe-action';
import type { SwipeActionItem } from './swipe-action.types';

const start: SwipeActionItem[] = [{ key: 's', label: 'Star', side: 'start' }];
const end: SwipeActionItem[] = [{ key: 'd', label: 'Delete', side: 'end' }];

const tpl = (dir: string) => `
  <div dir="${dir}">
    <mui-swipe-action [actions]="actions"><span>Row</span></mui-swipe-action>
  </div>`;

const host = () => document.querySelector('mui-swipe-action') as HTMLElement;
const track = () => document.querySelector('.mui-swipe-action__track') as HTMLElement;

function touch(type: 'touchstart' | 'touchmove', x: number) {
  fireEvent(
    host(),
    Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
      touches: [{ clientX: x }],
    }),
  );
}

afterEach(() => vi.restoreAllMocks());

async function swipe(dir: string, actions: SwipeActionItem[], dx: number) {
  // jsdom has no layout: give rails a width so settle logic can snap.
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(80);
  const r = await renderTemplate(tpl(dir), {
    imports: [SwipeAction],
    componentProperties: { actions },
  });
  touch('touchstart', 200);
  touch('touchmove', 200 + dx);
  fireEvent(host(), new Event('touchend', { bubbles: true }));
  r.detectChanges();
  return host().getAttribute('data-revealed');
}

describe('SwipeAction RTL', () => {
  it('H-A-94fd28: start rail uses logical class, end rail likewise', async () => {
    await renderTemplate(tpl('rtl'), {
      imports: [SwipeAction],
      componentProperties: { actions: [...start, ...end] },
    });
    expect(document.querySelector('.mui-swipe-action__rail--start')).toBeTruthy();
    expect(document.querySelector('.mui-swipe-action__rail--end')).toBeTruthy();
  });

  it('H-B-3ea4ec: end action under ltr reveals on swipe left', async () => {
    expect(await swipe('ltr', end, -100)).toBe('right');
  });

  it('H-B-3ea4ec: end action under rtl reveals on swipe right', async () => {
    expect(await swipe('rtl', end, 100)).toBe('left');
  });

  it('H-B-3ea4ec: end action under rtl does not reveal on swipe left', async () => {
    expect(await swipe('rtl', end, -100)).toBeNull();
  });

  it('H-T-3c27cd / H-T-16f03f: start action under rtl reveals on swipe left', async () => {
    expect(await swipe('rtl', start, -100)).toBe('right');
  });

  it('H-T-3c27cd: start action under ltr reveals on swipe right', async () => {
    expect(await swipe('ltr', start, 100)).toBe('left');
  });

  it('H-B-3ea4ec: physical sides keep their meaning under rtl', async () => {
    const left: SwipeActionItem[] = [{ key: 'l', label: 'L', side: 'left' }];
    expect(await swipe('rtl', left, 100)).toBe('left');
  });

  it('H-U-445259: keyboard reveal of end action under rtl translates positive', async () => {
    const r = await renderTemplate(tpl('rtl'), {
      imports: [SwipeAction],
      componentProperties: { actions: end },
    });
    (document.querySelector('.mui-swipe-action__kbd-trigger') as HTMLElement).click();
    r.detectChanges();
    expect(host().getAttribute('data-revealed')).toBe('left');
    expect(track().style.transform).toMatch(/translateX\([0-9.]+px\)/);
  });
});
