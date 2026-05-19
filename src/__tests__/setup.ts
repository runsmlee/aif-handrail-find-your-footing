import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock IntersectionObserver for tests
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Shared localStorage mock (configurable so individual test files can override)
const localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string): string | null => localStorageStore[key] ?? null),
  setItem: vi.fn((key: string, value: string): void => { localStorageStore[key] = value; }),
  removeItem: vi.fn((key: string): void => { delete localStorageStore[key]; }),
  clear: vi.fn((): void => {
    for (const key of Object.keys(localStorageStore)) {
      delete localStorageStore[key];
    }
  }),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock, configurable: true });

// Mock URL.createObjectURL and revokeObjectURL
vi.stubGlobal('createObjectURL', (_blob?: Blob | MediaSource) => 'blob:mock-url');
vi.stubGlobal('revokeObjectURL', (_url?: string) => {});

// Export for use in individual test files that need to access the mock
export { localStorageMock, localStorageStore };
