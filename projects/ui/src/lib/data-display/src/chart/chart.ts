import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  effect,
  input,
} from '@angular/core';
import { Chart as ChartJs, registerables } from 'chart.js';
import type { ChartData, ChartOptions, ChartType } from 'chart.js';

type PortableChartOptions = Record<string, unknown>;

ChartJs.register(...registerables);

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
  type = input<ChartType>('bar');
  data = input.required<ChartData>();
  options = input<PortableChartOptions>({});
  label = input<string>('Chart');

  @ViewChild('canvasRef') private canvasRef!: ElementRef<HTMLCanvasElement>;
  private chartInstance?: ChartJs;
  protected readonly canvasId = `mui-chart-canvas-${chartUid++}`;

  constructor() {
    effect(() => {
      const type = this.type();
      const data = this.data();
      const opts = this.options();
      if (!this.chartInstance) return;

      const config = this.chartInstance.config as { type: ChartType };
      if (config.type !== type) {
        this.chartInstance.destroy();
        this.chartInstance = new ChartJs(this.canvasRef.nativeElement, {
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

  ngAfterViewInit(): void {
    const baseOptions: ChartOptions = prefersReducedMotion
      ? { animation: false, animations: {} }
      : {};

    this.chartInstance = new ChartJs(this.canvasRef.nativeElement, {
      type: this.type(),
      data: this.data(),
      options: { ...baseOptions, ...this.options() } as ChartOptions,
    });
  }

  ngOnDestroy(): void {
    this.chartInstance?.destroy();
  }
}
