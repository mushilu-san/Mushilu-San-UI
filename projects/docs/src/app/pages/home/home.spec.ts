import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { provideMushiluUi } from '@mushilu-san/ui';
import { Home } from './home';

describe('Home', () => {
  it('renders the hero, primary calls to action and the group grid', async () => {
    await render(Home, { providers: [provideRouter([]), provideMushiluUi()] });
    expect(screen.getByRole('heading', { level: 1, name: 'Mushilu-San UI' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute(
      'href',
      '/getting-started',
    );
    expect(screen.getByRole('link', { name: 'Browse components' })).toHaveAttribute(
      'href',
      '/components',
    );
    expect(
      screen.getAllByRole('link', { name: /^(Primitives|Forms|Layout)/ }).length,
    ).toBeGreaterThanOrEqual(3);
  });
});
