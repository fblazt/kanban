import type { ReactNode } from 'react'

import { useKanbanStore } from '../../store/kanbanStore'
import { AddColumnButton } from './AddColumnButton'
import { Column } from './Column'

export function BoardView(): ReactNode {
  const activeBoardId = useKanbanStore((state) => state.activeBoardId)
  const boards = useKanbanStore((state) => state.boards)
  const columns = useKanbanStore((state) => state.columns)
  const createColumn = useKanbanStore((state) => state.createColumn)

  const board = activeBoardId ? boards[activeBoardId] : null

  if (!board) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-text-muted)]"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">No board selected</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Select a board from the sidebar or create a new one
        </p>
      </div>
    )
  }

  const boardColumns = board.columnIds.map((id) => columns[id]).filter(Boolean)

  const handleAddColumn = (title: string) => {
    createColumn(board.id, title)
  }

  return (
    <div className="flex flex-1 gap-4 overflow-x-auto p-5">
      {boardColumns.map((column) => (
        <Column key={column.id} columnId={column.id} />
      ))}
      <AddColumnButton onAdd={handleAddColumn} />
    </div>
  )
}
