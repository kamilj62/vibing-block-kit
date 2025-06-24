import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BlockModal, TextBlock, FormBlock } from '@vibing-ai/block-kit';

// Define interface for the story props
interface BlockModalStoryProps {
  id?: string;
  title?: string;
  isOpen?: boolean;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children?: React.ReactNode;
}

// Define the props interface locally
interface BlockModalProps {
  id?: string;
  title?: string;
  isOpen?: boolean;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children?: React.ReactNode;
}

const meta: Meta<BlockModalProps> = {
  title: 'Surfaces/Modal/BlockModal',
  component: BlockModal as React.ComponentType<BlockModalProps>,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    size: { 
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full']
    },
    onClose: { action: 'closed' }
  },
};

export default meta;
type Story = StoryObj<BlockModalStoryProps>;

export const Basic: Story = {
  args: {
    id: 'block-modal-example',
    title: 'Information',
    isOpen: true,
    onClose: () => {},
    children: (
      <TextBlock
        id="modal-text"
        text="This is a modal dialog that can contain any Block Kit component. It provides a focused way to present information or gather user input."
      />
    ),
  },
};

export const WithForm: Story = {
  args: {
    id: 'block-modal-form-example',
    title: 'Create New Project',
    isOpen: true,
    onClose: () => {},
    size: 'md',
    children: (
      <div style={{ padding: '16px' }}>
        <FormBlock 
          id="modal-form" 
          fields={[
            {
              id: 'projectName',
              type: 'text',
              label: 'Project Name',
              value: '',
              required: true,
              placeholder: 'Enter project name'
            },
            {
              id: 'description',
              type: 'textarea',
              label: 'Description',
              value: '',
              placeholder: 'Enter project description'
            },
            {
              id: 'category',
              type: 'select',
              label: 'Category',
              value: '',
              options: [
                { label: 'Web Development', value: 'web' },
                { label: 'Mobile App', value: 'mobile' },
                { label: 'Data Science', value: 'data' },
                { label: 'Artificial Intelligence', value: 'ai' }
              ]
            }
          ]}
          submitLabel="Create Project"
          cancelLabel="Cancel"
          onSubmit={(data) => console.log('Form submitted:', data)}
        />
      </div>
    )
  },
};

export const FullScreen: Story = {
  args: {
    id: 'block-modal-fullscreen-example',
    title: 'Document Preview',
    isOpen: true,
    onClose: () => {},
    size: 'full',
    children: React.createElement('div', { style: { padding: '20px' } },
      <TextBlock
        id="fullscreen-text"
        text="This is a fullscreen modal that can be used for detailed views or complex interactions. It provides maximum space while still maintaining the modal context."
      />,
      React.createElement('div', { 
        style: { 
          height: '400px', 
          background: '#f8fafc', 
          marginTop: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        } 
      }, "Document preview content would appear here")
    ),
  },
}; 