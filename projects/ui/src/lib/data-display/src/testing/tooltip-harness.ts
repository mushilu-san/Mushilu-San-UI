import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness for the Tooltip overlay element (role="tooltip").
 *
 * The `[muiTooltip]` directive is an attribute-selector input consumed purely as a component
 * binding — Angular never reflects it onto the DOM as a literal attribute, so it cannot be used
 * as a harness `hostSelector` to root on the trigger element. The overlay itself is also created
 * on demand and appended to `<body>` (outside the trigger's DOM subtree, see tooltip.ts `create()`
 * / `hide()`), so this harness roots directly on the overlay rather than on the trigger.
 *
 * Because the overlay only exists in the DOM while the tooltip is visible, callers must show the
 * tooltip first (hover/focus the trigger via a raw locator) before looking this harness up —
 * prefer `HarnessLoader.getHarnessOrNull()` so absence (hidden) resolves to `null` instead of
 * throwing. Trigger-side interactions (hover, focus, blur, Escape) have no harness surface here
 * and should stay on raw Playwright locators/keyboard.
 */
export class MuiTooltipHarness extends ComponentHarness {
  static hostSelector = '[role="tooltip"]';

  async getText(): Promise<string> {
    const host = await this.host();
    return host.text();
  }

  /** The overlay's `id`, matched against the trigger's `aria-describedby`. */
  async getId(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('id');
  }
}
