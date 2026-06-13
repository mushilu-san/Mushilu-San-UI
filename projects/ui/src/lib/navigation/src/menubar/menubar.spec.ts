import { fireEvent } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Menubar } from './menubar';
import { MenubarMenu } from './menubar-menu';
import { MenubarTrigger } from './menubar-trigger';
import { MenubarContent } from './menubar-content';
import { MenubarItem } from './menubar-item';
import { MenubarSeparator } from './menubar-separator';

const IMPORTS = [
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
];

const BASIC = `
  <mui-menubar>
    <mui-menubar-menu>
      <button muiMenubarTrigger>File</button>
      <mui-menubar-content>
        <div muiMenubarItem>New</div>
        <div muiMenubarItem>Open</div>
        <mui-menubar-separator></mui-menubar-separator>
        <div muiMenubarItem [disabled]="true">Save</div>
      </mui-menubar-content>
    </mui-menubar-menu>
    <mui-menubar-menu>
      <button muiMenubarTrigger>Edit</button>
      <mui-menubar-content>
        <div muiMenubarItem>Cut</div>
        <div muiMenubarItem>Copy</div>
      </mui-menubar-content>
    </mui-menubar-menu>
  </mui-menubar>
`;

function getMenubar() {
  return document.querySelector('mui-menubar') as HTMLElement;
}

function getTriggers() {
  return Array.from(document.querySelectorAll('[muiMenubarTrigger]')) as HTMLButtonElement[];
}

function getContents() {
  return Array.from(document.querySelectorAll('mui-menubar-content')) as HTMLElement[];
}

function getItems() {
  return Array.from(document.querySelectorAll('[muiMenubarItem]')) as HTMLElement[];
}

describe('Menubar', () => {
  it('has role=menubar', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getMenubar()).toHaveAttribute('role', 'menubar');
  });

  it('has default aria-label', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getMenubar()).toHaveAttribute('aria-label', 'Menu bar');
  });

  it('custom label input', async () => {
    await renderTemplate(
      `<mui-menubar label="App menu"><mui-menubar-menu>
        <button muiMenubarTrigger>File</button>
        <mui-menubar-content></mui-menubar-content>
      </mui-menubar-menu></mui-menubar>`,
      { imports: IMPORTS },
    );
    expect(getMenubar()).toHaveAttribute('aria-label', 'App menu');
  });

  it('triggers have role=menuitem', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    getTriggers().forEach((t) => expect(t).toHaveAttribute('role', 'menuitem'));
  });

  it('triggers have aria-haspopup=menu', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    getTriggers().forEach((t) => expect(t).toHaveAttribute('aria-haspopup', 'menu'));
  });

  it('trigger aria-expanded is false by default', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getTriggers()[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking trigger opens its menu', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    expect(getContents()[0]).toHaveAttribute('data-open');
    expect(getTriggers()[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('clicking trigger again closes its menu', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const t = getTriggers()[0];
    fireEvent.click(t);
    fireEvent.click(t);
    expect(getContents()[0]).not.toHaveAttribute('data-open');
    expect(t).toHaveAttribute('aria-expanded', 'false');
  });

  it('opening second menu closes first', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    fireEvent.click(getTriggers()[1]);
    expect(getContents()[0]).not.toHaveAttribute('data-open');
    expect(getContents()[1]).toHaveAttribute('data-open');
  });

  it('content has role=menu', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    getContents().forEach((c) => expect(c).toHaveAttribute('role', 'menu'));
  });

  it('items have role=menuitem', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    const visibleItems = Array.from(
      document.querySelectorAll('mui-menubar-content[data-open] [muiMenubarItem]'),
    );
    visibleItems.forEach((i) => expect(i).toHaveAttribute('role', 'menuitem'));
  });

  it('disabled item has aria-disabled', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    const disabled = document.querySelector('[data-disabled]');
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
  });

  it('clicking item closes the menu', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    fireEvent.click(getItems()[0]);
    expect(getContents()[0]).not.toHaveAttribute('data-open');
  });

  it('Escape closes open menu', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    fireEvent.keyDown(getMenubar(), { key: 'Escape' });
    expect(getContents()[0]).not.toHaveAttribute('data-open');
  });

  it('ArrowRight moves focus to next trigger', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const [t1, t2] = getTriggers();
    t1.focus();
    fireEvent.keyDown(getMenubar(), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(t2);
  });

  it('ArrowLeft moves focus to previous trigger', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const [t1, t2] = getTriggers();
    t2.focus();
    fireEvent.keyDown(getMenubar(), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(t1);
  });

  it('ArrowDown on trigger opens menu', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const [t1] = getTriggers();
    t1.focus();
    fireEvent.keyDown(t1, { key: 'ArrowDown' });
    expect(getContents()[0]).toHaveAttribute('data-open');
  });

  it('clicking outside closes menu', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    fireEvent.click(document.body);
    expect(getContents()[0]).not.toHaveAttribute('data-open');
  });

  it('separator has role=separator', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    expect(document.querySelector('mui-menubar-separator')).toHaveAttribute('role', 'separator');
  });

  it('ArrowRight wraps from last to first trigger', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const [t1, t2] = getTriggers();
    t2.focus();
    fireEvent.keyDown(getMenubar(), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(t1);
  });

  it('ArrowDown inside open menu moves focus to next item', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    const content = getContents()[0];
    const visibleItems = Array.from(
      content.querySelectorAll('[muiMenubarItem]:not([aria-disabled="true"])'),
    ) as HTMLElement[];
    visibleItems[0].focus();
    fireEvent.keyDown(content, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(visibleItems[1]);
  });

  it('ArrowUp inside open menu moves focus to previous item', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    const content = getContents()[0];
    const visibleItems = Array.from(
      content.querySelectorAll('[muiMenubarItem]:not([aria-disabled="true"])'),
    ) as HTMLElement[];
    visibleItems[1].focus();
    fireEvent.keyDown(content, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(visibleItems[0]);
  });

  it('Home inside menu focuses first item', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    const content = getContents()[0];
    const visibleItems = Array.from(
      content.querySelectorAll('[muiMenubarItem]:not([aria-disabled="true"])'),
    ) as HTMLElement[];
    visibleItems[1].focus();
    fireEvent.keyDown(content, { key: 'Home' });
    expect(document.activeElement).toBe(visibleItems[0]);
  });

  it('End inside menu focuses last item', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    const content = getContents()[0];
    const visibleItems = Array.from(
      content.querySelectorAll('[muiMenubarItem]:not([aria-disabled="true"])'),
    ) as HTMLElement[];
    visibleItems[0].focus();
    fireEvent.keyDown(content, { key: 'End' });
    const last = visibleItems[visibleItems.length - 1];
    expect(document.activeElement).toBe(last);
  });

  it('ArrowDown wraps from last to first item', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getTriggers()[0]);
    const content = getContents()[0];
    const visibleItems = Array.from(
      content.querySelectorAll('[muiMenubarItem]:not([aria-disabled="true"])'),
    ) as HTMLElement[];
    visibleItems[visibleItems.length - 1].focus();
    fireEvent.keyDown(content, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(visibleItems[0]);
  });
});
