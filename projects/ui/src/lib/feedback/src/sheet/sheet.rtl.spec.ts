import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Sheet } from './sheet';

const dialog = () => document.querySelector('dialog') as HTMLDialogElement;

describe('Sheet logical sides', () => {
  it('H-A-fc2d84: accepts side="start" and exposes it on the panel', async () => {
    await renderTemplate(`<div dir="rtl"><mui-sheet [open]="true" side="start" /></div>`, {
      imports: [Sheet],
    });
    expect(dialog()).toHaveAttribute('data-side', 'start');
  });

  it('H-T-8dbb4c: accepts side="end" and exposes it on the panel', async () => {
    await renderTemplate(`<div dir="rtl"><mui-sheet [open]="true" side="end" /></div>`, {
      imports: [Sheet],
    });
    expect(dialog()).toHaveAttribute('data-side', 'end');
  });

  it('H-T-8dbb4c: physical left/right remain supported', async () => {
    await renderTemplate(`<mui-sheet [open]="true" side="left" />`, { imports: [Sheet] });
    expect(dialog()).toHaveAttribute('data-side', 'left');
  });
});
