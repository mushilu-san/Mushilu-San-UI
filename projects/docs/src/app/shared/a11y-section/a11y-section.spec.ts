import { provideRouter } from '@angular/router';
import { render, screen, within } from '@testing-library/angular';
import { A11ySection } from './a11y-section';
import { parseKeys } from './parse-keys';

describe('parseKeys', () => {
  it('splits alternatives and combinations', () => {
    expect(parseKeys('Shift+Tab / Tab')).toEqual([['Shift', 'Tab'], ['Tab']]);
    expect(parseKeys('Enter')).toEqual([['Enter']]);
  });
});

describe('A11ySection', () => {
  const a11y = {
    roles: [{ element: 'mui-tab', role: 'tab', notes: 'Has `aria-selected`.' }],
    keyboard: [{ keys: 'ArrowLeft / ArrowRight', action: 'Moves focus.' }],
    notes: ['Uses a roving tabindex.'],
  };

  it('renders roles, keyboard and notes', async () => {
    await render(A11ySection, { inputs: { a11y }, providers: [provideRouter([])] });
    const roles = screen.getByRole('table', { name: 'ARIA roles and attributes' });
    expect(within(roles).getByText('tab')).toBeInTheDocument();
    expect(within(roles).getByText('aria-selected').tagName).toBe('CODE');
    const keys = screen.getByRole('table', { name: 'Keyboard interactions' });
    expect(within(keys).getByText('ArrowLeft').tagName).toBe('KBD');
    expect(within(keys).getByText('ArrowRight').tagName).toBe('KBD');
    expect(screen.getByText('Uses a roving tabindex.')).toBeInTheDocument();
  });

  it('omits empty tables', async () => {
    await render(A11ySection, {
      inputs: { a11y: { roles: [], keyboard: [], notes: ['Only notes.'] } },
      providers: [provideRouter([])],
    });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
