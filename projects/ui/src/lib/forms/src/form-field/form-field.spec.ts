import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Checkbox } from '../checkbox/checkbox';
import { Input } from '../input/input';
import { Select } from '../select/select';
import { Textarea } from '../textarea/textarea';
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

  describe('H-A-b4b75e: aria-describedby wiring', () => {
    it('links the projected input to the hint', async () => {
      await renderTemplate(
        `<mui-form-field hint="Use 3-20 chars"><input muiInput aria-label="User" /></mui-form-field>`,
        { imports: [FormField, Input] },
      );
      const hint = document.querySelector('.field-hint') as HTMLElement;
      expect(hint.id).toBeTruthy();
      expect(document.querySelector('input')).toHaveAttribute('aria-describedby', hint.id);
    });

    it('links the projected input to the error instead of the hint', async () => {
      await renderTemplate(
        `<mui-form-field hint="Hint" error="Required"><input muiInput aria-label="User" /></mui-form-field>`,
        { imports: [FormField, Input] },
      );
      const err = document.querySelector('.field-error') as HTMLElement;
      expect(document.querySelector('input')).toHaveAttribute('aria-describedby', err.id);
    });

    it('sets no aria-describedby when there is no hint or error', async () => {
      await renderTemplate(
        `<mui-form-field label="User"><input muiInput aria-label="User" /></mui-form-field>`,
        { imports: [FormField, Input] },
      );
      expect(document.querySelector('input')).not.toHaveAttribute('aria-describedby');
    });

    it('keeps ids the consumer set and updates when the error appears and goes', async () => {
      const { fixture } = await renderTemplate(
        `<mui-form-field hint="Hint" [error]="err"><input muiInput aria-label="User" aria-describedby="extra" /></mui-form-field>`,
        { imports: [FormField, Input], componentProperties: { err: '' } },
      );
      const input = document.querySelector('input') as HTMLInputElement;
      const hintId = (document.querySelector('.field-hint') as HTMLElement).id;
      expect(input.getAttribute('aria-describedby')).toBe(`extra ${hintId}`);

      (fixture.componentInstance as { err: string }).err = 'Bad';
      fixture.detectChanges();
      await fixture.whenStable();
      const errId = (document.querySelector('.field-error') as HTMLElement).id;
      expect(input.getAttribute('aria-describedby')).toBe(`extra ${errId}`);

      (fixture.componentInstance as { err: string }).err = '';
      fixture.detectChanges();
      await fixture.whenStable();
      expect(input.getAttribute('aria-describedby')).toBe(`extra ${hintId}`);
    });

    it('links select, textarea and checkbox too', async () => {
      await renderTemplate(
        `<mui-form-field hint="H1"><select muiSelect aria-label="S"></select></mui-form-field>
         <mui-form-field hint="H2"><textarea muiTextarea aria-label="T"></textarea></mui-form-field>
         <mui-form-field hint="H3"><input type="checkbox" muiCheckbox aria-label="C" /></mui-form-field>`,
        { imports: [FormField, Select, Textarea, Checkbox] },
      );
      for (const sel of ['select', 'textarea', 'input']) {
        const control = document.querySelector(sel) as HTMLElement;
        const hint = control.closest('mui-form-field')?.querySelector('.field-hint') as HTMLElement;
        expect(control).toHaveAttribute('aria-describedby', hint.id);
      }
    });

    it('leaves a control outside a form field untouched', async () => {
      await renderTemplate('<input muiInput aria-describedby="mine" />', { imports: [Input] });
      expect(document.querySelector('input')).toHaveAttribute('aria-describedby', 'mine');
    });
  });
});
