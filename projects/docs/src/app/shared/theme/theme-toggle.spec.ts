import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  beforeEach(() => localStorage.clear());

  it('announces the current theme and the next one, and cycles on click', async () => {
    await render(ThemeToggle);
    const button = screen.getByRole('button', { name: 'Theme: system. Switch to light' });
    await userEvent.click(button);
    expect(
      screen.getByRole('button', { name: 'Theme: light. Switch to dark' }),
    ).toBeInTheDocument();
  });
});
