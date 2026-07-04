import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for `<mui-chart>`.
 *
 * Chart.js renders into a `<canvas>` — pixel content isn't inspectable through the CDK, so this
 * harness is limited to what the component actually exposes in the DOM: the host's `role="figure"`
 * and the canvas's `role="img"` / `aria-label` (driven by the `label` input) / `id`.
 */
export class MuiChartHarness extends ComponentHarness {
  static hostSelector = 'mui-chart';

  private readonly _canvas = this.locatorFor('canvas');

  async getHostRole(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('role');
  }

  async getLabel(): Promise<string | null> {
    const canvas = await this._canvas();
    return canvas.getAttribute('aria-label');
  }

  async getCanvasRole(): Promise<string | null> {
    const canvas = await this._canvas();
    return canvas.getAttribute('role');
  }

  async getCanvasId(): Promise<string | null> {
    const canvas = await this._canvas();
    return canvas.getAttribute('id');
  }
}
