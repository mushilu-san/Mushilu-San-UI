import type { Meta, StoryObj } from '@storybook/angular';
import { Typography } from './typography';

const meta: Meta<Typography> = {
  title: 'Data Display/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<Typography>;

export const AllVariants: Story = {
  render: () => ({
    imports: [Typography],
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;max-width:640px;">
        <mui-typography variant="h1">The quick brown fox</mui-typography>
        <mui-typography variant="h2">The quick brown fox</mui-typography>
        <mui-typography variant="h3">The quick brown fox</mui-typography>
        <mui-typography variant="h4">The quick brown fox</mui-typography>
        <mui-typography variant="lead">A longer introductory sentence that sets up the rest of the content on the page.</mui-typography>
        <mui-typography variant="p">Default paragraph text. Angular is a platform for building mobile and desktop web applications. Join the millions of developers building amazing apps with Angular.</mui-typography>
        <mui-typography variant="large">Slightly larger body text for emphasis.</mui-typography>
        <mui-typography variant="small">Small helper text used for captions or secondary information.</mui-typography>
        <mui-typography variant="muted">Muted text used for less important information or descriptions.</mui-typography>
        <mui-typography variant="code">const greeting = "hello world"</mui-typography>
        <mui-typography variant="blockquote">
          After all, the best part of a holiday is perhaps not so much to be resting yourself, as to see all the other fellows busy working.
        </mui-typography>
      </div>
    `,
  }),
};

export const Headings: Story = {
  render: () => ({
    imports: [Typography],
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:640px;">
        <mui-typography variant="h1">Heading 1</mui-typography>
        <mui-typography variant="h2">Heading 2</mui-typography>
        <mui-typography variant="h3">Heading 3</mui-typography>
        <mui-typography variant="h4">Heading 4</mui-typography>
      </div>
    `,
  }),
};

export const BodyText: Story = {
  render: () => ({
    imports: [Typography],
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:640px;">
        <mui-typography variant="lead">Lead paragraph — introduce the main topic here.</mui-typography>
        <mui-typography variant="p">Regular body text. Use this for most of the content on your page. It reads well at all sizes and works in both light and dark modes.</mui-typography>
        <mui-typography variant="muted">Muted text for secondary information or footer notes.</mui-typography>
      </div>
    `,
  }),
};

export const Inline: Story = {
  render: () => ({
    imports: [Typography],
    template: `
      <mui-typography variant="p" style="max-width:560px;">
        Run <mui-typography variant="code">npm install @mushilu-san/ui</mui-typography> to add the library to your project.
      </mui-typography>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    imports: [Typography],
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:640px;">
        <p style="font-size:13px;color:var(--mui-color-text-muted);font-family:var(--mui-font-sans);">
          mui-typography renders with display:block by default. Semantic heading markup should use the native elements (h1–h4) inside the component or use headings directly — this component provides visual styling only.
        </p>
        <mui-typography variant="h2">Accessible heading</mui-typography>
        <mui-typography variant="p">Supporting paragraph content below the heading.</mui-typography>
        <mui-typography variant="blockquote">A meaningful quote from a relevant source.</mui-typography>
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};
