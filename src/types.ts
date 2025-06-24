import React from 'react';

/**
 * Type for block data that can be passed to onChange
 * Uses a mapped type to avoid circular references
 */
type Primitive = string | number | boolean | null | undefined;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = Primitive | JsonArray | JsonObject;

export type BlockData = JsonObject;

/**
 * Base properties for all blocks
 */
export interface BlockProps {
  /**
   * Unique identifier for the block
   */
  id: string;
  
  /**
   * Optional CSS class name
   */
  className?: string;
  
  /**
   * Callback fired when the block data changes
   */
  onChange?: (id: string, data: BlockData) => void;
}

/**
 * Properties for blocks that contain other blocks
 */
export interface ContainerBlockProps extends BlockProps {
  /**
   * Child elements
   */
  children: React.ReactNode;
}

/**
 * Block type identifiers
 */
export type BlockType = 
  | 'text'
  | 'media'
  | 'data'
  | 'code'
  | 'embed'
  | 'interactive'
  | 'ai'
  | 'connector';

/**
 * Basic block data structure
 */
export interface SerializedBlock {
  id: string;
  type: BlockType;
  data: BlockData;
} 