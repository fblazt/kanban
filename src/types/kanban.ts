export type Id = string

export type Priority = 'low' | 'medium' | 'high'

export interface Label {
  id: Id
  name: string
  color: string
}

export interface Card {
  id: Id
  title: string
  description: string
  columnId: Id
  boardId: Id
  priority: Priority | null
  labels: Id[]
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface Column {
  id: Id
  title: string
  boardId: Id
  cardIds: Id[]
  createdAt: string
}

export interface Board {
  id: Id
  title: string
  description: string
  columnIds: Id[]
  labelIds: Id[]
  createdAt: string
  updatedAt: string
}

export interface KanbanState {
  boards: Record<Id, Board>
  columns: Record<Id, Column>
  cards: Record<Id, Card>
  labels: Record<Id, Label>
  activeBoardId: Id | null
}

export interface KanbanActions {
  // Board actions
  createBoard: (title: string) => Id
  updateBoard: (id: Id, partial: Partial<Omit<Board, 'id' | 'createdAt' | 'updatedAt'>>) => void
  deleteBoard: (id: Id) => void
  setActiveBoard: (id: Id | null) => void

  // Column actions
  createColumn: (boardId: Id, title: string) => Id
  updateColumn: (id: Id, partial: Partial<Omit<Column, 'id' | 'boardId' | 'createdAt'>>) => void
  deleteColumn: (id: Id) => void

  // Card actions
  createCard: (
    columnId: Id,
    partial: Partial<Omit<Card, 'id' | 'columnId' | 'boardId' | 'createdAt' | 'updatedAt'>>
  ) => Id
  updateCard: (
    id: Id,
    partial: Partial<Omit<Card, 'id' | 'columnId' | 'boardId' | 'createdAt'>>
  ) => void
  deleteCard: (id: Id) => void
  moveCard: (cardId: Id, targetColumnId: Id, targetIndex: number) => void

  // Label actions
  createLabel: (boardId: Id, name: string, color: string) => Id
  deleteLabel: (id: Id) => void

  // Data management
  exportData: () => string
  importData: (json: string) => void
}

export type KanbanStore = KanbanState & KanbanActions
