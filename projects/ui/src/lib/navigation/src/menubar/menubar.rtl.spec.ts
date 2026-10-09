import { fireEvent } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Menubar } from './menubar';
import { MenubarMenu } from './menubar-menu';
import { MenubarTrigger } from './menubar-trigger';
import { MenubarContent } from './menubar-content';
import { MenubarItem } from './menubar-item';

const IMPORTS = [Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem];

const tpl = (dir: string) => `
  <div dir="${dir}">
  <mui-menubar>
    <mui-menubar-menu>
      <button muiMenubarTrigger>File</button>
      <mui-menubar-content><div muiMenubarItem>New</div><div muiMenubarItem>Open</div></mui-menubar-content>
    </mui-menubar-menu>
    <mui-menubar-menu>
      <button muiMenubarTrigger>Edit</button>
      <mui-menubar-content><div muiMenubarItem>Cut</div></mui-menubar-content>
    </mui-menubar-menu>
  </mui-menubar></div>`;

const bar = () => document.querySelector('mui-menubar') as HTMLElement;
const triggers = () =>
  Array.from(document.querySelectorAll('[muiMenubarTrigger]')) as HTMLButtonElement[];

describe('Menubar RTL', () => {
  it('H-B-61716a: ArrowRight moves to previous trigger in dir=rtl', async () => {
    await renderTemplate(tpl('rtl'), { imports: IMPORTS });
    const [t1, t2] = triggers();
    t2.focus();
    fireEvent.keyDown(bar(), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(t1);
  });

  it('H-B-61716a: ArrowLeft moves to next trigger in dir=rtl', async () => {
    await renderTemplate(tpl('rtl'), { imports: IMPORTS });
    const [t1, t2] = triggers();
    t1.focus();
    fireEvent.keyDown(bar(), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(t2);
  });

  it('H-B-61716a: ArrowRight moves to next trigger in dir=ltr', async () => {
    await renderTemplate(tpl('ltr'), { imports: IMPORTS });
    const [t1, t2] = triggers();
    t1.focus();
    fireEvent.keyDown(bar(), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(t2);
  });
});
