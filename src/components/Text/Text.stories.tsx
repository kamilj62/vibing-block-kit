
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';
import type { TextProps } from './Text';

// Define the meta information for the Text component
const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label'],
      description: 'The HTML element to render',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
      description: 'The size of the text',
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'The font weight of the text',
    },
    color: {
      control: 'color',
      description: 'The color of the text',
    },
    textAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'The text alignment',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    p: {
      control: 'text',
      description: 'Margin padding (shorthand for padding)',
    },
    px: {
      control: 'text',
      description: 'Padding X (left and right)',
    },
    py: {
      control: 'text',
      description: 'Padding Y (top and bottom)',
    },
    borderBottom: {
      control: 'text',
      description: 'Border bottom style',
    },
    borderColor: {
      control: 'color',
      description: 'Border color',
    },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
    as: 'p',
    size: 'md',
    weight: 'normal',
  } as TextProps,
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof Text>;

// Create a basic story
export const Default: Story = {};

// Story with different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Text as="h1" size="4xl">Heading 1 (4xl)</Text>
      <Text as="h2" size="3xl">Heading 2 (3xl)</Text>
      <Text as="h3" size="2xl">Heading 3 (2xl)</Text>
      <Text as="h4" size="xl">Heading 4 (xl)</Text>
      <Text as="h5" size="lg">Heading 5 (lg)</Text>
      <Text as="h6">Heading 6 (default)</Text>
      <Text size="sm">Small text (sm)</Text>
      <Text size="xs">Extra small text (xs)</Text>
    </div>
  ),
};

// Story with different weights
export const Weights: Story = {
  render: () => (
    <div className="space-y-2">
      <Text weight="normal">Normal weight</Text>
      <Text weight="medium">Medium weight</Text>
      <Text weight="semibold">Semibold weight</Text>
      <Text weight="bold">Bold weight</Text>
    </div>
  ),
};

// Story with different colors
export const Colors: Story = {
  render: () => (
    <div className="space-y-2">
      <Text>Default text color</Text>
      <Text color="#4a90e2">Custom blue color</Text>
      <Text color="#e24a4a">Custom red color</Text>
      <Text color="#4ae27a">Custom green color</Text>
    </div>
  ),
};

// Story with different alignments
export const Alignments: Story = {
  render: () => (
    <div className="space-y-4">
      <Text textAlign="left" className="block border p-2">Left aligned text (default)</Text>
      <Text textAlign="center" className="block border p-2">Center aligned text</Text>
      <Text textAlign="right" className="block border p-2">Right aligned text</Text>
      <div className="block border p-2 w-64 text-justify">
        Justified text that wraps to multiple lines to demonstrate the alignment properly.
        This uses Tailwind&apos;s text-justify class instead of the textAlign prop.
      </div>
    </div>
  ),
};

// Story with custom element
export const CustomElement: Story = {
  render: function Render() {
    return (
      <label htmlFor="input-field" className="block mb-2">
        <Text>This is a label element</Text>
        <input id="input-field" type="text" className="mt-1 block w-full" />
      </label>
    );
  },
};

// Story with border and padding
export const WithBorderAndPadding = () => (
  <div style={{
    borderBottom: '1px solid #e2e8f0',
    padding: '0.5rem 1.5rem',
    margin: '1rem 0',
  }}>
    <Text>Text with border and padding</Text>
  </div>
);
