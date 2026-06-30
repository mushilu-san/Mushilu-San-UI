import { addons } from 'storybook/manager-api';
import { mushiluTheme } from './mushilu-theme';

addons.setConfig({
  theme: mushiluTheme,
  sidebar: {
    showRoots: true,
  },
  toolbar: {
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
