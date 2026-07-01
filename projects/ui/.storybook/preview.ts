import type { Preview, Decorator } from '@storybook/angular';
import { mushiluTheme } from './mushilu-theme';

const themeDecorator: Decorator = (story, context) => {
  const theme = context.globals?.['theme'] ?? 'light';
  document.documentElement.setAttribute('data-theme', theme);
  return story();
};

const preview: Preview = {
  decorators: [themeDecorator],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    backgrounds: { value: 'surface' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      theme: mushiluTheme,
    },
    viewport: {
      options: {
        mobile: {
          name: 'Mobile (375 x 812)',
          styles: { width: '375px', height: '812px' },
          type: 'mobile',
        },
        mobileLandscape: {
          name: 'Mobile Landscape (812 x 375)',
          styles: { width: '812px', height: '375px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet (768 x 1024)',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop (1280 x 900)',
          styles: { width: '1280px', height: '900px' },
          type: 'desktop',
        },
        desktopWide: {
          name: 'Desktop Wide (1536 x 900)',
          styles: { width: '1536px', height: '900px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'mobile',
    },
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: 'var(--mui-color-bg, #ffffff)' },
        { name: 'muted', value: 'var(--mui-color-surface, #f8fafc)' },
        { name: 'dark', value: '#0f172a' },
        { name: 'contrast', value: '#000000' },
      ],
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: 'requiredFirst',
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
          { id: 'keyboard-access', enabled: true },
          { id: 'focus-visible', enabled: true },
        ],
      },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Design Tokens',
          'Primitives',
          ['Overview', '*'],
          'Forms',
          ['Overview', '*'],
          'Layout',
          ['Overview', '*'],
          'Navigation',
          ['Overview', '*'],
          'Feedback',
          ['Overview', '*'],
          'Data Display',
          ['Overview', '*'],
          'Overlays',
          ['Overview', '*'],
          'Mobile',
          ['Overview', '*'],
        ],
      },
    },
  },
};

export default preview;
