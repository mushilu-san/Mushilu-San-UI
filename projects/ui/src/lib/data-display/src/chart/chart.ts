import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  effect,
  input,
  viewChild,
} from '@angular/core';
import type { Chart as ChartJs, ChartData, ChartOptions, ChartType } from 'chart.js';

type PortableChartOptions = Record<string, unknown>;

// #877: chart.js is loaded on first use, so importing `data-display` never pulls it into a bundle.
let chartJsLoad: Promise<typeof ChartJs> | undefined;
function loadChartJs(): Promise<typeof ChartJs> {
  chartJsLoad ??= import('chart.js').then((m) => {
    m.Chart.register(...m.registerables);
    return m.Chart;
  });
  return chartJsLoad;
}

let chartUid = 0;

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

@Component({
  selector: 'mui-chart',
  standalone: true,
  templateUrl: './chart.html',
  styleUrl: './chart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
    role: 'figure',
  },
})
export class Chart implements AfterViewInit, OnDestroy {
  /** Chart kind: `bar`, `line`, `pie`, `doughnut`, and other Chart.js types. Default `bar`. */
  type = input<ChartType>('bar');
  /** Data set in the Chart.js format: `labels` and `datasets`. */
  data = input.required<ChartData>();
  /** Chart.js options passed through to the chart. */
  options = input<PortableChartOptions>({});
  /** Accessible name of the figure, describing what is shown. Default `Chart`. */
  label = input<string>('Chart');

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasRef');
  private chartCtor?: typeof ChartJs;
  private chartInstance?: ChartJs;
  private destroyed = false;
  protected readonly canvasId = `mui-chart-canvas-${chartUid++}`;

  constructor() {
    effect(() => {
      const type = this.type();
      const data = this.data();
      const opts = this.options();
      const ctor = this.chartCtor;
      if (!ctor || !this.chartInstance) return;

      const config = this.chartInstance.config as { type: ChartType };
      if (config.type !== type) {
        this.chartInstance.destroy();
        this.chartInstance = new ctor(this.canvasRef().nativeElement, {
          type,
          data,
          options: opts as ChartOptions,
        });
      } else {
        this.chartInstance.data = data;
        Object.assign(this.chartInstance.options as object, opts);
        this.chartInstance.update();
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    const ctor = await loadChartJs();
    if (this.destroyed) return;
    this.chartCtor = ctor;

    const baseOptions: ChartOptions = prefersReducedMotion
      ? { animation: false, animations: {} }
      : {};

    // Read the inputs now: they may have changed while chart.js was loading.
    this.chartInstance = new ctor(this.canvasRef().nativeElement, {
      type: this.type(),
      data: this.data(),
      options: { ...baseOptions, ...this.options() } as ChartOptions,
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.chartInstance?.destroy();
  }
}
