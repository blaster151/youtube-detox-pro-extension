// Mock Chrome APIs for testing
const mockChrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn()
    },
    lastError: null
  },
  tabs: {
    sendMessage: jest.fn(),
    onUpdated: {
      addListener: jest.fn()
    }
  },
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn()
    },
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  }
};

// Mock DOM APIs
Object.defineProperty(window, 'chrome', {
  value: mockChrome,
  writable: true
});

// Mock document methods
Object.defineProperty(document, 'readyState', {
  value: 'complete',
  writable: true
});

// Mock MutationObserver
global.MutationObserver = class {
  constructor(callback: MutationCallback) {}
  observe() {}
  disconnect() {}
} as any;

// Mock document.createElement to return proper DOM elements
const originalCreateElement = document.createElement;
document.createElement = jest.fn().mockImplementation((tagName: string) => {
  const element = originalCreateElement.call(document, tagName);
  element.remove = jest.fn();
  element.appendChild = jest.fn();
  element.querySelector = jest.fn();
  element.querySelectorAll = jest.fn();
  return element;
});

// Mock querySelector and querySelectorAll
document.querySelector = jest.fn();
document.querySelectorAll = jest.fn();

// Export mock for use in tests
export { mockChrome };

// Add a simple test to prevent Jest from complaining
describe('Test Setup', () => {
  it('should have Chrome API mocked', () => {
    expect(window.chrome).toBeDefined();
    expect(window.chrome.runtime).toBeDefined();
  });
}); 