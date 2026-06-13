import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders with default variant and size', async () => {
    await renderComponent(Badge, { inputs: {} });
    expect(document.querySelector('svg')).toBeFalsy();
  });

  it('projects text content', async () => {
    await renderTemplate('<mui-badge>Active</mui-badge>', { imports: [Badge] });
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('reflects variant as data-variant attribute', async () => {
    await renderTemplate('<mui-badge variant="success">Done</mui-badge>', { imports: [Badge] });
    expect(document.querySelector('mui-badge')).toHaveAttribute('data-variant', 'success');
  });

  it('reflects size as data-size attribute', async () => {
    await renderTemplate('<mui-badge size="lg">Big</mui-badge>', { imports: [Badge] });
    expect(document.querySelector('mui-badge')).toHaveAttribute('data-size', 'lg');
  });

  it('sets data-dot attribute when dot is true', async () => {
    await renderTemplate('<mui-badge dot variant="danger"></mui-badge>', { imports: [Badge] });
    expect(document.querySelector('mui-badge')).toHaveAttribute('data-dot');
  });

  it('does not render ng-content in dot mode', async () => {
    await renderTemplate('<mui-badge dot>Should not show</mui-badge>', { imports: [Badge] });
    expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
  });

  it('sets aria-label on dot badge when label is provided', async () => {
    await renderTemplate('<mui-badge dot label="3 alerts" variant="danger"></mui-badge>', {
      imports: [Badge],
    });
    expect(document.querySelector('mui-badge')).toHaveAttribute('aria-label', '3 alerts');
  });

  it('sets aria-hidden on dot badge without label', async () => {
    await renderTemplate('<mui-badge dot variant="danger"></mui-badge>', { imports: [Badge] });
    expect(document.querySelector('mui-badge')).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not set aria-hidden when label is provided', async () => {
    await renderTemplate('<mui-badge dot label="New" variant="primary"></mui-badge>', {
      imports: [Badge],
    });
    expect(document.querySelector('mui-badge')).not.toHaveAttribute('aria-hidden');
  });

  it('does not set aria-hidden on normal badge', async () => {
    await renderTemplate('<mui-badge variant="success">Active</mui-badge>', { imports: [Badge] });
    expect(document.querySelector('mui-badge')).not.toHaveAttribute('aria-hidden');
  });

  it('renders danger variant', async () => {
    await renderTemplate('<mui-badge variant="danger">Error</mui-badge>', { imports: [Badge] });
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(document.querySelector('mui-badge')).toHaveAttribute('data-variant', 'danger');
  });

  it('renders warning variant', async () => {
    await renderTemplate('<mui-badge variant="warning">Warn</mui-badge>', { imports: [Badge] });
    expect(document.querySelector('mui-badge')).toHaveAttribute('data-variant', 'warning');
  });

  it('renders info variant', async () => {
    await renderTemplate('<mui-badge variant="info">Info</mui-badge>', { imports: [Badge] });
    expect(document.querySelector('mui-badge')).toHaveAttribute('data-variant', 'info');
  });

  it('renders primary variant', async () => {
    await renderTemplate('<mui-badge variant="primary">New</mui-badge>', { imports: [Badge] });
    expect(document.querySelector('mui-badge')).toHaveAttribute('data-variant', 'primary');
  });

  it('renders sm size', async () => {
    await renderTemplate('<mui-badge size="sm">Small</mui-badge>', { imports: [Badge] });
    expect(document.querySelector('mui-badge')).toHaveAttribute('data-size', 'sm');
  });
});
