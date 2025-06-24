import type { Meta, StoryObj } from '@storybook/react';
import { FormBlock } from '@vibing-ai/block-kit';

const meta: Meta<typeof FormBlock> = {
  title: 'Blocks/Interactive/FormBlock',
  component: FormBlock,
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
};

export default meta;
type Story = StoryObj<typeof FormBlock>;

export const Basic: Story = {
  args: {
    id: 'form-block-example',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        value: '',
        required: true,
        placeholder: 'Enter your name'
      },
      {
        id: 'email',
        type: 'text',
        label: 'Email',
        value: '',
        required: true,
        placeholder: 'Enter your email'
      }
    ],
    submitLabel: 'Submit',
    cancelLabel: 'Cancel'
  },
  render: (args) => <FormBlock {...args} />,
};

export const WithCustomLabels: Story = {
  args: {
    id: 'form-block-custom-labels-example',
    fields: [
      {
        id: 'feedback',
        type: 'textarea',
        label: 'Your Feedback',
        value: '',
        required: true,
        placeholder: 'Enter your feedback here'
      }
    ],
    submitLabel: 'Send Feedback',
    cancelLabel: 'Maybe Later'
  },
  render: (args) => <FormBlock {...args} />,
};

export const WithSelectField: Story = {
  args: {
    id: 'form-block-select-example',
    fields: [
      {
        id: 'preference',
        type: 'select',
        label: 'Your Preference',
        value: '',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }
        ]
      }
    ],
    submitLabel: 'Save Preference',
    cancelLabel: undefined // This will hide the cancel button
  },
  render: (args) => <FormBlock {...args} />
}; 