import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Board, Card, Column, Id, KanbanStore, Label } from '../types/kanban'
import { nowISO } from '../utils/date'
import { exportData as doExport, importData as doImport } from '../utils/exportImport'
import { generateId } from '../utils/id'

const initialState: Omit<
  KanbanStore,
  keyof Pick<
    KanbanStore,
    | 'createBoard'
    | 'updateBoard'
    | 'deleteBoard'
    | 'setActiveBoard'
    | 'createColumn'
    | 'updateColumn'
    | 'deleteColumn'
    | 'createCard'
    | 'updateCard'
    | 'deleteCard'
    | 'moveCard'
    | 'createLabel'
    | 'deleteLabel'
    | 'exportData'
    | 'importData'
  >
> = {
  boards: {},
  columns: {},
  cards: {},
  labels: {},
  activeBoardId: null,
}

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      createBoard: (title: string) => {
        const boardId = generateId()
        const timestamp = nowISO()

        const todoId = generateId()
        const inProgressId = generateId()
        const doneId = generateId()

        const board: Board = {
          id: boardId,
          title,
          description: '',
          columnIds: [todoId, inProgressId, doneId],
          labelIds: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        }

        const todoColumn: Column = {
          id: todoId,
          title: 'To Do',
          boardId,
          cardIds: [],
          createdAt: timestamp,
        }

        const inProgressColumn: Column = {
          id: inProgressId,
          title: 'In Progress',
          boardId,
          cardIds: [],
          createdAt: timestamp,
        }

        const doneColumn: Column = {
          id: doneId,
          title: 'Done',
          boardId,
          cardIds: [],
          createdAt: timestamp,
        }

        set((state) => ({
          boards: { ...state.boards, [boardId]: board },
          columns: {
            ...state.columns,
            [todoId]: todoColumn,
            [inProgressId]: inProgressColumn,
            [doneId]: doneColumn,
          },
          activeBoardId: boardId,
        }))

        return boardId
      },

      updateBoard: (id: Id, partial) => {
        const board = get().boards[id]
        if (!board) return

        set((state) => ({
          boards: {
            ...state.boards,
            [id]: { ...board, ...partial, updatedAt: nowISO() },
          },
        }))
      },

      deleteBoard: (id: Id) => {
        const board = get().boards[id]
        if (!board) return

        const columnIdsToDelete = board.columnIds
        const cardIdsToDelete = columnIdsToDelete.flatMap(
          (colId) => get().columns[colId]?.cardIds ?? []
        )

        const newBoards = { ...get().boards }
        delete newBoards[id]

        const newColumns = { ...get().columns }
        columnIdsToDelete.forEach((colId) => delete newColumns[colId])

        const newCards = { ...get().cards }
        cardIdsToDelete.forEach((cardId) => delete newCards[cardId])

        set({
          boards: newBoards,
          columns: newColumns,
          cards: newCards,
          activeBoardId: get().activeBoardId === id ? null : get().activeBoardId,
        })
      },

      setActiveBoard: (id: Id | null) => {
        set({ activeBoardId: id })
      },

      createColumn: (boardId: Id, title: string) => {
        const board = get().boards[boardId]
        if (!board) throw new Error('Board not found')

        const columnId = generateId()
        const timestamp = nowISO()

        const column: Column = {
          id: columnId,
          title,
          boardId,
          cardIds: [],
          createdAt: timestamp,
        }

        set((state) => ({
          columns: { ...state.columns, [columnId]: column },
          boards: {
            ...state.boards,
            [boardId]: {
              ...board,
              columnIds: [...board.columnIds, columnId],
              updatedAt: timestamp,
            },
          },
        }))

        return columnId
      },

      updateColumn: (id: Id, partial) => {
        const column = get().columns[id]
        if (!column) return

        set((state) => ({
          columns: {
            ...state.columns,
            [id]: { ...column, ...partial },
          },
        }))
      },

      deleteColumn: (id: Id) => {
        const column = get().columns[id]
        if (!column) return

        const board = get().boards[column.boardId]
        if (!board) return

        const newColumns = { ...get().columns }
        delete newColumns[id]

        set((state) => ({
          columns: newColumns,
          boards: {
            ...state.boards,
            [board.id]: {
              ...board,
              columnIds: board.columnIds.filter((cid) => cid !== id),
              updatedAt: nowISO(),
            },
          },
        }))
      },

      createCard: (columnId: Id, partial = {}) => {
        const column = get().columns[columnId]
        if (!column) throw new Error('Column not found')

        const cardId = generateId()
        const timestamp = nowISO()

        const card: Card = {
          id: cardId,
          title: partial.title ?? 'Untitled',
          description: partial.description ?? '',
          columnId,
          boardId: column.boardId,
          priority: partial.priority ?? null,
          labels: partial.labels ?? [],
          dueDate: partial.dueDate ?? null,
          createdAt: timestamp,
          updatedAt: timestamp,
        }

        set((state) => ({
          cards: { ...state.cards, [cardId]: card },
          columns: {
            ...state.columns,
            [columnId]: {
              ...column,
              cardIds: [...column.cardIds, cardId],
            },
          },
        }))

        return cardId
      },

      updateCard: (id: Id, partial) => {
        const card = get().cards[id]
        if (!card) return

        set((state) => ({
          cards: {
            ...state.cards,
            [id]: { ...card, ...partial, updatedAt: nowISO() },
          },
        }))
      },

      deleteCard: (id: Id) => {
        const card = get().cards[id]
        if (!card) return

        const column = get().columns[card.columnId]
        if (!column) return

        const newCards = { ...get().cards }
        delete newCards[id]

        set((state) => ({
          cards: newCards,
          columns: {
            ...state.columns,
            [column.id]: {
              ...column,
              cardIds: column.cardIds.filter((cid) => cid !== id),
            },
          },
        }))
      },

      moveCard: (cardId: Id, targetColumnId: Id, targetIndex: number) => {
        const card = get().cards[cardId]
        if (!card) return

        const sourceColumn = get().columns[card.columnId]
        const targetColumn = get().columns[targetColumnId]
        if (!sourceColumn || !targetColumn) return

        const newCards = { ...get().cards }
        newCards[cardId] = { ...card, columnId: targetColumnId, updatedAt: nowISO() }

        const newColumns = { ...get().columns }

        if (sourceColumn.id === targetColumn.id) {
          // Reorder within same column
          const cardIds = [...sourceColumn.cardIds]
          const fromIndex = cardIds.indexOf(cardId)
          if (fromIndex === -1) return

          cardIds.splice(fromIndex, 1)
          cardIds.splice(targetIndex, 0, cardId)

          newColumns[sourceColumn.id] = { ...sourceColumn, cardIds }
        } else {
          // Move between columns
          newColumns[sourceColumn.id] = {
            ...sourceColumn,
            cardIds: sourceColumn.cardIds.filter((cid) => cid !== cardId),
          }

          const targetCardIds = [...targetColumn.cardIds]
          targetCardIds.splice(targetIndex, 0, cardId)
          newColumns[targetColumn.id] = { ...targetColumn, cardIds: targetCardIds }
        }

        set({ cards: newCards, columns: newColumns })
      },

      createLabel: (boardId: Id, name: string, color: string) => {
        const board = get().boards[boardId]
        if (!board) throw new Error('Board not found')

        const labelId = generateId()
        const label: Label = { id: labelId, name, color }

        set((state) => ({
          labels: { ...state.labels, [labelId]: label },
          boards: {
            ...state.boards,
            [boardId]: {
              ...board,
              labelIds: [...board.labelIds, labelId],
              updatedAt: nowISO(),
            },
          },
        }))

        return labelId
      },

      deleteLabel: (id: Id) => {
        const label = get().labels[id]
        if (!label) return

        const newLabels = { ...get().labels }
        delete newLabels[id]

        const newCards = { ...get().cards }
        Object.values(newCards).forEach((card) => {
          if (card.labels.includes(id)) {
            newCards[card.id] = {
              ...card,
              labels: card.labels.filter((lid) => lid !== id),
            }
          }
        })

        const board = Object.values(get().boards).find((b) => b.labelIds.includes(id))
        const newBoards = board
          ? {
              ...get().boards,
              [board.id]: {
                ...board,
                labelIds: board.labelIds.filter((lid) => lid !== id),
              },
            }
          : get().boards

        set({ labels: newLabels, cards: newCards, boards: newBoards })
      },

      exportData: () => {
        return doExport(get())
      },

      importData: (json: string) => {
        const data = doImport(json)
        set({
          boards: data.boards,
          columns: data.columns,
          cards: data.cards,
          labels: data.labels,
          activeBoardId: data.activeBoardId,
        })
      },
    }),
    {
      name: 'kanban-app-state',
      version: 1,
    }
  )
)
