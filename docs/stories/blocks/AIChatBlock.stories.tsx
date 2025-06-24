import type { Meta, StoryObj } from '@storybook/react';
import { AIChatBlock } from '@vibing-ai/block-kit';
import { v4 as uuidv4 } from 'uuid';

const meta: Meta<typeof AIChatBlock> = {
  title: 'Blocks/AI/AIChatBlock',
  component: AIChatBlock,
  tags: ['autodocs'],
  argTypes: {
    messages: { control: 'object' },
    isLoading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof AIChatBlock>;

export const Basic: Story = {
  args: {
    messages: [
      { 
        id: uuidv4(),
        role: 'system' as const, 
        content: 'I am an AI assistant here to help you with coding questions.',
        timestamp: new Date()
      },
      { 
        id: uuidv4(),
        role: 'user' as const, 
        content: 'How do I create a React component?',
        timestamp: new Date()
      },
      { 
        id: uuidv4(),
        role: 'assistant' as const, 
        content: 'To create a React component, you can use either a function or a class. Here is a simple functional component example:\n\n```jsx\nimport * as React from \'react\';\n\nconst MyComponent = ({ name }) => {\n  return <div>Hello, {name}!</div>;\n};\n\nexport default MyComponent;\n```\n\nYou would then use it in your application like this:\n\n```jsx\nimport MyComponent from \'./MyComponent\';\n\nfunction App() {\n  return <MyComponent name="World" />;\n}\n```',
        timestamp: new Date()
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    messages: [
      { 
        id: uuidv4(),
        role: 'user' as const, 
        content: 'What is the capital of France?',
        timestamp: new Date()
      },
    ],
    isLoading: true,
  },
};

export const WithAvatars: Story = {
  args: {
    messages: [
      { 
        id: uuidv4(),
        role: 'assistant' as const, 
        content: 'I can help you with various topics. What would you like to know about?',
        timestamp: new Date()
      },
      { 
        id: uuidv4(),
        role: 'user' as const, 
        content: 'Tell me about React hooks.',
        timestamp: new Date()
      },
      { 
        id: uuidv4(),
        role: 'assistant' as const, 
        content: 'React Hooks are functions that let you "hook into" React state and lifecycle features from function components.',
        timestamp: new Date()
      },
    ],
  },
}; 