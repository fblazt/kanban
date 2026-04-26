import '@testing-library/jest-dom'

// Isolated localStorage mock — never touches browser storage
const mockStore: Record<string, string> = {}

const localStorageMock = {
  getItem: vi.fn((key: string) => mockStore[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    mockStore[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete mockStore[key]
  }),
  clear: vi.fn(() => {
    Object.keys(mockStore).forEach((key) => delete mockStore[key])
  }),
  key: vi.fn((index: number) => Object.keys(mockStore)[index] ?? null),
  get length() {
    return Object.keys(mockStore).length
  },
}

// Replace window.localStorage before any test runs
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: false,
  configurable: true,
})

// Clean mock store before every test
beforeEach(() => {
  localStorageMock.clear()
})

// Export for test utilities that need direct access
export { localStorageMock, mockStore }
