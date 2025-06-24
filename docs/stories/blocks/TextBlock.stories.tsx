import type { Meta, StoryObj } from '@storybook/react';
import { TextBlock } from '@vibing-ai/block-kit';

const meta: Meta<typeof TextBlock> = {
  title: 'Blocks/Text/TextBlock',
  component: TextBlock,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    type: { 
      control: 'select', 
      options: ['paragraph', 'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6']
    },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof TextBlock>;

export const Basic: Story = {
  args: {
    id: 'text-block-example',
    text: 'This is a basic text block',
  },
};

export const Formatted: Story = {
  args: {
    text: 'This is a heading text block',
    type: 'heading1',
  },
};

export const WithHeading: Story = {
  args: {
    text: 'Text block with a heading',
    type: 'heading1',
  },
};