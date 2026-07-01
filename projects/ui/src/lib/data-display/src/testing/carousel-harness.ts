import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for `<mui-carousel>`.
 *
 * Dot state is read from the `[role="tab"]` elements rendered by `<mui-carousel-dots>` — the
 * active dot carries `aria-selected="true"`. Prev/Next queries target the `[part="next"]` /
 * `[part="prev"]` attributes exposed by `CarouselNext`/`CarouselPrev` and are optional, since a
 * "dots only" carousel composition (see the `DotsOnly` story) has no nav buttons.
 */
export class MuiCarouselHarness extends ComponentHarness {
  static hostSelector = 'mui-carousel';

  private readonly _dots = this.locatorForAll('[role="tab"]');
  private readonly _next = this.locatorForOptional('[part="next"]');
  private readonly _prev = this.locatorForOptional('[part="prev"]');

  /** Index of the currently active slide, derived from the dot with `aria-selected="true"`. */
  async getActiveSlideIndex(): Promise<number> {
    const dots = await this._dots();
    for (let i = 0; i < dots.length; i++) {
      if ((await dots[i].getAttribute('aria-selected')) === 'true') return i;
    }
    return -1;
  }

  async getSlideCount(): Promise<number> {
    return (await this._dots()).length;
  }

  async next(): Promise<void> {
    const btn = await this._next();
    if (!btn) throw new Error('MuiCarouselHarness: no [muiCarouselNext] button found');
    await btn.click();
  }

  async prev(): Promise<void> {
    const btn = await this._prev();
    if (!btn) throw new Error('MuiCarouselHarness: no [muiCarouselPrev] button found');
    await btn.click();
  }
}
