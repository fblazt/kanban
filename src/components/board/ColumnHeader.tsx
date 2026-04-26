import type { ReactNode } from 'react'
import { useEffect,useRef, useState } from 'react'

import { useKanbanStore } from '../../store/kanbanStore'
import type { Id } from '../../types/kanban'
import { ConfirmDialog } from '../ui/ConfirmDialog'

interface ColumnHeaderProps {
  columnId: Id
}

export function ColumnHeader({ columnId }: ColumnHeaderProps): ReactNode {
  const column = useKanbanStore((state) => state.columns[columnId])
  const updateColumn = useKanbanStore((state) => state.updateColumn)
  const deleteColumn = useKanbanStore((state) => state.deleteColumn)

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

  if (!column) return null

  const cardCount = column.cardIds.length

  const handleSave = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== column.title) {
      updateColumn(column.id, { title: trimmed })
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') setIsEditing(false)
  }

  const handleDelete = () => {
    deleteColumn(column.id)
    setShowConfirm(false)
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-sm font-medium uppercase tracking-wider text-[var(--color-text-secondary)] outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditTitle(column.title)
                setIsEditing(true)
              }}
              className="text-sm font-medium uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              {column.title}
            </button>
          )}
          <span className="rounded bg-[var(--color-bg-surface)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-text-muted)]">
            {cardCount}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="rounded p-1 text-[var(--color-text-muted)] opacity-0 transition-opacity hover:bg-[var(--color-bg-hover)] hover:text-red-400 group-hover:opacity-100"
          aria-label="Delete column"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Column"
        message={
          cardCount > 0
            ? 'This column contains ' +
              cardCount +
              ' card' +
              (cardCount === 1 ? '' : 's') +
              '. Are you sure you want to delete it?'
            : 'Are you sure you want to delete this column?'
        }
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}
