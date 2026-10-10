import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { extractApi, jsdocCoverage, renderModule } from './extract-api.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const entry = resolve(here, '__fixtures__/lib/demo-group/src/public-api.ts');

describe('extractApi', () => {
  let api;
  const member = (name) => api.FixtureCard.members.find((m) => m.name === name);

  beforeAll(() => {
    api = extractApi([{ group: 'demo-group', file: entry }]);
  });

  it('indexes decorated classes only', () => {
    expect(Object.keys(api).sort()).toEqual(['FixtureCard', 'FixtureService', 'FixtureTip']);
  });

  it('reads component metadata', () => {
    expect(api.FixtureCard).toMatchObject({
      name: 'FixtureCard',
      group: 'demo-group',
      kind: 'component',
      selector: 'mui-fixture-card',
    });
  });

  it('expands literal unions and reads defaults and JSDoc', () => {
    expect(member('size')).toEqual({
      name: 'size',
      kind: 'input',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      required: false,
      description: 'Visual size of the card.',
    });
  });

  it('reports boolean transform inputs as boolean', () => {
    expect(member('disabled')).toMatchObject({
      type: 'boolean',
      default: 'false',
      transform: 'booleanAttribute',
    });
  });

  it('keeps optional inputs without a default', () => {
    expect(member('heading')).toEqual({
      name: 'heading',
      kind: 'input',
      type: 'string | undefined',
      required: false,
    });
  });

  it('marks required inputs', () => {
    expect(member('key')).toMatchObject({ required: true, type: 'string' });
    expect(member('key').default).toBeUndefined();
  });

  it('uses the alias as the public name and reads @deprecated', () => {
    expect(member('compact')).toBeUndefined();
    expect(member('dense')).toMatchObject({ deprecated: 'Use `size` instead.' });
  });

  it('extracts models and outputs', () => {
    expect(member('open')).toMatchObject({ kind: 'model', type: 'boolean', default: 'false' });
    expect(member('pressed')).toMatchObject({ kind: 'output', type: 'MouseEvent' });
  });

  it('ignores non-signal properties', () => {
    expect(member('internal')).toBeUndefined();
  });

  it('collects CSS parts from the host and template, sorted and unique', () => {
    expect(api.FixtureCard.parts).toEqual(['body', 'footer', 'header', 'root']);
  });

  it('handles directives', () => {
    expect(api.FixtureTip).toMatchObject({ kind: 'directive', selector: '[muiFixtureTip]' });
    expect(api.FixtureTip.members[0]).toMatchObject({ name: 'muiFixtureTip', required: true });
  });

  it('lists public service methods only', () => {
    expect(api.FixtureService).toMatchObject({ kind: 'service', providedIn: 'root' });
    expect(api.FixtureService.methods).toHaveLength(1);
    expect(api.FixtureService.methods[0].name).toBe('show');
    expect(api.FixtureService.methods[0].signature).toMatch(
      /^\(message: string, duration\?: number\)(: | => )number$/,
    );
    expect(api.FixtureService.methods[0].description).toBe('Shows a message.');
  });

  it('computes JSDoc coverage over inputs, outputs and models', () => {
    expect(jsdocCoverage(api)).toEqual({ documented: 5, total: 8 });
  });

  it('renders a typed TS module', () => {
    const mod = renderModule(api);
    expect(mod).toContain("import type { ApiIndex } from '../content/api-types';");
    expect(mod).toContain('export const API: ApiIndex = {');
    expect(mod).toContain('"FixtureCard"');
  });
});
