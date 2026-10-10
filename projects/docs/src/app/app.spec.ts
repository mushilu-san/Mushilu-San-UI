import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { provideMushiluUi } from '@mushilu-san/ui';
import { App } from './app';

describe('App shell', () => {
  async function setup() {
    return render(App, { providers: [provideRouter([]), provideMushiluUi()] });
  }

  it('renders the skip link, header, nav landmark and main', async () => {
    await setup();
    expect(screen.getByRole('button', { name: 'Skip to content' })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    // The sidebar is display:none below 1024px (jsdom applies component CSS), which makes its
    // accessible name compute to "" — so find it by role with hidden nodes and assert the label.
    expect(screen.getByRole('complementary', { hidden: true })).toHaveAttribute(
      'aria-label',
      'Documentation navigation',
    );
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  });

  it('skip link moves focus to main', async () => {
    await setup();
    await userEvent.click(screen.getByRole('button', { name: 'Skip to content' }));
    expect(document.activeElement).toBe(screen.getByRole('main'));
  });

  it('menu button opens the navigation sheet and reflects aria-expanded', async () => {
    await setup();
    const menu = screen.getByRole('button', { name: 'Open navigation' });
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');
  });
});
