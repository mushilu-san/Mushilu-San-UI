import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';
import { Card } from './card';

const meta: Meta<Card> = {
  title: 'Data Display/Card',
  component: Card,
  tags: ['autodocs'],
  args: { clicked: fn() },
};
export default meta;
type Story = StoryObj<Card>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mui-card style="max-width: 320px; padding: 1.5rem;">
        <h3 style="margin: 0 0 0.5rem; font-size: 1rem;">Card Title</h3>
        <p style="margin: 0; color: var(--mui-color-text-muted); font-size: var(--mui-font-size-sm);">
          Card body content goes here. Use <code>ng-content</code> to project anything inside.
        </p>
      </mui-card>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 320px;">
        <mui-card variant="flat" style="padding: 1.5rem;">
          <strong>Flat</strong>
          <p style="margin: 0.5rem 0 0; font-size: var(--mui-font-size-sm);">Default bordered card.</p>
        </mui-card>
        <mui-card variant="elevated" style="padding: 1.5rem;">
          <strong>Elevated</strong>
          <p style="margin: 0.5rem 0 0; font-size: var(--mui-font-size-sm);">Shadow card without border.</p>
        </mui-card>
        <mui-card variant="outlined" style="padding: 1.5rem;">
          <strong>Outlined</strong>
          <p style="margin: 0.5rem 0 0; font-size: var(--mui-font-size-sm);">Stronger border emphasis.</p>
        </mui-card>
      </div>
    `,
  }),
};

export const Clickable: Story = {
  render: (args) => ({
    props: args,
    template: `
      <mui-card [clickable]="true" (clicked)="clicked()" style="max-width: 320px; padding: 1.5rem;">
        <strong>Clickable Card</strong>
        <p style="margin: 0.5rem 0 0; font-size: var(--mui-font-size-sm);">
          Click, or focus and press Enter / Space to activate.
        </p>
      </mui-card>
    `,
  }),
};

export const MediaCard: Story = {
  render: () => ({
    template: `
      <mui-card variant="elevated" style="max-width: 320px; overflow: hidden;">
        <div style="background: var(--mui-color-primary-subtle); height: 160px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 3rem;">🖼️</span>
        </div>
        <div style="padding: 1rem;">
          <h3 style="margin: 0 0 0.25rem; font-size: 1rem;">Media Card</h3>
          <p style="margin: 0; color: var(--mui-color-text-muted); font-size: var(--mui-font-size-sm);">
            Content projected beneath a media region.
          </p>
        </div>
      </mui-card>
    `,
  }),
};

export const Accessibility: Story = {
  parameters: { a11y: { disable: false } },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 320px;">
        <!-- Static card: no interactive role, just a content container -->
        <mui-card style="padding: 1.5rem;" aria-label="User profile">
          <strong>Jane Doe</strong>
          <p style="margin: 0.5rem 0 0; font-size: var(--mui-font-size-sm);">Senior Engineer</p>
        </mui-card>
        <!-- Clickable card: role=button, tabindex, keyboard activation -->
        <mui-card [clickable]="true" (clicked)="clicked()" style="padding: 1.5rem;" aria-label="View Jane Doe's profile">
          <strong>View Profile →</strong>
          <p style="margin: 0.5rem 0 0; font-size: var(--mui-font-size-sm);">Activatable via click, Enter, or Space.</p>
        </mui-card>
      </div>
    `,
  }),
};

export const MobilePreview: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: `
      <div style="padding: 1rem;">
        <mui-card style="padding: 1rem; margin-bottom: 1rem;">
          <strong>Card on mobile</strong>
          <p style="margin: 0.5rem 0 0; font-size: var(--mui-font-size-sm);">Full-width card pattern.</p>
        </mui-card>
        <mui-card [clickable]="true" style="padding: 1rem;">
          <strong>Tappable Card</strong>
          <p style="margin: 0.5rem 0 0; font-size: var(--mui-font-size-sm);">44px minimum touch target.</p>
        </mui-card>
      </div>
    `,
  }),
};
