import { DetoxCounters, ExtensionConfig } from '../types';

/**
 * Default configuration for the extension
 */
export const DEFAULT_CONFIG: ExtensionConfig = {
  enabled: true,
  showToast: true,
  toastPosition: 'top-right',
  removeAds: true,
  removeSuggestions: true,
  removeShorts: true,
  removeDisguisedShorts: true
};

/**
 * Default counters
 */
export const DEFAULT_COUNTERS: DetoxCounters = {
  ads: 0,
  suggestions: 0,
  shelfShorts: 0,
  disguisedShorts: 0
};

/**
 * Storage utility for Chrome extension
 */
export class StorageManager {
  /**
   * Get configuration from storage
   */
  static async getConfig(): Promise<ExtensionConfig> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['config'], (result) => {
        resolve(result.config || DEFAULT_CONFIG);
      });
    });
  }

  /**
   * Save configuration to storage
   */
  static async setConfig(config: ExtensionConfig): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ config }, resolve);
    });
  }

  /**
   * Get counters from storage
   */
  static async getCounters(): Promise<DetoxCounters> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['counters'], (result) => {
        resolve(result.counters || DEFAULT_COUNTERS);
      });
    });
  }

  /**
   * Save counters to storage
   */
  static async setCounters(counters: DetoxCounters): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ counters }, resolve);
    });
  }

  /**
   * Reset counters to zero
   */
  static async resetCounters(): Promise<void> {
    return this.setCounters(DEFAULT_COUNTERS);
  }

  /**
   * Increment a specific counter
   */
  static async incrementCounter(key: keyof DetoxCounters): Promise<void> {
    const counters = await this.getCounters();
    counters[key]++;
    await this.setCounters(counters);
  }
} 