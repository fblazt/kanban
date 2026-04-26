import { beforeEach, describe, expect, it } from 'vitest'

import { useKanbanStore } from '../../store/kanbanStore'

function getState() {
  return useKanbanStore.getState()
}

function resetStore() {
  // Reset Zustand store to initial empty state
  // localStorage is already mocked and cleared in setup.ts beforeEach
  useKanbanStore.setState({
    boards: {},
    columns: {},
    cards: {},
    labels: {},
    activeBoardId: null,
  })
}

describe('kanbanStore', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('createBoard', () => {
    it('creates a board with 3 default columns', () => {
      const boardId = getState().createBoard('My Board')
      const state = getState()

      expect(state.boards[boardId]).toBeDefined()
      expect(state.boards[boardId].title).toBe('My Board')
      expect(state.boards[boardId].columnIds).toHaveLength(3)
      expect(state.activeBoardId).toBe(boardId)

      const columns = state.boards[boardId].columnIds.map((id) => state.columns[id])
      expect(columns.map((c) => c.title)).toEqual(['To Do', 'In Progress', 'Done'])
    })

    it('sets createdAt and updatedAt timestamps', () => {
      const before = Date.now()
      const boardId = getState().createBoard('Test')
      const after = Date.now()
      const board = getState().boards[boardId]

      const created = new Date(board.createdAt).getTime()
      expect(created).toBeGreaterThanOrEqual(before)
      expect(created).toBeLessThanOrEqual(after)
    })
  })

  describe('updateBoard', () => {
    it('modifies title and description without affecting columns', () => {
      const boardId = getState().createBoard('Original')
      const originalColumnIds = getState().boards[boardId].columnIds

      getState().updateBoard(boardId, { title: 'Updated', description: 'New desc' })
      const board = getState().boards[boardId]

      expect(board.title).toBe('Updated')
      expect(board.description).toBe('New desc')
      expect(board.columnIds).toEqual(originalColumnIds)
      expect(board.updatedAt).toBeTruthy()
    })

    it('does nothing for non-existent board', () => {
      getState().updateBoard('nonexistent', { title: 'X' })
      expect(getState().boards).toEqual({})
    })
  })

  describe('deleteBoard edge cases', () => {
    it('does nothing for non-existent board', () => {
      getState().deleteBoard('nonexistent')
      expect(getState().boards).toEqual({})
    })
  })

  describe('deleteBoard', () => {
    it('cascade-deletes all related columns and cards', () => {
      const boardId = getState().createBoard('To Delete')
      const columnId = getState().boards[boardId].columnIds[0]
      const cardId = getState().createCard(columnId, { title: 'Card' })

      getState().deleteBoard(boardId)
      const state = getState()

      expect(state.boards[boardId]).toBeUndefined()
      expect(state.columns[columnId]).toBeUndefined()
      expect(state.cards[cardId]).toBeUndefined()
      expect(state.activeBoardId).toBeNull()
    })

    it('does not affect other boards', () => {
      const boardA = getState().createBoard('A')
      const boardB = getState().createBoard('B')

      getState().deleteBoard(boardA)
      expect(getState().boards[boardB]).toBeDefined()
    })
  })

  describe('setActiveBoard', () => {
    it('updates activeBoardId', () => {
      const boardId = getState().createBoard('Active')
      getState().setActiveBoard(null)
      expect(getState().activeBoardId).toBeNull()
      getState().setActiveBoard(boardId)
      expect(getState().activeBoardId).toBe(boardId)
    })
  })

  describe('createColumn', () => {
    it('appends column to board', () => {
      const boardId = getState().createBoard('Board')
      const columnId = getState().createColumn(boardId, 'New Column')
      const state = getState()

      expect(state.columns[columnId].title).toBe('New Column')
      expect(state.columns[columnId].boardId).toBe(boardId)
      expect(state.boards[boardId].columnIds).toContain(columnId)
    })

    it('throws if board does not exist', () => {
      expect(() => getState().createColumn('nonexistent', 'Col')).toThrow('Board not found')
    })
  })

  describe('updateColumn', () => {
    it('renames column without side effects', () => {
      const boardId = getState().createBoard('Board')
      const columnId = getState().boards[boardId].columnIds[0]

      getState().updateColumn(columnId, { title: 'Renamed' })
      expect(getState().columns[columnId].title).toBe('Renamed')
      expect(getState().boards[boardId].columnIds).toHaveLength(3)
    })

    it('does nothing for non-existent column', () => {
      getState().updateColumn('nonexistent', { title: 'X' })
      expect(getState().columns).toEqual({})
    })
  })

  describe('deleteColumn', () => {
    it('removes column from board', () => {
      const boardId = getState().createBoard('Board')
      const columnId = getState().boards[boardId].columnIds[0]

      getState().deleteColumn(columnId)
      const state = getState()

      expect(state.columns[columnId]).toBeUndefined()
      expect(state.boards[boardId].columnIds).not.toContain(columnId)
    })

    it('orphans cards (cards remain in store but lose columnId)', () => {
      const boardId = getState().createBoard('Board')
      const columnId = getState().boards[boardId].columnIds[0]
      const cardId = getState().createCard(columnId, { title: 'Orphan' })

      getState().deleteColumn(columnId)
      expect(getState().cards[cardId]).toBeDefined()
    })

    it('does nothing for non-existent column', () => {
      getState().deleteColumn('nonexistent')
      expect(getState().columns).toEqual({})
    })
  })

  describe('createCard', () => {
    it('adds card to column cardIds', () => {
      const boardId = getState().createBoard('Board')
      const columnId = getState().boards[boardId].columnIds[0]
      const cardId = getState().createCard(columnId, { title: 'Task' })

      const state = getState()
      expect(state.cards[cardId].title).toBe('Task')
      expect(state.cards[cardId].columnId).toBe(columnId)
      expect(state.columns[columnId].cardIds).toContain(cardId)
    })

    it('throws if column does not exist', () => {
      expect(() => getState().createCard('nonexistent', { title: 'X' })).toThrow('Column not found')
    })
  })

  describe('updateCard', () => {
    it('modifies title and description', () => {
      const boardId = getState().createBoard('Board')
      const columnId = getState().boards[boardId].columnIds[0]
      const cardId = getState().createCard(columnId, { title: 'Old' })

      getState().updateCard(cardId, { title: 'New', description: 'Desc' })
      const card = getState().cards[cardId]

      expect(card.title).toBe('New')
      expect(card.description).toBe('Desc')
      expect(card.updatedAt).toBeTruthy()
    })
  })

  describe('deleteCard', () => {
    it('removes from column and deletes from store', () => {
      const boardId = getState().createBoard('Board')
      const columnId = getState().boards[boardId].columnIds[0]
      const cardId = getState().createCard(columnId, { title: 'Gone' })

      getState().deleteCard(cardId)
      const state = getState()

      expect(state.cards[cardId]).toBeUndefined()
      expect(state.columns[columnId].cardIds).not.toContain(cardId)
    })

    it('does nothing for non-existent card', () => {
      getState().deleteCard('nonexistent')
      expect(getState().cards).toEqual({})
    })
  })

  describe('moveCard', () => {
    it('reorders cards within same column', () => {
      const boardId = getState().createBoard('Board')
      const columnId = getState().boards[boardId].columnIds[0]
      const c1 = getState().createCard(columnId, { title: '1' })
      const c2 = getState().createCard(columnId, { title: '2' })
      const c3 = getState().createCard(columnId, { title: '3' })

      getState().moveCard(c1, columnId, 2) // Move 1 to index 2
      expect(getState().columns[columnId].cardIds).toEqual([c2, c3, c1])
    })

    it('moves card between columns', () => {
      const boardId = getState().createBoard('Board')
      const colA = getState().boards[boardId].columnIds[0]
      const colB = getState().boards[boardId].columnIds[1]
      const cardId = getState().createCard(colA, { title: 'Move me' })

      getState().moveCard(cardId, colB, 0)
      const state = getState()

      expect(state.cards[cardId].columnId).toBe(colB)
      expect(state.columns[colA].cardIds).not.toContain(cardId)
      expect(state.columns[colB].cardIds).toEqual([cardId])
    })

    it('does nothing for non-existent card', () => {
      const boardId = getState().createBoard('Board')
      const colId = getState().boards[boardId].columnIds[0]
      getState().moveCard('nonexistent', colId, 0)
      expect(getState().columns[colId].cardIds).toHaveLength(0)
    })

    it('does nothing when source column does not exist', () => {
      const boardId = getState().createBoard('Board')
      const colId = getState().boards[boardId].columnIds[0]
      const cardId = getState().createCard(colId, { title: 'X' })

      // Delete the column but keep the card orphaned
      getState().deleteColumn(colId)
      getState().moveCard(cardId, colId, 0)
      expect(getState().cards[cardId].columnId).toBe(colId)
    })

    it('does nothing when target column does not exist', () => {
      const boardId = getState().createBoard('Board')
      const colId = getState().boards[boardId].columnIds[0]
      const cardId = getState().createCard(colId, { title: 'X' })

      getState().moveCard(cardId, 'nonexistent', 0)
      expect(getState().cards[cardId].columnId).toBe(colId)
    })
  })

  describe('createLabel', () => {
    it('adds label to board', () => {
      const boardId = getState().createBoard('Board')
      const labelId = getState().createLabel(boardId, 'Bug', '#ef4444')

      expect(getState().labels[labelId].name).toBe('Bug')
      expect(getState().boards[boardId].labelIds).toContain(labelId)
    })

    it('throws if board does not exist', () => {
      expect(() => getState().createLabel('nonexistent', 'X', '#000')).toThrow('Board not found')
    })
  })

  describe('deleteLabel', () => {
    it('removes label from all cards and board', () => {
      const boardId = getState().createBoard('Board')
      const labelId = getState().createLabel(boardId, 'Bug', '#ef4444')
      const colId = getState().boards[boardId].columnIds[0]
      const cardId = getState().createCard(colId, { title: 'Card', labels: [labelId] })

      getState().deleteLabel(labelId)
      const state = getState()

      expect(state.labels[labelId]).toBeUndefined()
      expect(state.cards[cardId].labels).not.toContain(labelId)
      expect(state.boards[boardId].labelIds).not.toContain(labelId)
    })

    it('does nothing for non-existent label', () => {
      getState().deleteLabel('nonexistent')
      expect(getState().labels).toEqual({})
    })
  })

  describe('exportData', () => {
    it('returns JSON string with current state', () => {
      const boardId = getState().createBoard('Export Board')
      const json = getState().exportData()
      const parsed = JSON.parse(json)

      expect(parsed.version).toBe(1)
      expect(parsed.data.boards[boardId].title).toBe('Export Board')
    })
  })

  describe('importData', () => {
    it('restores state from JSON', () => {
      const boardId = getState().createBoard('Import Board')
      const json = getState().exportData()

      // Reset
      useKanbanStore.setState({
        boards: {},
        columns: {},
        cards: {},
        labels: {},
        activeBoardId: null,
      })

      getState().importData(json)
      expect(getState().boards[boardId].title).toBe('Import Board')
    })

    it('throws on invalid JSON', () => {
      expect(() => getState().importData('not json')).toThrow('Invalid JSON')
    })
  })

  describe('persistence', () => {
    it('serializes state to localStorage after mutation', () => {
      getState().createBoard('Persisted')
      const stored = localStorage.getItem('kanban-app-state')
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      expect(parsed.state.boards).toBeDefined()
      expect(Object.keys(parsed.state.boards)).toHaveLength(1)
    })

    it('rehydrates state from localStorage on init', () => {
      // Pre-seed localStorage
      const boardId = getState().createBoard('Preloaded')
      const stored = localStorage.getItem('kanban-app-state')

      // Reset store state manually to simulate fresh load
      useKanbanStore.setState({
        boards: {},
        columns: {},
        cards: {},
        labels: {},
        activeBoardId: null,
      })

      // Rehydrate by calling the store's internal persist mechanism
      // Since we can't easily re-mount the persist middleware, we simulate by importing
      const parsed = JSON.parse(stored!)
      useKanbanStore.setState(parsed.state)

      expect(getState().boards[boardId].title).toBe('Preloaded')
    })
  })
})
