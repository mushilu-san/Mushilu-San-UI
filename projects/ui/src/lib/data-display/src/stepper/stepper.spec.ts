import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Step } from './step';
import { Stepper } from './stepper';

const imports = [Stepper, Step];

describe('Stepper', () => {
  it('has list role with listitem steps', async () => {
    await renderTemplate(
      '<mui-stepper aria-label="Parts"><mui-step label="One" /><mui-step label="Two" /></mui-stepper>',
      { imports },
    );
    expect(document.querySelector('mui-stepper')).toHaveAttribute('role', 'list');
    expect(document.querySelectorAll('mui-step[role="listitem"]').length).toBe(2);
  });
});

describe('Step', () => {
  it('renders the label as plain text without href', async () => {
    await renderTemplate('<mui-step label="Install" />', { imports });
    expect(document.querySelector('mui-step .label')?.textContent).toBe('Install');
    expect(document.querySelector('mui-step a')).toBeNull();
  });

  it('renders an anchor with href, target and rel when href is set', async () => {
    await renderTemplate('<mui-step label="Part 1" href="/p1" target="_blank" rel="noopener" />', {
      imports,
    });
    const a = document.querySelector('mui-step a')!;
    expect(a).toHaveAttribute('href', '/p1');
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener');
    expect(a.textContent?.trim()).toBe('Part 1');
  });

  it('marker is decorative (aria-hidden)', async () => {
    await renderTemplate('<mui-step label="A" />', { imports });
    expect(document.querySelector('mui-step .marker')).toHaveAttribute('aria-hidden', 'true');
  });

  it('sets counter-set only when an explicit number is given', async () => {
    await renderTemplate('<mui-step label="A" /><mui-step label="B" [number]="5" />', {
      imports,
    });
    const [a, b] = Array.from(document.querySelectorAll<HTMLElement>('mui-step'));
    expect(a!.style.counterSet).toBe('');
    expect(b!.style.counterSet).toBe('mui-step 5');
  });

  it('projects meta and description content', async () => {
    await renderTemplate('<mui-step label="A"><span slot="meta">5 min</span>Details</mui-step>', {
      imports,
    });
    expect(document.querySelector('mui-step .meta')?.textContent).toContain('5 min');
    expect(document.querySelector('mui-step .description')?.textContent).toContain('Details');
  });
});
