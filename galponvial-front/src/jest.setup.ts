import '@testing-library/jest-dom';

declare global {
  var localStorage: Storage;
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

globalThis.localStorage = localStorageMock as any;

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
