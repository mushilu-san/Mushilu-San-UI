import { render, screen } from '@testing-library/angular';
import { Home } from './home';

describe('Home', () => {
  it('renders the site title as the page heading', async () => {
    await render(Home);
    expect(screen.getByRole('heading', { level: 1, name: 'Mushilu-San UI' })).toBeInTheDocument();
  });
});
