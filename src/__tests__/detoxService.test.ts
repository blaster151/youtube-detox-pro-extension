import { DetoxService } from '../services/detoxService';
import { StorageManager } from '../utils/storage';
import { mockChrome } from './setup';

// Mock the storage manager
jest.mock('../utils/storage');

describe('DetoxService', () => {
  let detoxService: DetoxService;
  let mockStorageManager: jest.Mocked<typeof StorageManager>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock storage manager methods
    mockStorageManager = StorageManager as jest.Mocked<typeof StorageManager>;
    mockStorageManager.getConfig.mockResolvedValue({
      enabled: true,
      showToast: false, // Disable toast for testing
      toastPosition: 'top-right',
      removeAds: true,
      removeSuggestions: true,
      removeShorts: true,
      removeDisguisedShorts: true
    });
    
    mockStorageManager.getCounters.mockResolvedValue({
      ads: 0,
      suggestions: 0,
      shelfShorts: 0,
      disguisedShorts: 0
    });

    // Mock document methods
    document.body.innerHTML = '';
    
    detoxService = new DetoxService();
  });

  describe('initialization', () => {
    it('should initialize with default configuration', async () => {
      expect(mockStorageManager.getConfig).toHaveBeenCalled();
      expect(mockStorageManager.getCounters).toHaveBeenCalled();
    });
  });

  describe('element detection', () => {
    it('should detect sponsored ads', () => {
      const adElement = document.createElement('ytd-ad-slot-renderer') as HTMLElement;
      const result = (detoxService as any).shouldRemoveElement(adElement);
      expect(result.shouldRemove).toBe(true);
      expect(result.counter).toBe('ads');
    });

    it('should detect suggestion elements', () => {
      const suggestionElement = document.createElement('div') as HTMLElement;
      suggestionElement.id = 'dismissible';
      suggestionElement.textContent = 'People also watched';
      
      const result = (detoxService as any).shouldRemoveElement(suggestionElement);
      expect(result.shouldRemove).toBe(true);
      expect(result.counter).toBe('suggestions');
    });

    it('should detect shorts shelf elements', () => {
      const shortsElement = document.createElement('grid-shelf-view-model') as HTMLElement;
      shortsElement.textContent = 'Shorts';
      
      const result = (detoxService as any).shouldRemoveElement(shortsElement);
      expect(result.shouldRemove).toBe(true);
      expect(result.counter).toBe('shelfShorts');
    });

    it('should detect disguised shorts', () => {
      const disguisedShortElement = document.createElement('ytd-video-renderer') as HTMLElement;
      disguisedShortElement.querySelector = jest.fn().mockReturnValue({ ariaLabel: 'Shorts' });
      
      const result = (detoxService as any).isDisguisedShort(disguisedShortElement);
      expect(result).toBe(true);
    });
  });

  describe('counter management', () => {
    it('should get current counters', () => {
      const counters = detoxService.getCounters();
      expect(counters).toEqual({
        ads: 0,
        suggestions: 0,
        shelfShorts: 0,
        disguisedShorts: 0
      });
    });

    it('should reset counters', async () => {
      await detoxService.resetCounters();
      expect(mockStorageManager.setCounters).toHaveBeenCalledWith({
        ads: 0,
        suggestions: 0,
        shelfShorts: 0,
        disguisedShorts: 0
      });
    });
  });

  describe('configuration', () => {
    it('should update configuration', async () => {
      const newConfig = { enabled: false };
      await detoxService.updateConfig(newConfig);
      expect(mockStorageManager.setConfig).toHaveBeenCalled();
    });
  });
}); 