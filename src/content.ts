import { DetoxService } from './services/detoxService';
import { ExtensionMessenger } from './utils/messaging';
import { MessageRequest, MessageResponse } from './types';

// Initialize the detox service
const detoxService = new DetoxService();

// Set up message handling for communication with background script
ExtensionMessenger.addListener(async (message: MessageRequest): Promise<MessageResponse> => {
  switch (message.type) {
    case 'GET_STATS':
      return {
        type: 'STATS',
        counters: detoxService.getCounters()
      };

    case 'UPDATE_STATS':
      // This would typically be handled by the background script
      return {
        type: 'SUCCESS',
        message: 'Stats updated'
      };

    case 'RESET_STATS':
      await detoxService.resetCounters();
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

// Initial scan when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    detoxService.scanAndClean();
  });
} else {
  detoxService.scanAndClean();
}

// Export for testing purposes
export { detoxService }; 