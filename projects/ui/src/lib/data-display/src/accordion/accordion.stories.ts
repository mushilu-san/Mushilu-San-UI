import type { Meta, StoryObj } from '@storybook/angular';
import { AccordionGroup } from './accordion';
import { AccordionItem } from './accordion-item';

const meta: Meta = {
  title: 'Data Display/Accordion',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    imports: [AccordionGroup, AccordionItem],
    template: `
      <mui-accordion style="max-width: 480px;">
        <mui-accordion-item heading="What is Mushilu-San UI?">
          A mobile-first Angular component library built with semantic design tokens and WCAG AA accessibility baked in.
        </mui-accordion-item>
        <mui-accordion-item heading="How do I install it?">
          Run <code>npm install @mushilu-san/ui</code>, then import the entry point for your module.
        </mui-accordion-item>
        <mui-accordion-item heading="Is it production ready?">
          Yes — every component ships with test coverage, Storybook stories, and accessibility audits.
        </mui-accordion-item>
      </mui-accordion>
    `,
  }),
};

export const Multiple: Story = {
  render: () => ({
    imports: [AccordionGroup, AccordionItem],
    template: `
      <mui-accordion [multiple]="true" style="max-width: 480px;">
        <mui-accordion-item heading="Section A">Content for section A — stays open when B opens.</mui-accordion-item>
        <mui-accordion-item heading="Section B">Content for section B.</mui-accordion-item>
        <mui-accordion-item heading="Section C">Content for section C.</mui-accordion-item>
      </mui-accordion>
    `,
  }),
};

export const WithDisabled: Story = {
  render: () => ({
    imports: [AccordionGroup, AccordionItem],
    template: `
      <mui-accordion style="max-width: 480px;">
        <mui-accordion-item heading="Active item">This item is interactive.</mui-accordion-item>
        <mui-accordion-item heading="Disabled item" [disabled]="true">
          This will not open — aria-disabled is set on the trigger.
        </mui-accordion-item>
        <mui-accordion-item heading="Another active item">Also interactive.</mui-accordion-item>
      </mui-accordion>
    `,
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: () => ({
    imports: [AccordionGroup, AccordionItem],
    template: `
      <section aria-labelledby="faq-heading" style="max-width: 480px;">
        <h2 id="faq-heading" style="margin: 0 0 1rem; font-size: 1.25rem;">FAQ</h2>
        <mui-accordion>
          <mui-accordion-item heading="Question 1">
            Answer to question 1. Each panel has role="region" with aria-labelledby pointing to its trigger.
          </mui-accordion-item>
          <mui-accordion-item heading="Question 2">
            Answer to question 2. Arrow keys navigate between triggers; Enter/Space toggle the panel.
          </mui-accordion-item>
        </mui-accordion>
      </section>
    `,
  }),
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    imports: [AccordionGroup, AccordionItem],
    template: `
      <div style="padding: 1rem;">
        <mui-accordion>
          <mui-accordion-item heading="Item 1">Mobile content 1.</mui-accordion-item>
          <mui-accordion-item heading="Item 2">Mobile content 2.</mui-accordion-item>
          <mui-accordion-item heading="Item 3">Mobile content 3.</mui-accordion-item>
        </mui-accordion>
      </div>
    `,
  }),
};
