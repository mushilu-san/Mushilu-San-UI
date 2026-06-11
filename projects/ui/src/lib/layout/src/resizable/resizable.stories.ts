import type { Meta, StoryObj } from '@storybook/angular';
import { ResizablePanelGroup } from './resizable-panel-group';
import { ResizablePanel } from './resizable-panel';
import { ResizableHandle } from './resizable-handle';

const IMPORTS = [ResizablePanelGroup, ResizablePanel, ResizableHandle];

const meta: Meta = {
  title: 'Layout/Resizable',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <mui-resizable-panel-group style="height:300px;border:1px solid var(--mui-color-border);border-radius:8px;overflow:hidden;">
        <mui-resizable-panel [defaultSize]="50" style="padding:16px;background:var(--mui-color-surface);">
          <p style="margin:0;font-size:14px;">Left panel</p>
        </mui-resizable-panel>
        <mui-resizable-handle />
        <mui-resizable-panel [defaultSize]="50" style="padding:16px;background:var(--mui-color-surface-raised);">
          <p style="margin:0;font-size:14px;">Right panel</p>
        </mui-resizable-panel>
      </mui-resizable-panel-group>
    `,
    imports: IMPORTS,
  }),
};

export const WithHandle: Story = {
  render: () => ({
    template: `
      <mui-resizable-panel-group style="height:300px;border:1px solid var(--mui-color-border);border-radius:8px;overflow:hidden;">
        <mui-resizable-panel [defaultSize]="50" style="padding:16px;">
          <p style="margin:0;font-size:14px;">Left panel</p>
        </mui-resizable-panel>
        <mui-resizable-handle [withHandle]="true" />
        <mui-resizable-panel [defaultSize]="50" style="padding:16px;">
          <p style="margin:0;font-size:14px;">Right panel</p>
        </mui-resizable-panel>
      </mui-resizable-panel-group>
    `,
    imports: IMPORTS,
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `
      <mui-resizable-panel-group direction="vertical" style="height:400px;border:1px solid var(--mui-color-border);border-radius:8px;overflow:hidden;">
        <mui-resizable-panel [defaultSize]="50" style="padding:16px;">
          <p style="margin:0;font-size:14px;">Top panel</p>
        </mui-resizable-panel>
        <mui-resizable-handle [withHandle]="true" />
        <mui-resizable-panel [defaultSize]="50" style="padding:16px;">
          <p style="margin:0;font-size:14px;">Bottom panel</p>
        </mui-resizable-panel>
      </mui-resizable-panel-group>
    `,
    imports: IMPORTS,
  }),
};

export const ThreePanels: Story = {
  render: () => ({
    template: `
      <mui-resizable-panel-group style="height:300px;border:1px solid var(--mui-color-border);border-radius:8px;overflow:hidden;">
        <mui-resizable-panel [defaultSize]="25" [minSize]="15" style="padding:16px;">
          <p style="margin:0;font-size:13px;">Sidebar</p>
        </mui-resizable-panel>
        <mui-resizable-handle [withHandle]="true" />
        <mui-resizable-panel [defaultSize]="50" [minSize]="20" style="padding:16px;">
          <p style="margin:0;font-size:13px;">Main</p>
        </mui-resizable-panel>
        <mui-resizable-handle [withHandle]="true" />
        <mui-resizable-panel [defaultSize]="25" [minSize]="15" style="padding:16px;">
          <p style="margin:0;font-size:13px;">Detail</p>
        </mui-resizable-panel>
      </mui-resizable-panel-group>
    `,
    imports: IMPORTS,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <p id="rg-desc" style="margin:0 0 8px;font-size:13px;color:var(--mui-color-text-muted);">
        Use arrow keys on the separator to resize panels. Shift+Arrow moves 10%.
      </p>
      <mui-resizable-panel-group
        aria-describedby="rg-desc"
        style="height:300px;border:1px solid var(--mui-color-border);border-radius:8px;overflow:hidden;"
      >
        <mui-resizable-panel [defaultSize]="50" style="padding:16px;" aria-label="Left panel">
          <p style="margin:0;font-size:14px;">Left panel</p>
        </mui-resizable-panel>
        <mui-resizable-handle [withHandle]="true" aria-label="Resize panels" />
        <mui-resizable-panel [defaultSize]="50" style="padding:16px;" aria-label="Right panel">
          <p style="margin:0;font-size:14px;">Right panel</p>
        </mui-resizable-panel>
      </mui-resizable-panel-group>
    `,
    imports: IMPORTS,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;">
        <mui-resizable-panel-group direction="vertical" style="height:500px;border:1px solid var(--mui-color-border);border-radius:8px;overflow:hidden;">
          <mui-resizable-panel [defaultSize]="60" [minSize]="30" style="padding:16px;background:var(--mui-color-surface);">
            <p style="margin:0;font-size:14px;">Main content</p>
          </mui-resizable-panel>
          <mui-resizable-handle [withHandle]="true" />
          <mui-resizable-panel [defaultSize]="40" [minSize]="20" style="padding:16px;background:var(--mui-color-surface-raised);">
            <p style="margin:0;font-size:14px;">Details pane</p>
          </mui-resizable-panel>
        </mui-resizable-panel-group>
      </div>
    `,
    imports: IMPORTS,
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
