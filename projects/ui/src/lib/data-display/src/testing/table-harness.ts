import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for `<mui-table>`.
 *
 * Sortable columns render a `[part="sort-btn"]` inside their `[part="th"]`; the sort state
 * (`aria-sort`) lives on the `[part="th"]` itself, so sorting methods key off the header/button
 * label text rather than raw index — column order can change per story and matching by label
 * keeps callers from having to know sortable-column positions ahead of time.
 */
export class MuiTableHarness extends ComponentHarness {
  static hostSelector = 'mui-table';

  private readonly _headers = this.locatorForAll('[part="th"]');
  private readonly _rows = this.locatorForAll('[part="tr"]');
  private readonly _cells = this.locatorForAll('[part="td"]');
  private readonly _sortButtons = this.locatorForAll('[part="sort-btn"]');

  async getColumnHeaders(): Promise<string[]> {
    const headers = await this._headers();
    return Promise.all(headers.map(async (h) => (await h.text()).trim()));
  }

  async getRowCount(): Promise<number> {
    return (await this._rows()).length;
  }

  async getCellText(rowIndex: number, colIndex: number): Promise<string> {
    const headers = await this._headers();
    const cells = await this._cells();
    const cell = cells[rowIndex * headers.length + colIndex];
    if (!cell) throw new Error(`MuiTableHarness: no cell at row ${rowIndex}, col ${colIndex}`);
    return cell.text();
  }

  async sortByLabel(label: string): Promise<void> {
    const buttons = await this._sortButtons();
    for (const btn of buttons) {
      if ((await btn.text()).trim() === label) {
        await btn.click();
        return;
      }
    }
    throw new Error(`MuiTableHarness: no sortable column labeled "${label}"`);
  }

  async getSortDirectionByLabel(label: string): Promise<string | null> {
    const headers = await this._headers();
    for (const header of headers) {
      if ((await header.text()).trim().startsWith(label)) {
        return header.getAttribute('aria-sort');
      }
    }
    throw new Error(`MuiTableHarness: no column labeled "${label}"`);
  }
}
