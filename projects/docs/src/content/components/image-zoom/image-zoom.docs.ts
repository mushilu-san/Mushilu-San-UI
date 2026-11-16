import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'image-zoom',
  name: 'Image zoom',
  group: 'data-display',
  selector: 'mui-image-zoom',
  apiClasses: ['ImageZoom'],
  summary: 'A thumbnail that opens the image enlarged in a dialog.',
  description: [
    'Image zoom shows a thumbnail button. Activating it opens the image larger in a native modal dialog with an optional caption. Escape closes it and focus returns to the thumbnail.',
  ],
  whenToUse: ['Certificates, screenshots and diagrams that need a closer look.'],
  whenNotToUse: [{ text: 'Several images to browse. Use a carousel.', alternative: 'carousel' }],
  demos: [
    {
      id: 'image-zoom-basic',
      title: 'A certificate',
      component: () => import('./demos/image-zoom-basic.demo').then((m) => m.ImageZoomBasicDemo),
    },
  ],
  guidelines: {
    do: ['Write real `alt` text, since it names the trigger and the dialog.'],
    dont: ['Do not use decorative images.'],
  },
  a11y: {
    roles: [
      { element: 'trigger', role: 'button', notes: 'Named by the enlarge label and the alt text.' },
      { element: 'dialog', role: 'dialog', notes: 'Modal, named by the alt text.' },
    ],
    keyboard: [
      { keys: 'Enter / Space', action: 'Opens the dialog.' },
      { keys: 'Escape', action: 'Closes it and returns focus.' },
      { keys: 'Tab', action: 'Stays inside the dialog.' },
    ],
    notes: [],
  },
  tokens: ['--mui-color-overlay', '--mui-color-surface', '--mui-radius-lg'],
  related: ['carousel'],
};
