import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { InputGroupAddon } from './input-group-addon';

describe('InputGroupAddon', () => {
  it('renders projected content', async () => {
    await renderTemplate('<mui-input-group-addon>$</mui-input-group-addon>', {
      imports: [InputGroupAddon],
    });
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('has part="addon" without requiring a parent InputGroup', async () => {
    await renderTemplate('<mui-input-group-addon>.00</mui-input-group-addon>', {
      imports: [InputGroupAddon],
    });
    expect(document.querySelector('mui-input-group-addon')).toHaveAttribute('part', 'addon');
  });

  it('renders standalone with no parent mui-input-group present', async () => {
    await renderTemplate('<mui-input-group-addon>@</mui-input-group-addon>', {
      imports: [InputGroupAddon],
    });
    expect(document.querySelector('mui-input-group')).not.toBeInTheDocument();
    expect(document.querySelector('mui-input-group-addon')).toBeInTheDocument();
  });
});
