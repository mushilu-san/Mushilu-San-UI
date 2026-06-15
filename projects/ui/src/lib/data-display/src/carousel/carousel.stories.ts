import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Carousel } from './carousel';
import { CarouselContent } from './carousel-content';
import { CarouselItem } from './carousel-item';
import { CarouselPrev } from './carousel-prev';
import { CarouselNext } from './carousel-next';
import { CarouselDots } from './carousel-dots';

const IMPORTS = [Carousel, CarouselContent, CarouselItem, CarouselPrev, CarouselNext, CarouselDots];

const SLIDE_COLORS = ['#6366f1', '#ec4899', '#14b8a6'];
const SLIDE_LABELS = ['Indigo', 'Pink', 'Teal'];

function slides(count = 3): string {
  return Array.from(
    { length: count },
    (_, i) => `
    <mui-carousel-item>
      <div style="height:200px;display:flex;align-items:center;justify-content:center;
        background:${SLIDE_COLORS[i % SLIDE_COLORS.length]};color:#fff;font-size:24px;
        font-weight:600;border-radius:8px;">
        ${SLIDE_LABELS[i % SLIDE_LABELS.length]} — Slide ${i + 1}
      </div>
    </mui-carousel-item>
  `,
  ).join('');
}

const meta: Meta = {
  title: 'Data Display/Carousel',
  decorators: [moduleMetadata({ imports: IMPORTS })],
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="max-width:500px;">
        <mui-carousel>
          <mui-carousel-content>${slides()}</mui-carousel-content>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;">
            <button muiCarouselPrev></button>
            <mui-carousel-dots></mui-carousel-dots>
            <button muiCarouselNext></button>
          </div>
        </mui-carousel>
      </div>
    `,
  }),
};

export const WithLoop: Story = {
  render: () => ({
    template: `
      <div style="max-width:500px;">
        <mui-carousel [loop]="true">
          <mui-carousel-content>${slides()}</mui-carousel-content>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;">
            <button muiCarouselPrev></button>
            <mui-carousel-dots></mui-carousel-dots>
            <button muiCarouselNext></button>
          </div>
        </mui-carousel>
      </div>
    `,
  }),
};

export const FiveSlides: Story = {
  render: () => ({
    template: `
      <div style="max-width:500px;">
        <mui-carousel>
          <mui-carousel-content>${slides(5)}</mui-carousel-content>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;">
            <button muiCarouselPrev></button>
            <mui-carousel-dots></mui-carousel-dots>
            <button muiCarouselNext></button>
          </div>
        </mui-carousel>
      </div>
    `,
  }),
};

export const DotsOnly: Story = {
  render: () => ({
    template: `
      <div style="max-width:500px;">
        <mui-carousel>
          <mui-carousel-content>${slides()}</mui-carousel-content>
          <div style="display:flex;justify-content:center;margin-top:12px;">
            <mui-carousel-dots></mui-carousel-dots>
          </div>
        </mui-carousel>
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  render: () => ({
    template: `
      <div style="max-width:500px;">
        <mui-carousel label="Featured products carousel">
          <mui-carousel-content>
            <mui-carousel-item>
              <div style="height:200px;background:#6366f1;border-radius:8px;display:flex;align-items:center;
                justify-content:center;color:#fff;font-size:20px;font-weight:600;">
                Product 1
              </div>
            </mui-carousel-item>
            <mui-carousel-item>
              <div style="height:200px;background:#ec4899;border-radius:8px;display:flex;align-items:center;
                justify-content:center;color:#fff;font-size:20px;font-weight:600;">
                Product 2
              </div>
            </mui-carousel-item>
            <mui-carousel-item>
              <div style="height:200px;background:#14b8a6;border-radius:8px;display:flex;align-items:center;
                justify-content:center;color:#fff;font-size:20px;font-weight:600;">
                Product 3
              </div>
            </mui-carousel-item>
          </mui-carousel-content>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;">
            <button muiCarouselPrev></button>
            <mui-carousel-dots></mui-carousel-dots>
            <button muiCarouselNext></button>
          </div>
        </mui-carousel>
        <p style="margin-top:8px;font-size:13px;color:#64748b;">
          Use ← → arrow keys or click Prev/Next to navigate. Tab to dots, use Enter/Space to jump.
        </p>
      </div>
    `,
    imports: IMPORTS,
  }),
  parameters: { a11y: { disable: false } },
};

export const MobilePreview: Story = {
  render: () => ({
    template: `
      <div style="width:375px;">
        <mui-carousel label="Image gallery">
          <mui-carousel-content>${slides(3)}</mui-carousel-content>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;">
            <button muiCarouselPrev></button>
            <mui-carousel-dots></mui-carousel-dots>
            <button muiCarouselNext></button>
          </div>
        </mui-carousel>
      </div>
    `,
    imports: IMPORTS,
  }),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
