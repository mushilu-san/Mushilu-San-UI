import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Input } from '../input/input';
import { InputGroup } from './input-group';
import { InputGroupAddon } from './input-group-addon';

describe('InputGroup', () => {
  it('renders with an inner input', async () => {
    await renderTemplate(
      `<mui-input-group><input muiInput aria-label="Amount" /></mui-input-group>`,
      { imports: [InputGroup, Input] },
    );
    expect(screen.getByRole('textbox', { name: 'Amount' })).toBeInTheDocument();
  });

  it('marks inner input with data-in-group', async () => {
    await renderTemplate(
      `<mui-input-group><input muiInput aria-label="test" /></mui-input-group>`,
      { imports: [InputGroup, Input] },
    );
    expect(screen.getByRole('textbox', { name: 'test' })).toHaveAttribute('data-in-group');
  });

  it('propagates invalid to inner input', async () => {
    await renderTemplate(
      `<mui-input-group invalid><input muiInput aria-label="test" /></mui-input-group>`,
      { imports: [InputGroup, Input] },
    );
    expect(screen.getByRole('textbox', { name: 'test' })).toHaveAttribute('data-invalid');
  });

  it('does not set data-invalid on group or input by default', async () => {
    await renderTemplate(
      `<mui-input-group><input muiInput aria-label="test" /></mui-input-group>`,
      { imports: [InputGroup, Input] },
    );
    expect(document.querySelector('mui-input-group')).not.toHaveAttribute('data-invalid');
    expect(screen.getByRole('textbox', { name: 'test' })).not.toHaveAttribute('data-invalid');
  });

  it('sets data-size on host', async () => {
    await renderTemplate(
      `<mui-input-group size="lg"><input muiInput aria-label="test" /></mui-input-group>`,
      { imports: [InputGroup, Input] },
    );
    expect(document.querySelector('mui-input-group')).toHaveAttribute('data-size', 'lg');
  });

  it('defaults to md size', async () => {
    await renderTemplate(
      `<mui-input-group><input muiInput aria-label="test" /></mui-input-group>`,
      { imports: [InputGroup, Input] },
    );
    expect(document.querySelector('mui-input-group')).toHaveAttribute('data-size', 'md');
  });

  it('renders start and end addons', async () => {
    await renderTemplate(
      `<mui-input-group>
        <mui-input-group-addon>$</mui-input-group-addon>
        <input muiInput aria-label="Amount" />
        <mui-input-group-addon>.00</mui-input-group-addon>
      </mui-input-group>`,
      { imports: [InputGroup, InputGroupAddon, Input] },
    );
    expect(document.querySelectorAll('mui-input-group-addon').length).toBe(2);
  });

  it('addon has part="addon"', async () => {
    await renderTemplate(
      `<mui-input-group><mui-input-group-addon>$</mui-input-group-addon><input muiInput aria-label="test" /></mui-input-group>`,
      { imports: [InputGroup, InputGroupAddon, Input] },
    );
    expect(document.querySelector('mui-input-group-addon')).toHaveAttribute('part', 'addon');
  });

  it('standalone input has no data-in-group', async () => {
    await renderTemplate(`<input muiInput aria-label="standalone" />`, { imports: [Input] });
    expect(screen.getByRole('textbox', { name: 'standalone' })).not.toHaveAttribute(
      'data-in-group',
    );
  });

  it('input invalid input still shows invalid when group is not invalid', async () => {
    await renderTemplate(
      `<mui-input-group><input muiInput invalid aria-label="test" /></mui-input-group>`,
      { imports: [InputGroup, Input] },
    );
    expect(screen.getByRole('textbox', { name: 'test' })).toHaveAttribute('data-invalid');
  });
});
