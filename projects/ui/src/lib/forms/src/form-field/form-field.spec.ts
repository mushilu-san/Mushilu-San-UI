import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Input } from '../input/input';
import { FormField } from './form-field';

describe('FormField', () => {
  it('renders a label when label input is set', async () => {
    await renderComponent(FormField, { inputs: { label: 'Email' } });
    expect(document.querySelector('label')?.textContent?.trim()).toContain('Email');
  });

  it('does not render a label when no label input', async () => {
    await renderComponent(FormField, {});
    expect(document.querySelector('label')).toBeFalsy();
  });

  it('shows required asterisk when required=true', async () => {
    await renderComponent(FormField, { inputs: { label: 'Email', required: true } });
    expect(document.querySelector('.required-mark')).toBeTruthy();
  });

  it('required mark is aria-hidden', async () => {
    await renderComponent(FormField, { inputs: { label: 'Email', required: true } });
    expect(document.querySelector('.required-mark')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders hint text when provided and no error', async () => {
    await renderComponent(FormField, {
      inputs: { label: 'Email', hint: 'We will never share your email.' },
    });
    expect(document.querySelector('.field-hint')?.textContent?.trim()).toBe(
      'We will never share your email.',
    );
  });

  it('hides hint when error is set', async () => {
    await renderComponent(FormField, { inputs: { hint: 'Hint', error: 'Required' } });
    expect(document.querySelector('.field-hint')).toBeFalsy();
  });

  it('renders error with role=alert when error is set', async () => {
    await renderComponent(FormField, { inputs: { error: 'This field is required' } });
    const err = document.querySelector('.field-error');
    expect(err?.textContent?.trim()).toBe('This field is required');
    expect(err).toHaveAttribute('role', 'alert');
  });

  it('sets data-invalid on host when error is set', async () => {
    await renderTemplate('<mui-form-field error="Required"></mui-form-field>', {
      imports: [FormField],
    });
    expect(document.querySelector('mui-form-field')).toHaveAttribute('data-invalid');
  });

  it('does not set data-invalid when no error', async () => {
    await renderTemplate('<mui-form-field></mui-form-field>', { imports: [FormField] });
    expect(document.querySelector('mui-form-field')).not.toHaveAttribute('data-invalid');
  });

  it('projects slotted content into the field-control', async () => {
    await renderTemplate(
      `<mui-form-field label="Email"><input muiInput id="email" aria-label="Email" /></mui-form-field>`,
      { imports: [FormField, Input] },
    );
    expect(document.querySelector('.field-control input')).toBeTruthy();
  });

  it('wires label for to controlId', async () => {
    await renderComponent(FormField, { inputs: { label: 'Email', controlId: 'email-input' } });
    expect(document.querySelector('label')).toHaveAttribute('for', 'email-input');
  });
});
