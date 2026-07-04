import { ComponentHarness } from '@angular/cdk/testing';

export class MuiPaginationHarness extends ComponentHarness {
  static hostSelector = 'mui-pagination';

  private readonly _pageButtons = this.locatorForAll('[part="page"]');
  private readonly _prevButton = this.locatorFor('[part="prev"]');
  private readonly _nextButton = this.locatorFor('[part="next"]');

  async getCurrentPage(): Promise<number> {
    const buttons = await this._pageButtons();
    for (const button of buttons) {
      if ((await button.getAttribute('aria-current')) === 'page') {
        return Number((await button.text()).trim());
      }
    }
    throw new Error('No current page button found');
  }

  async getPageLabels(): Promise<string[]> {
    const buttons = await this._pageButtons();
    return Promise.all(buttons.map((b) => b.text()));
  }

  async goToPage(page: number): Promise<void> {
    const buttons = await this._pageButtons();
    for (const button of buttons) {
      if ((await button.text()).trim() === String(page)) {
        await button.click();
        return;
      }
    }
    throw new Error(`No page button found for page ${page}`);
  }

  async clickNext(): Promise<void> {
    const next = await this._nextButton();
    await next.click();
  }

  async clickPrev(): Promise<void> {
    const prev = await this._prevButton();
    await prev.click();
  }

  async isNextDisabled(): Promise<boolean> {
    const next = await this._nextButton();
    return (await next.getAttribute('aria-disabled')) === 'true';
  }

  async isPrevDisabled(): Promise<boolean> {
    const prev = await this._prevButton();
    return (await prev.getAttribute('aria-disabled')) === 'true';
  }
}
