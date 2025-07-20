import { DetoxCounters, ExtensionConfig, RemovalRule } from '../types';
import { StorageManager } from '../utils/storage';

/**
 * Service for handling YouTube content detoxification
 */
export class DetoxService {
  private config: ExtensionConfig = {
    enabled: true,
    showToast: true,
    toastPosition: 'top-right',
    removeAds: true,
    removeSuggestions: true,
    removeShorts: true,
    removeDisguisedShorts: true
  };

  private counters: DetoxCounters = {
    ads: 0,
    suggestions: 0,
    shelfShorts: 0,
    disguisedShorts: 0
  };

  private toastElement: HTMLElement | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the service
   */
  private async initialize(): Promise<void> {
    this.config = await StorageManager.getConfig();
    this.counters = await StorageManager.getCounters();
    this.createToast();
    this.startObserver();
  }

  /**
   * Create the floating toast element
   */
  private createToast(): void {
    if (!this.config.showToast) return;

    this.toastElement = document.createElement('div');
    this.toastElement.id = 'detox-toast';
    this.toastElement.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-family: sans-serif;
      z-index: 999999;
      pointer-events: none;
      box-shadow: 0 0 5px rgba(0,0,0,0.5);
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(this.toastElement);
    this.updateToast();
  }

  /**
   * Update the toast content
   */
  private updateToast(): void {
    if (!this.toastElement) return;

    this.toastElement.innerText = `🔥 Removed: ${this.counters.ads} Ads | ${this.counters.suggestions} Suggestions | ${this.counters.shelfShorts} Shelf Shorts | ${this.counters.disguisedShorts} Disguised Shorts`;
  }

  /**
   * Check if an element is a disguised short
   */
  private isDisguisedShort(node: HTMLElement): boolean {
    return node.tagName === 'YTD-VIDEO-RENDERER' && (
      node.querySelector('badge-shape[aria-label="Shorts"]') !== null ||
      node.querySelector('a[href^="/shorts/"]') !== null
    );
  }

  /**
   * Check if an element matches removal criteria
   */
  private shouldRemoveElement(node: HTMLElement): { shouldRemove: boolean; counter?: keyof DetoxCounters } {
    if (!this.config.enabled) return { shouldRemove: false };

    // Sponsored Ads
    if (this.config.removeAds && node.tagName === 'YTD-AD-SLOT-RENDERER') {
      return { shouldRemove: true, counter: 'ads' };
    }

    // "People also watched", "Previously watched"
    if (this.config.removeSuggestions && 
        node.id === 'dismissible' &&
        /People (also )?watched|Previously watched/i.test(node.textContent || '')) {
      return { shouldRemove: true, counter: 'suggestions' };
    }

    // Shorts shelf
    if (this.config.removeShorts &&
        node.tagName === 'GRID-SHELF-VIEW-MODEL' &&
        /Shorts/i.test(node.textContent || '')) {
      return { shouldRemove: true, counter: 'shelfShorts' };
    }

    // Disguised Shorts
    if (this.config.removeDisguisedShorts && this.isDisguisedShort(node)) {
      return { shouldRemove: true, counter: 'disguisedShorts' };
    }

    return { shouldRemove: false };
  }

  /**
   * Remove an element and update counters
   */
  private async removeElement(node: HTMLElement, counter: keyof DetoxCounters): Promise<void> {
    node.remove();
    this.counters[counter]++;
    await StorageManager.setCounters(this.counters);
    this.updateToast();
  }

  /**
   * Scan and clean the DOM
   */
  public scanAndClean(root: Document | HTMLElement = document): void {
    const suspects = root.querySelectorAll(
      'ytd-ad-slot-renderer, ytd-video-renderer, #dismissible, grid-shelf-view-model'
    );

    suspects.forEach((element) => {
      if (element instanceof HTMLElement) {
        const { shouldRemove, counter } = this.shouldRemoveElement(element);
        if (shouldRemove && counter) {
          this.removeElement(element, counter);
        }
      }
    });
  }

  /**
   * Start the mutation observer
   */
  private startObserver(): void {
    const observer = new MutationObserver((mutations) => {
      for (const { addedNodes } of mutations) {
        for (const node of addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          
          const { shouldRemove, counter } = this.shouldRemoveElement(node);
          if (shouldRemove && counter) {
            this.removeElement(node, counter);
          }
          
          this.scanAndClean(node);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Get current counters
   */
  public getCounters(): DetoxCounters {
    return { ...this.counters };
  }

  /**
   * Reset counters
   */
  public async resetCounters(): Promise<void> {
    this.counters = {
      ads: 0,
      suggestions: 0,
      shelfShorts: 0,
      disguisedShorts: 0
    };
    await StorageManager.setCounters(this.counters);
    this.updateToast();
  }

  /**
   * Update configuration
   */
  public async updateConfig(newConfig: Partial<ExtensionConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    await StorageManager.setConfig(this.config);
    
    if (this.config.showToast && !this.toastElement) {
      this.createToast();
    } else if (!this.config.showToast && this.toastElement) {
      this.toastElement.remove();
      this.toastElement = null;
    }
  }
} 