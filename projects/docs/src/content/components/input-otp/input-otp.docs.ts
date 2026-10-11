import type { ComponentDoc } from '../../types';

export const doc: ComponentDoc = {
  slug: 'input-otp',
  name: 'Input OTP',
  group: 'forms',
  selector: 'mui-input-otp',
  apiClasses: ['InputOtp'],
  summary: 'Fixed-length code entry, one character per box, for one-time passwords.',
  description: [
    'Input OTP renders one box per character inside a `role="group"`. Each box has an accessible name such as "Digit 2 of 6", so screen reader users know where they are.',
    'Typing moves focus to the next box, Backspace clears the current box and moves back, and the arrow keys move between boxes. Set `length` to match the code you expect.',
  ],
  whenToUse: [
    'Entering a verification code sent by SMS or an authenticator app.',
    'Any fixed-length code where each character is entered separately.',
  ],
  whenNotToUse: [{ text: 'Free-form text of unknown length. Use an input.', alternative: 'input' }],
  demos: [
    {
      id: 'input-otp-basic',
      title: 'Six digit code',
      component: () => import('./demos/input-otp-basic.demo').then((m) => m.InputOtpBasicDemo),
    },
  ],
  guidelines: {
    do: [
      'Offer a way to resend the code close to the input.',
      'Tell the user where the code was sent.',
    ],
    dont: [
      'Do not auto-submit on a partial code.',
      'Do not split one code across several unrelated inputs.',
    ],
  },
  a11y: {
    roles: [
      { element: 'host', role: 'group', notes: '`aria-label` is "One-time password".' },
      {
        element: 'each box',
        role: '—',
        notes: 'Named "Digit N of L". Disabled boxes get `aria-disabled="true"`.',
      },
    ],
    keyboard: [
      { keys: 'Digits / letters', action: 'Fill the current box and move focus to the next one.' },
      {
        keys: 'Backspace',
        action: 'Clears the current box, or moves back and clears the previous one.',
      },
      { keys: 'ArrowLeft / ArrowRight', action: 'Move between boxes (reversed in RTL).' },
    ],
    notes: [
      'Describe the expected code near the group, for example "Enter the 6-digit code from your app".',
    ],
  },
  tokens: [
    '--mui-color-surface',
    '--mui-color-border',
    '--mui-color-focus-ring',
    '--mui-touch-target',
    '--mui-radius-md',
  ],
  related: ['input'],
};
