import type { Meta, StoryObj } from '@storybook/angular';
import { SwipeAction } from './swipe-action';
import type { SwipeActionItem } from './swipe-action.types';

const meta: Meta = {
  title: 'Mobile/SwipeAction',
  component: SwipeAction,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const rightActions: SwipeActionItem[] = [
  { key: 'delete', label: 'Delete', side: 'right', color: 'danger' },
];

const bothActions: SwipeActionItem[] = [
  { key: 'star', label: 'Star', side: 'left', color: 'warning' },
  { key: 'archive', label: 'Archive', side: 'right', color: 'primary' },
  { key: 'delete', label: 'Delete', side: 'right', color: 'danger' },
];

const rowStyle = `padding:16px;background:var(--mui-color-surface-raised);display:flex;align-items:center;gap:12px;`;

export const Default: Story = {
  render: () => ({
    imports: [SwipeAction],
    props: {
      actions: rightActions,
      lastAction: '',
      onAction: (_key: string) => {
        /* handled in template */
      },
    },
    template: `
      <div style="width:375px;">
        <p style="padding:8px 16px;font-family:sans-serif;font-size:14px;color:var(--mui-color-text-muted);">
          Swipe left to reveal delete action
        </p>
        <mui-swipe-action [actions]="actions" (actionTriggered)="lastAction=$event">
          <div style="${rowStyle}">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--mui-color-primary-subtle);flex-shrink:0;"></div>
            <div>
              <div style="font-weight:500;color:var(--mui-color-text);">Email subject line</div>
              <div style="font-size:14px;color:var(--mui-color-text-muted);">Preview of the message…</div>
            </div>
          </div>
        </mui-swipe-action>
        @if (lastAction) {
          <p style="padding:8px 16px;font-family:sans-serif;font-size:14px;color:var(--mui-color-primary);">Triggered: {{ lastAction }}</p>
        }
      </div>
    `,
  }),
};

export const BothSides: Story = {
  render: () => ({
    imports: [SwipeAction],
    props: { actions: bothActions, lastAction: '' },
    template: `
      <div style="width:375px;">
        <p style="padding:8px 16px;font-family:sans-serif;font-size:14px;color:var(--mui-color-text-muted);">
          Swipe right → Star &nbsp;|&nbsp; Swipe left → Archive / Delete
        </p>
        <mui-swipe-action [actions]="actions" (actionTriggered)="lastAction=$event">
          <div style="${rowStyle}">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--mui-color-success-subtle);flex-shrink:0;"></div>
            <div>
              <div style="font-weight:500;color:var(--mui-color-text);">Message from Alice</div>
              <div style="font-size:14px;color:var(--mui-color-text-muted);">Hey, are you free tomorrow?</div>
            </div>
          </div>
        </mui-swipe-action>
        @if (lastAction) {
          <p style="padding:8px 16px;font-family:sans-serif;font-size:14px;color:var(--mui-color-primary);">Triggered: {{ lastAction }}</p>
        }
      </div>
    `,
  }),
};

export const List: Story = {
  render: () => ({
    imports: [SwipeAction],
    props: {
      items: ['Design review', 'Sprint planning', 'Code review', 'Team standup'],
      actions: rightActions,
      removed: [] as string[],
    },
    template: `
      <div style="width:375px;">
        @for (item of items; track item) {
          @if (!removed.includes(item)) {
            <mui-swipe-action [actions]="actions" (actionTriggered)="removed.push(item)">
              <div style="${rowStyle}">
                <span style="color:var(--mui-color-text);">{{ item }}</span>
              </div>
            </mui-swipe-action>
          }
        }
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    imports: [SwipeAction],
    props: { actions: bothActions, lastAction: '' },
    template: `
      <div style="width:375px;">
        <p style="padding:8px 16px;font-family:sans-serif;font-size:13px;color:var(--mui-color-text-muted);">
          Tab to focus the row — a "More actions" button appears. Keyboard/AT users can also reach the hidden action buttons below.
        </p>
        <mui-swipe-action [actions]="actions" (actionTriggered)="lastAction=$event">
          <div style="${rowStyle}">
            <span style="color:var(--mui-color-text);">Accessible list row</span>
          </div>
        </mui-swipe-action>
        @if (lastAction) {
          <p style="padding:8px 16px;font-family:sans-serif;font-size:14px;color:var(--mui-color-primary);">Triggered: {{ lastAction }}</p>
        }
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    imports: [SwipeAction],
    props: { actions: rightActions },
    template: `
      <div style="width:375px;background:var(--mui-color-bg);">
        @for (n of [1,2,3,4]; track n) {
          <mui-swipe-action [actions]="actions">
            <div style="${rowStyle}">
              <div style="width:36px;height:36px;border-radius:50%;background:var(--mui-color-primary-subtle);flex-shrink:0;"></div>
              <div style="color:var(--mui-color-text);">List item {{ n }}</div>
            </div>
          </mui-swipe-action>
        }
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
