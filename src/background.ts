import { ExtensionMessenger } from './utils/messaging';
import { StorageManager } from './utils/storage';
import { MessageRequest, MessageResponse } from './types';

// Handle messages from content scripts and popup
ExtensionMessenger.addListener(async (message: MessageRequest): Promise<MessageResponse> => {
  switch (message.type) {
    case 'GET_STATS':
      const counters = await StorageManager.getCounters();
      return {
        type: 'STATS',
        counters
      };

    case 'UPDATE_STATS':
      await StorageManager.setCounters(message.counters);
      return {
        type: 'SUCCESS',
        message: 'Stats updated'
      };

    case 'GET_CONFIG':
      const config = await StorageManager.getConfig();
      return {
        type: 'CONFIG',
        config
      };

    case 'UPDATE_CONFIG':
      await StorageManager.setConfig(message.config as any);
      return {
        type: 'SUCCESS',
        message: 'Config updated'
      };

    case 'RESET_STATS':
      await StorageManager.resetCounters();
      return {
        type: 'SUCCESS',
        message: 'Stats reset'
      };

    default:
      return {
        type: 'ERROR',
        error: 'Unknown message type'
      };
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('YouTube Detox Pro installed!');
    // Initialize default settings
    await StorageManager.setConfig({
      enabled: true,
      showToast: true,
      toastPosition: 'top-right',
      removeAds: true,
      removeSuggestions: true,
      removeShorts: true,
      removeDisguisedShorts: true
    });
  }
});

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('youtube.com')) {
    // Content script will be automatically injected via manifest
    console.log('YouTube page loaded, content script should be active');
  }
}); 