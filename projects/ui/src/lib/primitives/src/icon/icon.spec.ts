import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Icon } from './icon';

describe('Icon', () => {
  it('renders an svg element', async () => {
    await renderComponent(Icon, { inputs: { name: 'check' } });
    expect(document.querySelector('svg')).toBeTruthy();
  });

  it('defaults to md size (20px)', async () => {
    await renderComponent(Icon, { inputs: { name: 'check' } });
    const svg = document.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('renders xs size (12px)', async () => {
    await renderComponent(Icon, { inputs: { name: 'check', size: 'xs' } });
    const svg = document.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '12');
    expect(svg).toHaveAttribute('height', '12');
  });

  it('renders sm size (16px)', async () => {
    await renderComponent(Icon, { inputs: { name: 'check', size: 'sm' } });
    const svg = document.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });

  it('renders lg size (24px)', async () => {
    await renderComponent(Icon, { inputs: { name: 'check', size: 'lg' } });
    const svg = document.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('renders xl size (32px)', async () => {
    await renderComponent(Icon, { inputs: { name: 'check', size: 'xl' } });
    const svg = document.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('is aria-hidden by default (decorative)', async () => {
    await renderTemplate('<mui-icon name="check"></mui-icon>', { imports: [Icon] });
    expect(document.querySelector('mui-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('adds role="img" and aria-label when label is provided', async () => {
    await renderTemplate('<mui-icon name="check" label="Confirmed"></mui-icon>', {
      imports: [Icon],
    });
    const host = document.querySelector('mui-icon')!;
    expect(host).toHaveAttribute('role', 'img');
    expect(host).toHaveAttribute('aria-label', 'Confirmed');
    expect(host).not.toHaveAttribute('aria-hidden');
  });

  it('reflects name as data-name attribute', async () => {
    await renderTemplate('<mui-icon name="search"></mui-icon>', { imports: [Icon] });
    expect(document.querySelector('mui-icon')).toHaveAttribute('data-name', 'search');
  });

  it('reflects size as data-size attribute', async () => {
    await renderTemplate('<mui-icon name="check" size="lg"></mui-icon>', { imports: [Icon] });
    expect(document.querySelector('mui-icon')).toHaveAttribute('data-size', 'lg');
  });

  it('reflects color as data-color attribute', async () => {
    await renderTemplate('<mui-icon name="check" color="danger"></mui-icon>', { imports: [Icon] });
    expect(document.querySelector('mui-icon')).toHaveAttribute('data-color', 'danger');
  });

  it('renders one path for single-path icons', async () => {
    await renderComponent(Icon, { inputs: { name: 'check' } });
    expect(document.querySelectorAll('svg path')).toHaveLength(1);
  });

  it('renders two paths for multi-path icons', async () => {
    await renderComponent(Icon, { inputs: { name: 'eye' } });
    expect(document.querySelectorAll('svg path')).toHaveLength(2);
  });

  it('has a 0 0 24 24 viewBox', async () => {
    await renderComponent(Icon, { inputs: { name: 'check' } });
    expect(document.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders the loading icon', async () => {
    await renderComponent(Icon, { inputs: { name: 'loading' } });
    expect(document.querySelector('svg path')).toBeTruthy();
  });

  it('renders multi-path icons: settings has two paths', async () => {
    await renderComponent(Icon, { inputs: { name: 'settings' } });
    expect(document.querySelectorAll('svg path')).toHaveLength(2);
  });

  it('renders multi-path icons: map-pin has two paths', async () => {
    await renderComponent(Icon, { inputs: { name: 'map-pin' } });
    expect(document.querySelectorAll('svg path')).toHaveLength(2);
  });

  it('shows as accessible landmark when used as standalone icon button label', async () => {
    await renderTemplate('<mui-icon name="x" label="Close dialog"></mui-icon>', {
      imports: [Icon],
    });
    expect(screen.getByRole('img', { name: 'Close dialog' })).toBeInTheDocument();
  });
});
