import type { Meta, StoryObj } from '@storybook/angular';
import { Grid } from './grid';

const tile = (label: string, h = 64) => `
  <div style="background:#6366f1;color:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;height:${h}px;">${label}</div>
`;

const meta: Meta<Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    columns: { control: 'number' },
    gap: { control: 'number' },
    columnGap: { control: 'number' },
    rowGap: { control: 'number' },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
  },
};

export default meta;
type Story = StoryObj<Grid>;

export const Default: Story = {
  args: { columns: 3, gap: 4 },
  render: (args) => ({
    props: args,
    template: `
      <mui-grid [columns]="columns" [gap]="gap" style="width:360px;">
        ${[1, 2, 3, 4, 5, 6].map((n) => tile(`${n}`)).join('')}
      </mui-grid>
    `,
    imports: [Grid],
  }),
};

export const Columns: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;width:360px;">
        ${[2, 3, 4]
          .map(
            (cols) => `
          <div>
            <p style="margin:0 0 6px;font-size:12px;color:#64748b;">columns="${cols}"</p>
            <mui-grid columns="${cols}" [gap]="3">
              ${Array.from({ length: cols * 2 }, (_, i) => tile(`${i + 1}`, 48)).join('')}
            </mui-grid>
          </div>
        `,
          )
          .join('')}
      </div>
    `,
    imports: [Grid],
  }),
};

export const IndependentGaps: Story = {
  render: () => ({
    props: {},
    template: `
      <div>
        <p style="margin:0 0 8px;font-size:12px;color:#64748b;">columnGap="8" rowGap="2" — wide columns, tight rows</p>
        <mui-grid [columns]="3" [columnGap]="8" [rowGap]="2" style="width:360px;">
          ${[1, 2, 3, 4, 5, 6].map((n) => tile(`${n}`, 48)).join('')}
        </mui-grid>
      </div>
    `,
    imports: [Grid],
  }),
};

export const ResponsiveCards: Story = {
  render: () => ({
    props: {},
    template: `
      <mui-grid [columns]="3" [gap]="4" style="width:480px;">
        ${['Dashboard', 'Reports', 'Settings', 'Team', 'Billing', 'Support']
          .map(
            (t) => `
          <div style="border:1px solid #e2e8f0;border-radius:8px;padding:16px;">
            <strong style="font-size:14px;">${t}</strong>
            <p style="margin:6px 0 0;font-size:12px;color:#64748b;">Manage your ${t.toLowerCase()} from one place.</p>
          </div>
        `,
          )
          .join('')}
      </mui-grid>
    `,
    imports: [Grid],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="width:380px;">
        <p style="margin:0 0 12px;font-size:13px;color:#64748b;">
          Grid is a purely visual wrapper (display:grid) — it carries no role or ARIA attributes.
          Reading order follows DOM order regardless of visual placement, so always keep
          source order matching the intended reading order.
        </p>
        <mui-grid [columns]="2" [gap]="3" role="list" aria-label="Team members" style="border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
          <div role="listitem" style="font-size:14px;">👤 Alice — Engineering</div>
          <div role="listitem" style="font-size:14px;">👤 Bob — Design</div>
          <div role="listitem" style="font-size:14px;">👤 Carla — Product</div>
          <div role="listitem" style="font-size:14px;">👤 Dee — QA</div>
        </mui-grid>
      </div>
    `,
    imports: [Grid],
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="width:375px;padding:16px;">
        <mui-grid [columns]="2" [gap]="3">
          ${[1, 2, 3, 4].map((n) => tile(`Tile ${n}`, 72)).join('')}
        </mui-grid>
      </div>
    `,
    imports: [Grid],
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
