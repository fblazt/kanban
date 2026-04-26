import type { ReactNode } from 'react'
import { useEffect,useRef, useState } from 'react'

import { useKanbanStore } from '../../store/kanbanStore'
import { ConfirmDialog } from '../ui/ConfirmDialog'

export function Header(): ReactNode {
  const activeBoardId = useKanbanStore((state) => state.activeBoardId)
  const boards = useKanbanStore((state) => state.boards)
  const updateBoard = useKanbanStore((state) => state.updateBoard)
  const deleteBoard = useKanbanStore((state) => state.deleteBoard)
  const setActiveBoard = useKanbanStore((state) => state.setActiveBoard)

  const board = activeBoardId ? boards[activeBoardId] : null

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  if (!board) {
    return (
      <header className="flex h-14 items-center border-b border-[var(--color-border-medium)] bg-[var(--color-bg-base)] px-6" />
    )
  }

  const handleSave = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== board.title) {
      updateBoard(board.id, { title: trimmed })
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') setIsEditing(false)
  }

  const handleDelete = () => {
    deleteBoard(board.id)
    setShowConfirm(false)
    setActiveBoard(null)
  }

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-[var(--color-border-medium)] bg-[var(--color-bg-base)] px-6">
        <div className="flex items-center gap-4">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-xl font-semibold tracking-tight text-[var(--color-text-primary)] outline-none focus:border-b focus:border-[var(--color-accent)]"
            />
          ) : (
            <h1
              onClick={() => {
                setEditTitle(board.title)
                setIsEditing(true)
              }}
              className="cursor-pointer text-xl font-semibold tracking-tight text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditTitle(board.title)
                  setIsEditing(true)
                }
              }}
            >
              {board.title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="rounded-md px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-red-400"
          >
            Delete Board
          </button>
        </div>
      </header>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Board"
        message={
          'Are you sure you want to delete "' +
          board.title +
          '"? This will also delete all columns and cards.'
        }
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}
