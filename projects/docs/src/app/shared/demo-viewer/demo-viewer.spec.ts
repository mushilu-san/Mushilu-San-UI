import { ChangeDetectionStrategy, Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { provideMushiluUi } from '@mushilu-san/ui';
import { DEMO_SOURCE_INDEX } from '../../../content/tokens';
import type { DemoRef } from '../../../content/types';
import { DemoViewer } from './demo-viewer';

@Component({
  selector: 'docs-fake-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<p>fake demo body</p>',
})
class FakeDemo {}

const okDemo: DemoRef = { id: 'fake-basic', title: 'Basic', component: async () => FakeDemo };
const brokenDemo: DemoRef = {
  id: 'fake-broken',
  title: 'Broken',
  component: () => Promise.reject(new Error('chunk failed')),
};

const providers = [
  provideMushiluUi(),
  {
    provide: DEMO_SOURCE_INDEX,
    useValue: {
      'fake-basic': {
        source: 'export class FakeDemo {}',
        lines: [[{ t: 'plain', v: 'export class FakeDemo {}' }]],
      },
    },
  },
];

describe('DemoViewer', () => {
  it('renders the demo component in the preview tab', async () => {
    await render(DemoViewer, { inputs: { demo: okDemo }, providers });
    expect(await screen.findByText('fake demo body')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute('aria-selected', 'true');
  });

  it('switches to the source on the Code tab', async () => {
    await render(DemoViewer, { inputs: { demo: okDemo }, providers });
    await userEvent.click(screen.getByRole('tab', { name: 'Code' }));
    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('region', { name: 'fake-basic.demo.ts source' })).toHaveTextContent(
      'export class FakeDemo {}',
    );
  });

  it('shows an alert when the demo fails to load', async () => {
    await render(DemoViewer, { inputs: { demo: brokenDemo }, providers });
    expect(await screen.findByRole('alert')).toHaveTextContent('This example failed to load.');
  });

  it('uses demo-scoped tab values so ids stay unique per page', async () => {
    await render(DemoViewer, { inputs: { demo: okDemo }, providers });
    expect(screen.getByRole('tab', { name: 'Preview' }).id).toContain('preview-fake-basic');
  });
});
