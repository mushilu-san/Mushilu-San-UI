import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for `<mui-accordion>` (rooted on the group, `AccordionGroup`).
 *
 * Item state is read from each `<mui-accordion-item>`'s trigger button (`[part="trigger"]`),
 * which carries `aria-expanded` reflecting `AccordionItem.isOpen()`. Indices correspond to
 * document order of the rendered `mui-accordion-item` children.
 */
export class MuiAccordionHarness extends ComponentHarness {
  static hostSelector = 'mui-accordion';

  private readonly _triggers = this.locatorForAll('[part="trigger"]');

  async getItemCount(): Promise<number> {
    return (await this._triggers()).length;
  }

  async isExpanded(index: number): Promise<boolean> {
    const trigger = (await this._triggers())[index];
    if (!trigger) throw new Error(`MuiAccordionHarness: no item at index ${index}`);
    return (await trigger.getAttribute('aria-expanded')) === 'true';
  }

  async toggle(index: number): Promise<void> {
    const trigger = (await this._triggers())[index];
    if (!trigger) throw new Error(`MuiAccordionHarness: no item at index ${index}`);
    await trigger.click();
  }

  async getHeading(index: number): Promise<string> {
    const trigger = (await this._triggers())[index];
    if (!trigger) throw new Error(`MuiAccordionHarness: no item at index ${index}`);
    return trigger.text();
  }
}
