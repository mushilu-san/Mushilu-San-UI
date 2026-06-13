import type { Meta, StoryObj } from '@storybook/angular';
import { Container } from './container';

const card = (label: string) => `
  <div style="background:#eef2ff;border:1px dashed #6366f1;border-radius:6px;padding:16px;text-align:center;font-size:13px;color:#4338ca;">
    ${label}
  </div>
`;

const meta: Meta<Container> = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
    padded: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Container>;

export const Default: Story = {
  args: { size: 'lg', padded: true },
  render: (args) => ({
    props: args,
    template: `
      <div style="background:#f8fafc;padding:24px 0;">
        <mui-container [size]="size" [padded]="padded">
          ${card('mui-container — content is centered and capped at the chosen breakpoint')}
        </mui-container>
      </div>
    `,
    imports: [Container],
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="background:#f8fafc;padding:24px 0;display:flex;flex-direction:column;gap:20px;">
        ${(['sm', 'md', 'lg', 'xl', 'full'] as const)
          .map(
            (size) => `
          <div>
            <p style="margin:0 0 6px;padding:0 16px;font-size:12px;color:#64748b;">size="${size}"</p>
            <mui-container size="${size}">${card(`max-width: ${size}`)}</mui-container>
          </div>
        `,
          )
          .join('')}
      </div>
    `,
    imports: [Container],
  }),
};

export const Unpadded: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="background:#f8fafc;padding:24px 0;display:flex;flex-direction:column;gap:16px;">
        <div>
          <p style="margin:0 0 6px;padding:0 16px;font-size:12px;color:#64748b;">padded (default) — has inline padding</p>
          <mui-container size="md">${card('padded')}</mui-container>
        </div>
        <div>
          <p style="margin:0 0 6px;padding:0 16px;font-size:12px;color:#64748b;">[padded]="false" — flush with the edges of its max-width</p>
          <mui-container size="md" [padded]="false">${card('unpadded')}</mui-container>
        </div>
      </div>
    `,
    imports: [Container],
  }),
};

export const InContext: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="background:#f8fafc;">
        <header style="background:#fff;border-bottom:1px solid #e2e8f0;padding:16px 0;">
          <mui-container size="lg">
            <strong style="font-size:16px;">Acme Inc.</strong>
          </mui-container>
        </header>
        <main style="padding:32px 0;">
          <mui-container size="lg">
            <h2 style="margin:0 0 8px;font-size:20px;">Page heading</h2>
            <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;">
              The Container centers and constrains the page's main column width while
              the surrounding sections (header, footer) can still span full bleed.
            </p>
          </mui-container>
        </main>
        <footer style="background:#fff;border-top:1px solid #e2e8f0;padding:16px 0;">
          <mui-container size="lg">
            <span style="font-size:13px;color:#94a3b8;">© 2026 Acme Inc.</span>
          </mui-container>
        </footer>
      </div>
    `,
    imports: [Container],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="background:#f8fafc;padding:24px 0;">
        <p style="margin:0 0 12px;padding:0 16px;font-size:13px;color:#64748b;">
          Container is a purely visual wrapper (display:block) — it adds no role or ARIA
          attributes, so the semantics of its content (headings, landmarks, lists…) pass through untouched.
        </p>
        <mui-container size="md">
          <article aria-labelledby="art-h" style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;">
            <h3 id="art-h" style="margin:0 0 8px;font-size:16px;">Article heading stays a heading</h3>
            <p style="margin:0;font-size:14px;color:#64748b;">…and is still discoverable by screen-reader heading navigation.</p>
          </article>
        </mui-container>
      </div>
    `,
    imports: [Container],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="background:#f8fafc;padding:16px 0;">
        <mui-container size="full">
          ${card('On narrow viewports, "full" avoids unwanted max-width clipping')}
        </mui-container>
      </div>
    `,
    imports: [Container],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
