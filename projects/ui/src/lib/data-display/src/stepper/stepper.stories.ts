import type { Meta, StoryObj } from '@storybook/angular';
import { Step } from './step';
import { Stepper } from './stepper';

const meta: Meta<Stepper> = {
  component: Stepper,
  title: 'Data Display/Stepper',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<Stepper>;

export const Default: Story = {
  render: () => ({
    imports: [Stepper, Step],
    template: `<mui-stepper aria-label="Series parts"><mui-step label="Setup"><span slot="meta">5 min</span>Install the tools.</mui-step><mui-step label="Build" href="/build">Write the first component.</mui-step><mui-step label="Ship">Publish it.</mui-step></mui-stepper>`,
  }),
};

export const ExplicitNumbers: Story = {
  render: () => ({
    imports: [Stepper, Step],
    template: `<mui-stepper aria-label="Parts"><mui-step label="Part 3" [number]="3" /><mui-step label="Part 4" [number]="4" /></mui-stepper>`,
  }),
};

export const Interactive: Story = {
  render: () => ({
    imports: [Stepper, Step],
    template: `<mui-stepper aria-label="Series parts"><mui-step label="Setup"><span slot="meta">5 min</span>Install the tools.</mui-step><mui-step label="Build" href="/build">Write the first component.</mui-step><mui-step label="Ship">Publish it.</mui-step></mui-stepper>`,
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: () => ({
    imports: [Stepper, Step],
    template: `<mui-stepper aria-label="Series parts"><mui-step label="Setup"><span slot="meta">5 min</span>Install the tools.</mui-step><mui-step label="Build" href="/build">Write the first component.</mui-step><mui-step label="Ship">Publish it.</mui-step></mui-stepper>`,
  }),
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    imports: [Stepper, Step],
    template: `<div style="max-width:360px"><mui-stepper aria-label="Series parts"><mui-step label="Setup"><span slot="meta">5 min</span>Install the tools.</mui-step><mui-step label="Build" href="/build">Write the first component.</mui-step><mui-step label="Ship">Publish it.</mui-step></mui-stepper></div>`,
  }),
};
