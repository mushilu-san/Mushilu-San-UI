import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Divider } from './divider';

describe('Divider', () => {
  it('has role="separator"', async () => {
    await renderTemplate('<mui-divider></mui-divider>', { imports: [Divider] });
    expect(document.querySelector('mui-divider')).toHaveAttribute('role', 'separator');
  });

  it('is discoverable by role', async () => {
    await renderTemplate('<mui-divider></mui-divider>', { imports: [Divider] });
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('defaults to horizontal orientation', async () => {
    await renderTemplate('<mui-divider></mui-divider>', { imports: [Divider] });
    expect(document.querySelector('mui-divider')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('sets vertical aria-orientation', async () => {
    await renderTemplate('<mui-divider orientation="vertical"></mui-divider>', { imports: [Divider] });
    expect(document.querySelector('mui-divider')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('sets data-orientation attribute', async () => {
    await renderTemplate('<mui-divider orientation="vertical"></mui-divider>', { imports: [Divider] });
    expect(document.querySelector('mui-divider')).toHaveAttribute('data-orientation', 'vertical');
  });

  it('defaults to solid variant', async () => {
    await renderTemplate('<mui-divider></mui-divider>', { imports: [Divider] });
    expect(document.querySelector('mui-divider')).toHaveAttribute('data-variant', 'solid');
  });

  it('sets data-variant attribute', async () => {
    await renderTemplate('<mui-divider variant="dashed"></mui-divider>', { imports: [Divider] });
    expect(document.querySelector('mui-divider')).toHaveAttribute('data-variant', 'dashed');
  });

  it('renders one line when no label', async () => {
    await renderComponent(Divider, {});
    expect(document.querySelectorAll('.line')).toHaveLength(1);
  });

  it('renders two lines and a label element when label is provided', async () => {
    await renderComponent(Divider, { inputs: { label: 'or' } });
    expect(document.querySelectorAll('.line')).toHaveLength(2);
    expect(document.querySelector('.label')).toBeTruthy();
  });

  it('displays label text', async () => {
    await renderComponent(Divider, { inputs: { label: 'Section' } });
    expect(document.querySelector('.label')?.textContent?.trim()).toBe('Section');
  });

  it('sets aria-label on host when label is provided', async () => {
    await renderTemplate('<mui-divider label="or"></mui-divider>', { imports: [Divider] });
    expect(document.querySelector('mui-divider')).toHaveAttribute('aria-label', 'or');
  });

  it('does not set aria-label when no label', async () => {
    await renderTemplate('<mui-divider></mui-divider>', { imports: [Divider] });
    expect(document.querySelector('mui-divider')).not.toHaveAttribute('aria-label');
  });

  it('inner elements are aria-hidden', async () => {
    await renderComponent(Divider, { inputs: { label: 'or' } });
    const children = document.querySelectorAll('mui-divider > *');
    children.forEach(el => expect(el).toHaveAttribute('aria-hidden', 'true'));
  });
});
