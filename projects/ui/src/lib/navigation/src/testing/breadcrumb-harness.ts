import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

export class MuiBreadcrumbHarness extends ComponentHarness {
  static hostSelector = 'mui-breadcrumb';

  private readonly _links = this.locatorForAll('[part="link"]');
  private readonly _current = this.locatorForOptional('[part="current"]');

  async getLinkLabels(): Promise<string[]> {
    const links = await this._links();
    return Promise.all(links.map((link) => link.text()));
  }

  /** Text of the trailing, non-linked "current page" crumb — or null if every item is a link. */
  async getCurrentLabel(): Promise<string | null> {
    const current = await this._current();
    return current ? current.text() : null;
  }

  /** Clicks the link with the given visible label. */
  async clickLink(label: string): Promise<void> {
    const link = await this._getLinkByLabel(label);
    await link.click();
  }

  async getLinkHref(label: string): Promise<string | null> {
    const link = await this._getLinkByLabel(label);
    return link.getAttribute('href');
  }

  private async _getLinkByLabel(label: string): Promise<TestElement> {
    const links = await this._links();
    for (const link of links) {
      if ((await link.text()) === label) return link;
    }
    throw new Error(`No breadcrumb link found with label "${label}"`);
  }
}
