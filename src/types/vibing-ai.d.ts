declare module '@vibing-ai/block-kit' {
  import { ComponentType } from 'react';
  
  // Re-export your components here
  export const CleanImageBlock: ComponentType<any>;
  export const ImageBlock: ComponentType<any>;
  // Add other components as needed
}

declare module '@vibing-ai/block-kit/*' {
  const component: any;
  export default component;
}
