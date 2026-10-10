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
});
