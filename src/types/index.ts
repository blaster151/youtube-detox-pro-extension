// Shared types across the extension
export interface DetoxCounters {
  ads: number;
  suggestions: number;
  shelfShorts: number;
  disguisedShorts: number;
}

export interface ExtensionConfig {
  enabled: boolean;
  showToast: boolean;
  toastPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  removeAds: boolean;
  removeSuggestions: boolean;
  removeShorts: boolean;
  removeDisguisedShorts: boolean;
}

// Message types for communication between content script and background
export type MessageRequest = 
  | { type: 'GET_STATS' }
  | { type: 'UPDATE_STATS'; counters: DetoxCounters }
  | { type: 'GET_CONFIG' }
  | { type: 'UPDATE_CONFIG'; config: Partial<ExtensionConfig> }
  | { type: 'RESET_STATS' };

export type MessageResponse = 
  | { type: 'STATS'; counters: DetoxCounters }
  | { type: 'CONFIG'; config: ExtensionConfig }
  | { type: 'SUCCESS'; message: string }
  | { type: 'ERROR'; error: string };

// Element types for DOM manipulation
export interface ElementSelector {
  tagName?: string;
  id?: string;
  className?: string;
  attributes?: Record<string, string>;
}

export interface RemovalRule {
  name: string;
  selector: string | ElementSelector;
  condition?: (element: HTMLElement) => boolean;
  counter: keyof DetoxCounters;
} 