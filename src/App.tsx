import { useCallback,useState } from 'react'

import { AppShell } from './components/layout/AppShell'
import { ConfirmDialog } from './components/ui/ConfirmDialog'
import { useKanbanStore } from './store/kanbanStore'

function App() {
  const createBoard = useKanbanStore((state) => state.createBoard)
  const [showNewBoardInput, setShowNewBoardInput] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')

  const handleCreateBoard = useCallback(() => {
    setShowNewBoardInput(true)
  }, [])

  const handleConfirmCreate = useCallback(() => {
    const trimmed = newBoardTitle.trim()
    if (trimmed) {
      createBoard(trimmed)
    }
    setNewBoardTitle('')
    setShowNewBoardInput(false)
  }, [newBoardTitle, createBoard])

  const handleCancelCreate = useCallback(() => {
    setNewBoardTitle('')
    setShowNewBoardInput(false)
  }, [])

  return (
    <>
      <AppShell onCreateBoard={handleCreateBoard} />

      <ConfirmDialog
        isOpen={showNewBoardInput}
        title="Create New Board"
        message=""
        onConfirm={handleConfirmCreate}
        onCancel={handleCancelCreate}
      />

      {/* Inline new board input overlay */}
      {showNewBoardInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="w-[400px] rounded-lg border border-[var(--color-border-medium)] bg-[var(--color-bg-elevated)] p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-base font-medium text-[var(--color-text-primary)]">
              Create New Board
            </h3>
            <input
              type="text"
              placeholder="Board title"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmCreate()
                if (e.key === 'Escape') handleCancelCreate()
              }}
              autoFocus
              className="mb-4 w-full rounded-md border border-[var(--color-border-medium)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelCreate}
                className="rounded-md bg-[var(--color-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-hover)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCreate}
                className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
