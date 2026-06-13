import type { Meta, StoryObj } from '@storybook/angular';
import { Slider } from './slider';

const meta: Meta<Slider> = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    value: { control: 'number' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<Slider>;

export const Default: Story = {
  render: () => ({
    template: `<mui-slider [(value)]="val" style="width:280px;" />`,
    imports: [Slider],
    componentProperties: { val: 40 },
  }),
};

export const WithStep: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:4px;width:280px;">
        <p style="margin:0;font-size:14px;color:#64748b;">Step = 10</p>
        <mui-slider [min]="0" [max]="100" [step]="10" [(value)]="val" />
      </div>
    `,
    imports: [Slider],
    componentProperties: { val: 50 },
  }),
};

export const CustomRange: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:4px;width:280px;">
        <p style="margin:0;font-size:14px;color:#64748b;">Range: 200 – 1000 (step 50)</p>
        <mui-slider [min]="200" [max]="1000" [step]="50" [(value)]="val" />
      </div>
    `,
    imports: [Slider],
    componentProperties: { val: 500 },
  }),
};

export const WithValueDisplay: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;width:280px;">
        <div style="display:flex;justify-content:space-between;font-size:14px;">
          <span>Volume</span>
          <span>{{ val }}%</span>
        </div>
        <mui-slider [min]="0" [max]="100" [(value)]="val"
          aria-label="Volume" aria-valuetext="{{ val }}%" />
      </div>
    `,
    imports: [Slider],
    componentProperties: { val: 60 },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:280px;">
        <mui-slider [value]="30" disabled aria-label="Disabled slider" />
        <mui-slider [value]="70" disabled aria-label="Disabled slider at 70" />
      </div>
    `,
    imports: [Slider],
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:300px;">
        <div style="display:flex;flex-direction:column;gap:8px;">
          <label id="vol-label" style="font-size:14px;font-weight:500;">Volume</label>
          <mui-slider
            [min]="0" [max]="100" [(value)]="vol"
            aria-labelledby="vol-label"
            [attr.aria-valuetext]="vol + '%'"
          />
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <label id="price-label" style="font-size:14px;font-weight:500;">Max price</label>
          <mui-slider
            [min]="0" [max]="500" [step]="10" [(value)]="price"
            aria-labelledby="price-label"
            [attr.aria-valuetext]="'$' + price"
          />
        </div>
      </div>
    `,
    imports: [Slider],
    componentProperties: { vol: 60, price: 150 },
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;display:flex;flex-direction:column;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;justify-content:space-between;font-size:14px;">
            <span>Brightness</span><span>{{ brightness }}%</span>
          </div>
          <mui-slider [min]="0" [max]="100" [(value)]="brightness" aria-label="Brightness" />
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;justify-content:space-between;font-size:14px;">
            <span>Volume</span><span>{{ volume }}%</span>
          </div>
          <mui-slider [min]="0" [max]="100" [(value)]="volume" aria-label="Volume" />
        </div>
      </div>
    `,
    imports: [Slider],
    componentProperties: { brightness: 75, volume: 40 },
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
