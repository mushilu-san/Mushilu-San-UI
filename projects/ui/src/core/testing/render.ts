import { DOCUMENT } from '@angular/common';
import type { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render } from '@testing-library/angular';
import type {
  RenderComponentOptions,
  RenderResult,
  RenderTemplateOptions,
} from '@testing-library/angular';
import { provideMushiluUi } from '../tokens/provider';

export type MuiRenderOptions<T = unknown> = RenderComponentOptions<T> & {
  theme?: 'light' | 'dark';
};

export type MuiTemplateRenderOptions = RenderTemplateOptions<unknown> & {
  theme?: 'light' | 'dark';
};

/**
 * Renders a component class with library providers pre-configured.
 * Works for components with element selectors (e.g. `<mui-badge>`).
 * For attribute-selector components (e.g. `button[muiButton]`), use `renderTemplate`.
 */
export async function renderComponent<T>(
  component: Type<T>,
  options: MuiRenderOptions<T> = {},
): Promise<RenderResult<T>> {
  const { providers = [], theme, ...rest } = options;
  const result = await render<T>(component, {
    providers: [provideMushiluUi(), ...providers],
    ...rest,
  });
  if (theme) {
    TestBed.inject(DOCUMENT).documentElement.setAttribute('data-theme', theme);
  }
  return result;
}

/**
 * Renders an HTML template string with library providers pre-configured.
 * Use for attribute-selector components (e.g. `button[muiButton]`) so the
 * native element and its ARIA role are preserved in the rendered DOM.
 *
 * @example
 * await renderTemplate('<button muiButton variant="secondary">Btn</button>', {
 *   imports: [Button],
 * });
 * expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'secondary');
 */
export async function renderTemplate(
  template: string,
  options: MuiTemplateRenderOptions = {},
): Promise<RenderResult<unknown>> {
  const { providers = [], theme, ...rest } = options;
  const result = await render(template, {
    providers: [provideMushiluUi(), ...providers],
    ...rest,
  });
  if (theme) {
    TestBed.inject(DOCUMENT).documentElement.setAttribute('data-theme', theme);
  }
  return result;
}
