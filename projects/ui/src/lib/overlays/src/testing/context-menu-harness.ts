import { ComponentHarness } from '@angular/cdk/testing';

export class MuiContextMenuHarness extends ComponentHarness {
  static hostSelector = 'mui-context-menu';

  // ContextMenu's host doesn't expose a data-open attribute (unlike Popover/DropdownMenu), so
  // open state is inferred from whether the [role="menu"] panel is currently rendered.
  private readonly _panel = this.locatorForOptional('[part="panel"]');

  async isOpen(): Promise<boolean> {
    return (await this._panel()) !== null;
  }
}
