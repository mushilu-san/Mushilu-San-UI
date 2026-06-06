import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Label } from './label';

describe('Label', () => {
  it('renders a label element', async () => {
    await renderComponent(Label, {});
    expect(document.querySelector('label')).toBeTruthy();
  });

  it('sets the for attribute on the inner label', async () => {
    await renderComponent(Label, { inputs: { for: 'my-input' } });
    expect(document.querySelector('label')).toHaveAttribute('for', 'my-input');
  });

  it('shows required asterisk when required=true', async () => {
    await renderComponent(Label, { inputs: { required: true } });
    expect(document.querySelector('.required-mark')).toBeTruthy();
  });

  it('hides required asterisk by default', async () => {
    await renderComponent(Label, {});
    expect(document.querySelector('.required-mark')).toBeFalsy();
  });

  it('required mark is aria-hidden', async () => {
    await renderComponent(Label, { inputs: { required: true } });
    expect(document.querySelector('.required-mark')).toHaveAttribute('aria-hidden', 'true');
  });

  it('sets data-required attribute on host', async () => {
    await renderTemplate('<mui-label required>Name</mui-label>', { imports: [Label] });
    expect(document.querySelector('mui-label')).toHaveAttribute('data-required');
  });

  it('sets data-disabled attribute on host', async () => {
    await renderTemplate('<mui-label disabled>Name</mui-label>', { imports: [Label] });
    expect(document.querySelector('mui-label')).toHaveAttribute('data-disabled');
  });

  it('does not set data-disabled by default', async () => {
    await renderTemplate('<mui-label>Name</mui-label>', { imports: [Label] });
    expect(document.querySelector('mui-label')).not.toHaveAttribute('data-disabled');
  });
});
