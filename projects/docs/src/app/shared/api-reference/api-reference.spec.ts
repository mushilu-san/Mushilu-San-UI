import { render, screen, within } from '@testing-library/angular';
import { provideMushiluUi } from '@mushilu-san/ui';
import type { ApiIndex } from '../../../content/api-types';
import { API_INDEX } from '../../../content/tokens';
import { ApiReference } from './api-reference';

const api: ApiIndex = {
  Widget: {
    name: 'Widget',
    group: 'primitives',
    kind: 'component',
    selector: 'mui-widget',
    members: [
      {
        name: 'size',
        kind: 'input',
        type: "'sm' | 'md'",
        default: "'md'",
        required: false,
        description: 'Size.',
      },
      { name: 'key', kind: 'input', type: 'string', required: true },
      {
        name: 'disabled',
        kind: 'input',
        type: 'boolean',
        default: 'false',
        required: false,
        transform: 'booleanAttribute',
      },
      { name: 'dense', kind: 'input', type: 'boolean', required: false, deprecated: 'Use size.' },
      { name: 'open', kind: 'model', type: 'boolean', default: 'false', required: false },
      { name: 'changed', kind: 'output', type: 'string', required: false },
    ],
    methods: [],
    parts: ['root', 'label'],
  },
  WidgetService: {
    name: 'WidgetService',
    group: 'primitives',
    kind: 'service',
    providedIn: 'root',
    members: [],
    methods: [{ name: 'show', signature: '(m: string) => void', description: 'Shows.' }],
    parts: [],
  },
};

async function setup(classes: string[]) {
  return render(ApiReference, {
    inputs: { classes },
    providers: [provideMushiluUi(), { provide: API_INDEX, useValue: api }],
  });
}

describe('ApiReference', () => {
  it('renders a heading and selector per class', async () => {
    await setup(['Widget']);
    expect(screen.getByRole('heading', { level: 3, name: 'Widget' })).toBeInTheDocument();
    expect(screen.getByText('mui-widget')).toBeInTheDocument();
  });

  it('splits members into Inputs, Models and Outputs tables', async () => {
    await setup(['Widget']);
    const inputs = screen.getByRole('table', { name: 'Widget inputs' });
    expect(within(inputs).getAllByRole('row')).toHaveLength(5); // header + 4
    expect(screen.getByRole('table', { name: 'Widget models' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Widget outputs' })).toBeInTheDocument();
  });

  it('marks required, deprecated and attribute-friendly inputs', async () => {
    await setup(['Widget']);
    const inputs = screen.getByRole('table', { name: 'Widget inputs' });
    expect(within(inputs).getByText('required')).toBeInTheDocument();
    expect(within(inputs).getByText('deprecated')).toBeInTheDocument();
    expect(within(inputs).getByText(/attribute presence/i)).toBeInTheDocument();
  });

  it('renders service methods and CSS parts', async () => {
    await setup(['Widget', 'WidgetService']);
    expect(screen.getByRole('table', { name: 'WidgetService methods' })).toHaveTextContent(
      '(m: string) => void',
    );
    expect(screen.getByRole('list', { name: 'Widget CSS parts' })).toHaveTextContent('root');
  });

  it('omits tables for empty member kinds', async () => {
    await setup(['WidgetService']);
    expect(screen.queryByRole('table', { name: 'WidgetService inputs' })).not.toBeInTheDocument();
  });
});
