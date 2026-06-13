import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderComponent } from '../../../../core/testing';
import { Chart } from './chart';

const mockDestroy = vi.hoisted(() => vi.fn());
const mockUpdate = vi.hoisted(() => vi.fn());
const mockRegister = vi.hoisted(() => vi.fn());
const ctorCalls = vi.hoisted(() => [] as { canvas: unknown; cfg: unknown }[]);

vi.mock('chart.js', () => {
  class MockChart {
    config = { type: 'bar' };
    data = {};
    options = {};
    destroy = mockDestroy;
    update = mockUpdate;
    static register = mockRegister;
    constructor(canvas: unknown, cfg: unknown) {
      ctorCalls.push({ canvas, cfg });
    }
  }
  return { Chart: MockChart, registerables: [] };
});

const SAMPLE_DATA = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{ label: 'Sales', data: [10, 20, 30] }],
};

describe('Chart', () => {
  beforeEach(() => {
    mockDestroy.mockClear();
    mockUpdate.mockClear();
    ctorCalls.length = 0;
  });

  it('renders a canvas element', async () => {
    const { container } = await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA },
    });
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('canvas has role=img', async () => {
    const { container } = await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA },
    });
    expect(container.querySelector('canvas')).toHaveAttribute('role', 'img');
  });

  it('canvas has aria-label from label input', async () => {
    const { container } = await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA, label: 'Monthly Sales' },
    });
    expect(container.querySelector('canvas')).toHaveAttribute('aria-label', 'Monthly Sales');
  });

  it('defaults label to Chart', async () => {
    const { container } = await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA },
    });
    expect(container.querySelector('canvas')).toHaveAttribute('aria-label', 'Chart');
  });

  it('canvas has unique id prefixed with mui-chart-canvas', async () => {
    const { container } = await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA },
    });
    expect(container.querySelector('canvas')?.id).toMatch(/^mui-chart-canvas-/);
  });

  it('host has role=figure', async () => {
    const { container } = await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA },
    });
    expect(container).toHaveAttribute('role', 'figure');
  });

  it('host has part=root', async () => {
    const { container } = await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA },
    });
    expect(container).toHaveAttribute('part', 'root');
  });

  it('canvas has part=canvas', async () => {
    const { container } = await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA },
    });
    expect(container.querySelector('canvas')).toHaveAttribute('part', 'canvas');
  });

  it('creates a Chart.js instance on init', async () => {
    await renderComponent(Chart, { inputs: { data: SAMPLE_DATA } });
    expect(ctorCalls).toHaveLength(1);
    expect(ctorCalls[0].canvas).toBeInstanceOf(HTMLCanvasElement);
  });

  it('passes type to Chart.js constructor', async () => {
    await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA, type: 'line' },
    });
    expect((ctorCalls[0].cfg as { type: string }).type).toBe('line');
  });

  it('passes data to Chart.js constructor', async () => {
    await renderComponent(Chart, { inputs: { data: SAMPLE_DATA } });
    expect((ctorCalls[0].cfg as { data: unknown }).data).toEqual(SAMPLE_DATA);
  });

  it('defaults type to bar', async () => {
    await renderComponent(Chart, { inputs: { data: SAMPLE_DATA } });
    expect((ctorCalls[0].cfg as { type: string }).type).toBe('bar');
  });

  it('destroys chart instance on component destroy', async () => {
    const { fixture } = await renderComponent(Chart, { inputs: { data: SAMPLE_DATA } });
    fixture.destroy();
    expect(mockDestroy).toHaveBeenCalledOnce();
  });

  it('updates chart data without recreating when type stays the same', async () => {
    const { fixture, detectChanges } = await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA },
    });
    const newData = { labels: ['Apr'], datasets: [{ label: 'X', data: [99] }] };
    fixture.componentRef.setInput('data', newData);
    detectChanges();
    await fixture.whenStable();
    // update() should be called; destroy() should NOT be called again
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockDestroy).not.toHaveBeenCalled();
  });

  it('destroys and recreates chart when type changes', async () => {
    const { fixture, detectChanges } = await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA, type: 'bar' as const },
    });
    // The mock chart starts with config.type = 'bar' (from the class definition)
    // Changing to 'line' triggers the destroy + new ChartJs path
    fixture.componentRef.setInput('type', 'line');
    detectChanges();
    await fixture.whenStable();
    expect(mockDestroy).toHaveBeenCalled();
    // A second Chart.js instance should have been created
    expect(ctorCalls.length).toBeGreaterThan(1);
  });

  it('updates chart when options input changes', async () => {
    const { fixture, detectChanges } = await renderComponent(Chart, {
      inputs: { data: SAMPLE_DATA },
    });
    fixture.componentRef.setInput('options', { responsive: true });
    detectChanges();
    await fixture.whenStable();
    expect(mockUpdate).toHaveBeenCalled();
  });
});
