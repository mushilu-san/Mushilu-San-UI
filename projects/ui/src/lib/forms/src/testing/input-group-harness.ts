import { ComponentHarness } from '@angular/cdk/testing';
import { MuiInputHarness } from './input-harness';

export class MuiInputGroupHarness extends ComponentHarness {
  static hostSelector = 'mui-input-group';

  // NOTE: queries by tag name, not `[part="addon"]`. In the live (non-TestBed) zoneless
  // bootstrap used by Storybook/E2E, InputGroupAddon's `[attr.part]` host binding does not
  // get applied to projected content nested inside `<mui-input-group>` (confirmed via direct
  // DOM inspection — the addon element renders with no attributes at all beyond static ones,
  // even though the identical markup passes in TestBed-based unit tests). Tag-name lookup
  // sidesteps that gap since it only depends on the element existing, not the host binding.
  private readonly _addons = this.locatorForAll('mui-input-group-addon');
  private readonly _input = this.locatorFor(MuiInputHarness);

  async isInvalid(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('data-invalid')) !== null;
  }

  async getSize(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-size');
  }

  /** Text content of every addon slot, in DOM order (leading addon(s) first, trailing last). */
  async getAddonTexts(): Promise<string[]> {
    const addons = await this._addons();
    return Promise.all(addons.map((addon) => addon.text()));
  }

  async getAddonCount(): Promise<number> {
    const addons = await this._addons();
    return addons.length;
  }

  /** Harness for the `input[muiInput]` nested inside this group. */
  async getInput(): Promise<MuiInputHarness> {
    return this._input();
  }
}
