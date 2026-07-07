import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Input } from '../input/input';
import { InputGroup } from './input-group';
import { InputGroupAddon } from './input-group-addon';

const meta: Meta<InputGroup> = {
  title: 'Forms/InputGroup',
  component: InputGroup,
  decorators: [moduleMetadata({ imports: [InputGroup, InputGroupAddon, Input] })],
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<InputGroup>;

export const Default: Story = {
  render: () => ({
    template: `
      <mui-input-group style="width:280px;">
        <input muiInput placeholder="Enter text…" aria-label="Text input" />
      </mui-input-group>
    `,
  }),
};

export const WithLeadingAddon: Story = {
  render: () => ({
    template: `
      <mui-input-group style="width:280px;">
        <mui-input-group-addon>$</mui-input-group-addon>
        <input muiInput type="number" placeholder="0.00" aria-label="Dollar amount" />
      </mui-input-group>
    `,
  }),
};

export const WithTrailingAddon: Story = {
  render: () => ({
    template: `
      <mui-input-group style="width:280px;">
        <input muiInput type="text" placeholder="username" aria-label="Username" />
        <mui-input-group-addon>@example.com</mui-input-group-addon>
      </mui-input-group>
    `,
  }),
};

export const BothAddons: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:300px;">
        <mui-input-group>
          <mui-input-group-addon>$</mui-input-group-addon>
          <input muiInput type="number" placeholder="0.00" aria-label="Dollar amount" />
          <mui-input-group-addon>USD</mui-input-group-addon>
        </mui-input-group>
        <mui-input-group>
          <mui-input-group-addon>https://</mui-input-group-addon>
          <input muiInput type="text" placeholder="example.com" aria-label="Website URL" />
        </mui-input-group>
        <mui-input-group>
          <mui-input-group-addon>+1</mui-input-group-addon>
          <input muiInput type="tel" placeholder="(555) 000-0000" aria-label="Phone number" />
        </mui-input-group>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:280px;">
        <mui-input-group size="sm">
          <mui-input-group-addon>$</mui-input-group-addon>
          <input muiInput size="sm" type="number" placeholder="Small" aria-label="Small amount" />
        </mui-input-group>
        <mui-input-group size="md">
          <mui-input-group-addon>$</mui-input-group-addon>
          <input muiInput size="md" type="number" placeholder="Medium" aria-label="Medium amount" />
        </mui-input-group>
        <mui-input-group size="lg">
          <mui-input-group-addon>$</mui-input-group-addon>
          <input muiInput size="lg" type="number" placeholder="Large" aria-label="Large amount" />
        </mui-input-group>
      </div>
    `,
  }),
};

export const Invalid: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:6px;width:280px;">
        <mui-input-group invalid>
          <mui-input-group-addon>$</mui-input-group-addon>
          <input muiInput type="number" placeholder="0.00"
            aria-label="Amount" aria-invalid="true" aria-describedby="amount-err" />
        </mui-input-group>
        <p id="amount-err" role="alert" style="margin:0;font-size:12px;color:#dc2626;">
          Please enter a valid amount.
        </p>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:320px;">
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label for="price" style="font-size:14px;font-weight:500;">Price</label>
          <mui-input-group>
            <mui-input-group-addon aria-hidden="true">$</mui-input-group-addon>
            <input muiInput id="price" type="number" placeholder="0.00" aria-label="Price in dollars" />
            <mui-input-group-addon aria-hidden="true">USD</mui-input-group-addon>
          </mui-input-group>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label for="website" style="font-size:14px;font-weight:500;">Website</label>
          <mui-input-group>
            <mui-input-group-addon aria-hidden="true">https://</mui-input-group-addon>
            <input muiInput id="website" type="url" placeholder="example.com" />
          </mui-input-group>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          <label for="email-err-input" style="font-size:14px;font-weight:500;">Email</label>
          <mui-input-group invalid>
            <input muiInput id="email-err-input" type="email" value="bad@@"
              aria-invalid="true" aria-describedby="email-msg" />
            <mui-input-group-addon aria-hidden="true">✕</mui-input-group-addon>
          </mui-input-group>
          <p id="email-msg" role="alert" style="margin:0;font-size:12px;color:#dc2626;">
            Invalid email address.
          </p>
        </div>
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;padding:16px;display:flex;flex-direction:column;gap:12px;">
        <mui-input-group>
          <mui-input-group-addon>$</mui-input-group-addon>
          <input muiInput type="number" placeholder="Amount" aria-label="Amount" />
        </mui-input-group>
        <mui-input-group>
          <mui-input-group-addon>@</mui-input-group-addon>
          <input muiInput type="text" placeholder="username" aria-label="Username" />
        </mui-input-group>
        <mui-input-group>
          <mui-input-group-addon>https://</mui-input-group-addon>
          <input muiInput type="url" placeholder="example.com" aria-label="Website" />
        </mui-input-group>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
