import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useKanbanStore } from '../../store/kanbanStore'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { ExportImportButtons } from '../ui/ExportImportButtons'

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps): ReactNode {
  const activeBoardId = useKanbanStore((state) => state.activeBoardId)
  const boards = useKanbanStore((state) => state.boards)
  const updateBoard = useKanbanStore((state) => state.updateBoard)
  const deleteBoard = useKanbanStore((state) => state.deleteBoard)
  const setActiveBoard = useKanbanStore((state) => state.setActiveBoard)

  const board = activeBoardId ? boards[activeBoardId] : null

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const menuFocusTrapRef = useFocusTrap(showMobileMenu)

  if (!board) {
    return (
      <header className="flex h-14 items-center border-b border-[var(--color-border-medium)] bg-[var(--color-bg-base)] px-4 md:px-6">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="mr-3 rounded-md p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] md:hidden"
            aria-label="Open navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
      </header>
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
      <header className="flex h-14 items-center justify-between border-b border-[var(--color-border-medium)] bg-[var(--color-bg-base)] px-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {onMenuToggle && (
            <button
              type="button"
              onClick={onMenuToggle}
              className="mr-1 shrink-0 rounded-md p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] md:hidden"
              aria-label="Open navigation menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="min-w-0 bg-transparent text-lg font-semibold tracking-tight text-[var(--color-text-primary)] outline-none focus:border-b focus:border-[var(--color-accent)] md:text-xl"
              aria-label="Board title"
            />
          ) : (
            <h1
              onClick={() => {
                setEditTitle(board.title)
                setIsEditing(true)
              }}
              className="min-w-0 truncate cursor-pointer text-lg font-semibold tracking-tight text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] md:text-xl"
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

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <ExportImportButtons />
          </div>
          <button
            type="button"
            onClick={() => setShowMobileMenu(true)}
            className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] sm:hidden"
            aria-label="More actions"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="hidden rounded-md px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-red-400 sm:block"
          >
            Delete Board
          </button>
        </div>
      </header>

      {/* Mobile actions menu */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setShowMobileMenu(false)}
          role="presentation"
        >
          <div
            ref={menuFocusTrapRef}
            className="fixed right-4 top-14 z-50 w-48 rounded-lg border border-[var(--color-border-medium)] bg-[var(--color-bg-elevated)] p-2 shadow-lg"
            role="menu"
            aria-label="Board actions"
          >
            <div className="mb-2 border-b border-[var(--color-border-subtle)] pb-2">
              <ExportImportButtons className="flex-col items-start gap-1" />
            </div>
            <button
              type="button"
              onClick={() => {
                setShowMobileMenu(false)
                setShowConfirm(true)
              }}
              className="w-full rounded-md px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-[var(--color-bg-hover)]"
              role="menuitem"
            >
              Delete Board
            </button>
          </div>
        </div>
      )}

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