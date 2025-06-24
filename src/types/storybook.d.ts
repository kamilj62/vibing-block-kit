import type { StoryFn, Meta, StoryObj, Decorator, Parameters } from '@storybook/react';
import type { ReactNode } from 'react';

declare module '@storybook/react' {
  interface Parameters {
    /**
     * Set to `true` to disable Chromatic snapshots for this story
     * @default false
     */
    chromatic?: {
      disableSnapshot?: boolean;
      disable?: boolean;
      viewports?: number[];
    };
    /**
     * Set to `true` to disable the docs page for this story
     * @default false
     */
    docs?: {
      disable?: boolean;
      page?: any;
      description?: {
        component?: string;
      };
      source?: {
        code?: string;
        language?: string;
      };
    };
    /**
     * Set to `true` to disable the controls for this story
     * @default false
     */
    controls?: {
      disable?: boolean;
      expanded?: boolean;
      matchers?: {
        color?: RegExp | string[];
        date?: RegExp | string[];
      };
    };
  }

  export interface StoryContext<Args = ArgsType> {
    id: string;
    kind: string;
    name: string;
    parameters: Parameters;
    args: Args;
    argTypes: ArgTypes<Args>;
    globals: Record<string, any>;
    [key: string]: any;
  }

  export interface ArgTypes<TArgs = ArgsType> {
    [key: string]: {
      name?: string;
      description?: string;
      defaultValue?: any;
      [key: string]: any;
    };
  }

  export type ArgsType = Record<string, any>;

  export type Story<Args = ArgsType> = StoryObj<Args>;

  export type StoryDecorator<Args = ArgsType> = Decorator<Args>;

  export type StoryMeta<Args = ArgsType> = Meta<Args>;

  export interface StoryObj<Args = ArgsType> {
    args?: Partial<Args>;
    argTypes?: ArgTypes<Args>;
    decorators?: StoryDecorator<Args>[];
    parameters?: Parameters;
    play?: (context: StoryContext<Args>) => Promise<void> | void;
    render?: (args: Args, context: StoryContext<Args>) => ReactNode;
  }
}

// Extend global window for storybook specific globals
declare global {
  interface Window {
    __STORYBOOK_ADDONS_CHANNEL__: any;
    __STORYBOOK_CLIENT_API__: any;
    __STORYBOOK_PREVIEW__: any;
    __STORYBOOK_STORY_STORE__: any;
  }
}
