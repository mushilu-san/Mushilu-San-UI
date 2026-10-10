import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { InlineText } from './inline-text';

describe('InlineText', () => {
  it('renders code as <code> and slugs as router links to the component page', async () => {
    await render(InlineText, {
      inputs: { text: 'Apply `muiButton`; see [Tabs](tabs).' },
      providers: [provideRouter([])],
    });
    expect(screen.getByText('muiButton').tagName).toBe('CODE');
    expect(screen.getByRole('link', { name: 'Tabs' })).toHaveAttribute('href', '/components/tabs');
  });

  it('emits no stray whitespace around segments', async () => {
    const { fixture } = await render(InlineText, {
      inputs: { text: 'See [Tabs](tabs) and `muiButton`.' },
      providers: [provideRouter([])],
    });
    expect((fixture.nativeElement as HTMLElement).textContent).toBe('See Tabs and muiButton.');
  });
});
