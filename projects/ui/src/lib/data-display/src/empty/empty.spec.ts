import { screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Empty } from './empty';

describe('Empty', () => {
  it('renders title', async () => {
    await renderComponent(Empty, { inputs: { title: 'No results' } });
    expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
  });

  it('renders description', async () => {
    await renderComponent(Empty, { inputs: { description: 'Try a different search.' } });
    expect(screen.getByText('Try a different search.')).toBeInTheDocument();
  });

  it('does not render title element when title not provided', async () => {
    await renderComponent(Empty, { inputs: {} });
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('does not render description element when not provided', async () => {
    await renderComponent(Empty, { inputs: { title: 'Empty' } });
    expect(screen.queryByText('', { selector: 'p' })).not.toBeInTheDocument();
  });

  it('projects action slot content', async () => {
    await renderTemplate(
      `<mui-empty title="No items">
        <button slot="action">Add item</button>
       </mui-empty>`,
      { imports: [Empty] },
    );
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('projects icon slot content', async () => {
    await renderTemplate(
      `<mui-empty title="Empty">
        <span slot="icon" data-testid="custom-icon">★</span>
       </mui-empty>`,
      { imports: [Empty] },
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('has role=status', async () => {
    await renderComponent(Empty, { inputs: { title: 'Nothing here' } });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
