import type { Meta, StoryObj } from '@storybook/angular';
import { SkipLink } from './skip-link';

const meta: Meta<SkipLink> = {
  title: 'Navigation/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<SkipLink>;

const PAGE = `
  <div style="position:relative;min-height:160px;">
    <a muiSkipLink href="#main">Skip to main content</a>
    <nav aria-label="Site" style="padding-top:56px;"><a href="#x">Home</a> <a href="#y">Blog</a></nav>
    <main id="main"><h1 style="font-size:1.25rem;">Main content</h1><p>Press Tab to reveal the link.</p></main>
  </div>
`;

export const Default: Story = {
  render: () => ({ props: {}, template: PAGE, imports: [SkipLink] }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: () => ({ props: {}, template: PAGE, imports: [SkipLink] }),
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({ props: {}, template: PAGE, imports: [SkipLink] }),
};
