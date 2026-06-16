import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { MobileNav } from './mobile-nav';
import { MobileNavItem } from './mobile-nav-item';

const HomeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const SearchIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
const HeartIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const BellIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;
const UserIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

const meta: Meta<MobileNav> = {
  title: 'Mobile/MobileNav',
  component: MobileNav,
  decorators: [moduleMetadata({ imports: [MobileNav, MobileNavItem] })],
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<MobileNav>;

export const Default: Story = {
  render: () => ({
    props: { active: 'home' },
    template: `
      <div style="width:375px;position:relative;">
        <mui-mobile-nav [(activeItem)]="active">
          <mui-mobile-nav-item value="home" label="Home">${HomeIcon}</mui-mobile-nav-item>
          <mui-mobile-nav-item value="search" label="Search">${SearchIcon}</mui-mobile-nav-item>
          <mui-mobile-nav-item value="likes" label="Likes">${HeartIcon}</mui-mobile-nav-item>
          <mui-mobile-nav-item value="profile" label="Profile">${UserIcon}</mui-mobile-nav-item>
        </mui-mobile-nav>
      </div>
    `,
  }),
};

export const WithBadges: Story = {
  render: () => ({
    props: { active: 'home' },
    template: `
      <div style="width:375px;">
        <mui-mobile-nav [(activeItem)]="active">
          <mui-mobile-nav-item value="home" label="Home">${HomeIcon}</mui-mobile-nav-item>
          <mui-mobile-nav-item value="notifs" label="Alerts" [badge]="5">${BellIcon}</mui-mobile-nav-item>
          <mui-mobile-nav-item value="likes" label="Likes" [badge]="128">${HeartIcon}</mui-mobile-nav-item>
          <mui-mobile-nav-item value="profile" label="Profile">${UserIcon}</mui-mobile-nav-item>
        </mui-mobile-nav>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    props: { active: 'home' },
    template: `
      <div style="width:375px;">
        <!-- nav landmark + aria-current="page" on active item -->
        <mui-mobile-nav [(activeItem)]="active">
          <mui-mobile-nav-item value="home" label="Home">${HomeIcon}</mui-mobile-nav-item>
          <mui-mobile-nav-item value="search" label="Search">${SearchIcon}</mui-mobile-nav-item>
          <mui-mobile-nav-item value="profile" label="Profile">${UserIcon}</mui-mobile-nav-item>
        </mui-mobile-nav>
      </div>
    `,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    props: { active: 'home' },
    template: `
      <div style="width:375px;height:667px;display:flex;flex-direction:column;background:var(--mui-color-bg);">
        <div style="flex:1;padding:16px;font-family:var(--mui-font-sans);color:var(--mui-color-text);">
          Page content
        </div>
        <mui-mobile-nav [(activeItem)]="active">
          <mui-mobile-nav-item value="home" label="Home">${HomeIcon}</mui-mobile-nav-item>
          <mui-mobile-nav-item value="search" label="Search">${SearchIcon}</mui-mobile-nav-item>
          <mui-mobile-nav-item value="notifs" label="Alerts" [badge]="3">${BellIcon}</mui-mobile-nav-item>
          <mui-mobile-nav-item value="profile" label="Profile">${UserIcon}</mui-mobile-nav-item>
        </mui-mobile-nav>
      </div>
    `,
  }),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
