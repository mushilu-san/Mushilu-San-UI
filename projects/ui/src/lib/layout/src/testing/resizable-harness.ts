import { ComponentHarness, TestKey } from '@angular/cdk/testing';

export class MuiResizableHarness extends ComponentHarness {
  static hostSelector = 'mui-resizable-panel-group';

  private readonly _panels = this.locatorForAll('[part="panel"]');
  private readonly _handles = this.locatorForAll('[part="handle"]');

  async getDirection(): Promise<'horizontal' | 'vertical'> {
    const host = await this.host();
    const direction = await host.getAttribute('data-direction');
    return direction === 'vertical' ? 'vertical' : 'horizontal';
  }

  async getPanelCount(): Promise<number> {
    return (await this._panels()).length;
  }

  async getHandleCount(): Promise<number> {
    return (await this._handles()).length;
  }

  /**
   * Panel sizes as percentages, parsed from each panel's inline `flex-basis` style —
   * `getCssValue` would return the browser's resolved *pixel* used-value instead of the
   * authored percentage, which is what the component actually manages.
   */
  async getPanelSizes(): Promise<number[]> {
    const panels = await this._panels();
    return Promise.all(
      panels.map(async (panel) => {
        const style = (await panel.getAttribute('style')) ?? '';
        const match = /flex-basis:\s*([\d.]+)%/.exec(style);
        if (!match) throw new Error('MuiResizableHarness: panel has no flex-basis% style');
        return Number.parseFloat(match[1]);
      }),
    );
  }

  async focusHandle(index = 0): Promise<void> {
    const handles = await this._handles();
    const handle = handles[index];
    if (!handle) throw new Error(`MuiResizableHarness: no handle at index ${index}`);
    await handle.focus();
  }

  /**
   * Resizes via the keyboard contract on `ResizableHandle`: ArrowRight/ArrowDown grow the
   * leading panel, ArrowLeft/ArrowUp shrink it, and Shift moves in 10% steps instead of 1%.
   */
  async resizeByKeyboard(index: number, steps: number, shift = false): Promise<void> {
    const handles = await this._handles();
    const handle = handles[index];
    if (!handle) throw new Error(`MuiResizableHarness: no handle at index ${index}`);
    const direction = await this.getDirection();
    const forwardKey = direction === 'horizontal' ? TestKey.RIGHT_ARROW : TestKey.DOWN_ARROW;
    const backwardKey = direction === 'horizontal' ? TestKey.LEFT_ARROW : TestKey.UP_ARROW;
    const key = steps >= 0 ? forwardKey : backwardKey;
    for (let i = 0; i < Math.abs(steps); i++) {
      if (shift) {
        await handle.sendKeys({ shift: true }, key);
      } else {
        await handle.sendKeys(key);
      }
    }
  }
}
