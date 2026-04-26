import { describe, expect, it } from 'vitest'

import type { KanbanState } from '../../types/kanban'
import { formatDate, formatDateShort, isOverdue, nowISO } from '../../utils/date'
import {
  clearStorage,
  exportData,
  getStoredState,
  getStoredVersion,
  importData,
  setStoredState,
  setStoredVersion,
} from '../../utils/exportImport'
import { generateId } from '../../utils/id'

describe('id utils', () => {
  it('generates a 10-character URL-safe ID', () => {
    const id = generateId()
    expect(id).toHaveLength(10)
    expect(id).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId))
    expect(ids.size).toBe(100)
  })
})

describe('date utils', () => {
  it('returns a valid ISO string', () => {
    const iso = nowISO()
    expect(new Date(iso).toISOString()).toBe(iso)
  })

  it('formats date to readable string', () => {
    expect(formatDate('2024-03-15T00:00:00.000Z')).toBe('Mar 15, 2024')
  })

  it('formats date to short string', () => {
    expect(formatDateShort('2024-03-15T00:00:00.000Z')).toBe('Mar 15')
  })

  it('detects overdue dates', () => {
    const pastDate = '2020-01-01T00:00:00.000Z'
    const futureDate = '2099-12-31T00:00:00.000Z'
    expect(isOverdue(pastDate)).toBe(true)
    expect(isOverdue(futureDate)).toBe(false)
    expect(isOverdue(null)).toBe(false)
  })
})

describe('exportImport utils', () => {
  beforeEach(() => {
    clearStorage()
  })

  const mockState: KanbanState = {
    boards: {
      b1: {
        id: 'b1',
        title: 'Test Board',
        description: '',
        columnIds: ['c1'],
        labelIds: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
    columns: {
      c1: {
        id: 'c1',
        title: 'To Do',
        boardId: 'b1',
        cardIds: ['card1'],
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    },
    cards: {
      card1: {
        id: 'card1',
        title: 'Task',
        description: '',
        columnId: 'c1',
        boardId: 'b1',
        priority: null,
        labels: [],
        dueDate: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
    labels: {},
    activeBoardId: 'b1',
  }

  it('exportData returns valid JSON matching schema', () => {
    const json = exportData(mockState)
    const parsed = JSON.parse(json)

    expect(parsed.version).toBe(1)
    expect(parsed.data).toEqual(mockState)
  })

  it('importData restores full state from JSON', () => {
    const json = exportData(mockState)
    const restored = importData(json)

    expect(restored).toEqual(mockState)
  })

  it('throws on invalid JSON', () => {
    expect(() => importData('not json')).toThrow('Invalid JSON')
  })

  it('throws on malformed data missing boards', () => {
    expect(() => importData(JSON.stringify({ version: 1, data: { columns: {} } }))).toThrow(
      'Invalid format'
    )
  })

  it('throws on data missing columns', () => {
    expect(() =>
      importData(JSON.stringify({ version: 1, data: { boards: {}, cards: {}, labels: {} } }))
    ).toThrow('Invalid format')
  })

  it('throws on data missing cards', () => {
    expect(() =>
      importData(JSON.stringify({ version: 1, data: { boards: {}, columns: {}, labels: {} } }))
    ).toThrow('Invalid format')
  })

  it('throws on data missing labels', () => {
    expect(() =>
      importData(JSON.stringify({ version: 1, data: { boards: {}, columns: {}, cards: {} } }))
    ).toThrow('Invalid format')
  })
})

describe('storage utils', () => {
  beforeEach(() => {
    clearStorage()
  })

  it('getStoredState returns null when empty', () => {
    expect(getStoredState()).toBeNull()
  })

  it('setStoredState and getStoredState roundtrip', () => {
    setStoredState('test-data')
    expect(getStoredState()).toBe('test-data')
  })

  it('getStoredVersion returns null when empty', () => {
    expect(getStoredVersion()).toBeNull()
  })

  it('setStoredVersion and getStoredVersion roundtrip', () => {
    setStoredVersion(2)
    expect(getStoredVersion()).toBe(2)
  })

  it('clearStorage removes all keys', () => {
    setStoredState('data')
    setStoredVersion(1)
    clearStorage()
    expect(getStoredState()).toBeNull()
    expect(getStoredVersion()).toBeNull()
  })
})
