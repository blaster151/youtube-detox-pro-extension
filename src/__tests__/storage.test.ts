import { StorageManager, DEFAULT_CONFIG, DEFAULT_COUNTERS } from '../utils/storage';
import { mockChrome } from './setup';

describe('StorageManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConfig', () => {
    it('should return default config when no config is stored', async () => {
      mockChrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({});
      });

      const config = await StorageManager.getConfig();
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it('should return stored config when available', async () => {
      const storedConfig = { ...DEFAULT_CONFIG, enabled: false };
      mockChrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({ config: storedConfig });
      });

      const config = await StorageManager.getConfig();
      expect(config).toEqual(storedConfig);
    });
  });

  describe('setConfig', () => {
    it('should save config to storage', async () => {
      const config = { ...DEFAULT_CONFIG, enabled: false };
      mockChrome.storage.sync.set.mockImplementation((data, callback) => {
        callback();
      });

      await StorageManager.setConfig(config);
      expect(mockChrome.storage.sync.set).toHaveBeenCalledWith({ config }, expect.any(Function));
    });
  });

  describe('getCounters', () => {
    it('should return default counters when no counters are stored', async () => {
      mockChrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({});
      });

      const counters = await StorageManager.getCounters();
      expect(counters).toEqual(DEFAULT_COUNTERS);
    });

    it('should return stored counters when available', async () => {
      const storedCounters = { ...DEFAULT_COUNTERS, ads: 5 };
      mockChrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ counters: storedCounters });
      });

      const counters = await StorageManager.getCounters();
      expect(counters).toEqual(storedCounters);
    });
  });

  describe('setCounters', () => {
    it('should save counters to storage', async () => {
      const counters = { ...DEFAULT_COUNTERS, ads: 10 };
      mockChrome.storage.local.set.mockImplementation((data, callback) => {
        callback();
      });

      await StorageManager.setCounters(counters);
      expect(mockChrome.storage.local.set).toHaveBeenCalledWith({ counters }, expect.any(Function));
    });
  });

  describe('resetCounters', () => {
    it('should reset counters to default values', async () => {
      mockChrome.storage.local.set.mockImplementation((data, callback) => {
        callback();
      });

      await StorageManager.resetCounters();
      expect(mockChrome.storage.local.set).toHaveBeenCalledWith({ counters: DEFAULT_COUNTERS }, expect.any(Function));
    });
  });

  describe('incrementCounter', () => {
    it('should increment a specific counter', async () => {
      const currentCounters = { ...DEFAULT_COUNTERS, ads: 5 };
      mockChrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ counters: currentCounters });
      });
      mockChrome.storage.local.set.mockImplementation((data, callback) => {
        callback();
      });

      await StorageManager.incrementCounter('ads');
      expect(mockChrome.storage.local.set).toHaveBeenCalledWith({ counters: { ...currentCounters, ads: 6 } }, expect.any(Function));
    });
  });
}); 