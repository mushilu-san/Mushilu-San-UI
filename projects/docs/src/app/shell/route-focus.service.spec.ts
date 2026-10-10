import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { RouteFocus } from './route-focus.service';

@Component({
  selector: 'docs-page-a',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<main><h1>Page A</h1></main>',
})
class PageA {}

@Component({
  selector: 'docs-page-b',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<main><h1>Page B</h1></main>',
})
class PageB {}

describe('RouteFocus', () => {
  it('moves focus to the new h1 and announces the title after client navigation', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'a', title: 'A title', component: PageA },
          { path: 'b', title: 'B title', component: PageB },
        ]),
      ],
    });
    const focus = TestBed.inject(RouteFocus);
    focus.init();
    const harness = await RouterTestingHarness.create('/a');
    expect(focus.message()).toBe(''); // initial load is not announced

    await harness.navigateByUrl('/b');
    await TestBed.inject(Router).navigated;
    harness.detectChanges();
    await harness.fixture.whenStable();

    const h1 = harness.routeNativeElement?.querySelector('h1');
    expect(h1).toHaveTextContent('Page B');
    expect(document.activeElement).toBe(h1);
    expect(h1).toHaveAttribute('tabindex', '-1');
    expect(focus.message()).toBe('B title');
  });

  describe('fragment-only and query-only navigation', () => {
    async function setup() {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            { path: 'a', title: 'A title', component: PageA },
            { path: 'b', title: 'B title', component: PageB },
          ]),
        ],
      });
      const focus = TestBed.inject(RouteFocus);
      focus.init();
      const harness = await RouterTestingHarness.create('/a');
      const settle = async (url: string) => {
        await harness.navigateByUrl(url);
        await TestBed.inject(Router).navigated;
        harness.detectChanges();
        await harness.fixture.whenStable();
      };
      return { focus, harness, settle };
    }

    it('does not move focus or re-announce when only the fragment changes', async () => {
      const { focus, harness, settle } = await setup();
      const h1 = harness.routeNativeElement?.querySelector('h1');
      await settle('/a#section');
      expect(document.activeElement).not.toBe(h1);
      expect(h1).not.toHaveAttribute('tabindex');
      expect(focus.message()).toBe('');
    });

    it('does not move focus when only the query string changes', async () => {
      const { focus, settle } = await setup();
      await settle('/a?x=1');
      expect(focus.message()).toBe('');
    });

    it('still moves focus after a fragment nav followed by a real route change', async () => {
      const { focus, harness, settle } = await setup();
      await settle('/a#section');
      await settle('/b');
      expect(document.activeElement).toBe(harness.routeNativeElement?.querySelector('h1'));
      expect(focus.message()).toBe('B title');
    });

    it('focuses the h1 without scrolling it into view', async () => {
      const { harness, settle } = await setup();
      await settle('/a#x'); // no-op
      const spy = vi.spyOn(HTMLElement.prototype, 'focus');
      try {
        await settle('/b');
        expect(spy).toHaveBeenCalledWith({ preventScroll: true });
        expect(document.activeElement).toBe(harness.routeNativeElement?.querySelector('h1'));
      } finally {
        spy.mockRestore();
      }
    });
  });
});
