import type { ReactNode } from 'react'

import { useKanbanStore } from '../../store/kanbanStore'

interface SidebarProps {
  onCreateBoard: () => void
  onBoardSelect?: () => void
}

export function Sidebar({ onCreateBoard, onBoardSelect }: SidebarProps): ReactNode {
  const boards = useKanbanStore((state) => state.boards)
  const activeBoardId = useKanbanStore((state) => state.activeBoardId)
  const setActiveBoard = useKanbanStore((state) => state.setActiveBoard)

  const boardList = Object.values(boards)

  const handleSelectBoard = (boardId: string) => {
    setActiveBoard(boardId)
    onBoardSelect?.()
  }

  return (
    <aside
      className="flex h-full w-[260px] flex-col border-r border-[var(--color-border-medium)] bg-[var(--color-bg-base)]"
      role="navigation"
      aria-label="Board list"
    >
      <div className="flex items-center px-5 py-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
          Kanban
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          Boards
        </div>
        <nav className="flex flex-col gap-1" aria-label="Boards">
          {boardList.map((board) => (
            <button
              key={board.id}
              type="button"
              onClick={() => handleSelectBoard(board.id)}
              aria-current={activeBoardId === board.id ? 'page' : undefined}
              className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
                activeBoardId === board.id
                  ? 'border-l-2 border-[var(--color-accent)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              {board.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-[var(--color-border-medium)] p-3">
        <button
          type="button"
          onClick={onCreateBoard}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-[var(--color-border-medium)] bg-[var(--color-bg-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-accent)] transition-colors hover:border-[var(--color-accent-border)] hover:bg-[var(--color-accent-subtle)]"
        >
          <span className="text-lg leading-none">+</span>
          New Board
        </button>
      </div>
    </aside>
  )
}