import { MessageRequest, MessageResponse } from '../types';

/**
 * Type-safe message sender for Chrome extension communication
 */
export class ExtensionMessenger {
  /**
   * Send a message to the background script
   */
  static async sendMessage<T extends MessageRequest>(
    message: T
  ): Promise<MessageResponse> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Send a message to a specific tab
   */
  static async sendMessageToTab<T extends MessageRequest>(
    tabId: number,
    message: T
  ): Promise<MessageResponse> {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Add a message listener
   */
  static addListener(
    callback: (message: MessageRequest, sender: chrome.runtime.MessageSender) => Promise<MessageResponse> | MessageResponse
  ): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const result = callback(message, sender);
      
      if (result instanceof Promise) {
        result.then(sendResponse).catch((error) => {
          sendResponse({ type: 'ERROR', error: error.message });
        });
        return true; // Keep the message channel open for async response
      } else {
        sendResponse(result);
      }
    });
  }
} 