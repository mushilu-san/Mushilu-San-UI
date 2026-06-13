import type { Meta, StoryObj } from '@storybook/angular';
import { Stack } from './stack';

const chip = (label: string) => `
  <div style="background:#6366f1;color:#fff;border-radius:6px;padding:10px 16px;font-size:13px;text-align:center;">${label}</div>
`;

const meta: Meta<Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    direction: { control: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    gap: { control: 'number' },
    wrap: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Stack>;

export const Default: Story = {
  args: { direction: 'column', gap: 4 },
  render: (args) => ({
    props: args,
    template: `
      <mui-stack [direction]="direction" [align]="align" [justify]="justify" [gap]="gap" [wrap]="wrap" style="width:280px;">
        ${chip('Item one')}
        ${chip('Item two')}
        ${chip('Item three')}
      </mui-stack>
    `,
    imports: [Stack],
  }),
};

export const Direction: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;">
        <div>
          <p style="margin:0 0 8px;font-size:12px;color:#64748b;">direction="column" (default)</p>
          <mui-stack direction="column" [gap]="3" style="width:240px;">
            ${chip('A')}${chip('B')}${chip('C')}
          </mui-stack>
        </div>
        <div>
          <p style="margin:0 0 8px;font-size:12px;color:#64748b;">direction="row"</p>
          <mui-stack direction="row" [gap]="3">
            ${chip('A')}${chip('B')}${chip('C')}
          </mui-stack>
        </div>
      </div>
    `,
    imports: [Stack],
  }),
};

export const Alignment: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;">
        ${(['start', 'center', 'end', 'stretch'] as const)
          .map(
            (align) => `
          <div>
            <p style="margin:0 0 6px;font-size:12px;color:#64748b;">align="${align}"</p>
            <mui-stack direction="row" align="${align}" [gap]="3" style="height:80px;background:#f1f5f9;border-radius:6px;padding:8px;">
              <div style="background:#6366f1;color:#fff;border-radius:6px;padding:6px 12px;font-size:12px;">sm</div>
              <div style="background:#6366f1;color:#fff;border-radius:6px;padding:16px 12px;font-size:12px;">tall</div>
              <div style="background:#6366f1;color:#fff;border-radius:6px;padding:10px 12px;font-size:12px;">md</div>
            </mui-stack>
          </div>
        `,
          )
          .join('')}
      </div>
    `,
    imports: [Stack],
  }),
};

export const Justify: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:320px;">
        ${(['start', 'center', 'end', 'between', 'around', 'evenly'] as const)
          .map(
            (justify) => `
          <div>
            <p style="margin:0 0 6px;font-size:12px;color:#64748b;">justify="${justify}"</p>
            <mui-stack direction="row" justify="${justify}" style="background:#f1f5f9;border-radius:6px;padding:8px;">
              <div style="background:#6366f1;color:#fff;border-radius:6px;padding:6px 10px;font-size:12px;">A</div>
              <div style="background:#6366f1;color:#fff;border-radius:6px;padding:6px 10px;font-size:12px;">B</div>
              <div style="background:#6366f1;color:#fff;border-radius:6px;padding:6px 10px;font-size:12px;">C</div>
            </mui-stack>
          </div>
        `,
          )
          .join('')}
      </div>
    `,
    imports: [Stack],
  }),
};

export const Wrap: Story = {
  render: () => ({
    props: {},
    template: `
      <mui-stack direction="row" [gap]="2" [wrap]="true" style="width:260px;background:#f1f5f9;border-radius:6px;padding:8px;">
        ${[
          'Angular',
          'TypeScript',
          'Storybook',
          'Vitest',
          'CSS',
          'Accessibility',
          'Signals',
          'Zoneless',
        ]
          .map(
            (t) => `
          <span style="background:#fff;border:1px solid #e2e8f0;border-radius:9999px;padding:4px 12px;font-size:12px;">${t}</span>
        `,
          )
          .join('')}
      </mui-stack>
    `,
    imports: [Stack],
  }),
};

export const InContext: Story = {
  render: () => ({
    props: {},
    template: `
      <mui-stack direction="column" [gap]="4" style="width:320px;border:1px solid #e2e8f0;border-radius:8px;padding:20px;">
        <h3 style="margin:0;font-size:16px;">Create account</h3>
        <input placeholder="Email" style="border:1px solid #e2e8f0;border-radius:6px;padding:10px 12px;font-size:14px;width:100%;box-sizing:border-box;" />
        <input placeholder="Password" type="password" style="border:1px solid #e2e8f0;border-radius:6px;padding:10px 12px;font-size:14px;width:100%;box-sizing:border-box;" />
        <mui-stack direction="row" justify="between" align="center">
          <span style="font-size:12px;color:#64748b;">By signing up you agree to our terms.</span>
        </mui-stack>
        <button style="background:#6366f1;color:#fff;border:none;border-radius:6px;padding:10px;font-size:14px;cursor:pointer;">Sign up</button>
      </mui-stack>
    `,
    imports: [Stack],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="width:320px;">
        <p style="margin:0 0 12px;font-size:13px;color:#64748b;">
          Stack is purely a flex layout wrapper — it carries no role or ARIA attributes,
          so semantic content placed inside it (lists, headings, landmarks…) keeps its
          native semantics and reading order.
        </p>
        <mui-stack direction="column" [gap]="2" role="list" aria-label="Recent activity" style="border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
          <div role="listitem" style="font-size:14px;">✅ Profile updated</div>
          <div role="listitem" style="font-size:14px;">📦 Order #1042 shipped</div>
          <div role="listitem" style="font-size:14px;">💬 New comment on your post</div>
        </mui-stack>
      </div>
    `,
    imports: [Stack],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="width:375px;padding:16px;">
        <mui-stack direction="column" [gap]="3">
          ${chip('Card one')}
          ${chip('Card two')}
          ${chip('Card three')}
        </mui-stack>
      </div>
    `,
    imports: [Stack],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
