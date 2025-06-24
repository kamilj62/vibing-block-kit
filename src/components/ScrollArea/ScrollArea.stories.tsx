import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './ScrollArea';

// Define the meta information for the ScrollArea component
const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
      description: 'The orientation of the scroll area',
    },
    autoHide: {
      control: 'boolean',
      description: 'Whether to automatically hide the scrollbar when not scrolling',
    },
    hideScrollbar: {
      control: 'boolean',
      description: 'Whether to hide the scrollbar completely',
    },
  },
  args: {
    className: 'h-[200px] w-[300px]',
    orientation: 'vertical',
    autoHide: false,
    hideScrollbar: false,
  },
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

// Create a basic story
export const Default: Story = {
  render: (args) => (
    <ScrollArea {...args}>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Scrollable Content</h3>
        <div className="space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-2 border rounded">
              Scrollable item {i + 1}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
};

// Story with horizontal scrolling
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    className: 'w-[300px]',
  },
  render: (args) => (
    <ScrollArea {...args}>
      <div className="flex space-x-4 p-4" style={{ width: '600px' }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// Story with auto-hide scrollbar
export const AutoHide: Story = {
  args: {
    autoHide: true,
  },
  render: (args) => (
    <ScrollArea {...args}>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Auto-hide Scrollbar</h3>
        <div className="space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-2 border rounded">
              Scrollable item {i + 1} (scrollbar auto-hides)
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
};
