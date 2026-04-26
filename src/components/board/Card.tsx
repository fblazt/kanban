import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useKanbanStore } from '../../store/kanbanStore'
import type { Id } from '../../types/kanban'
import { ConfirmDialog } from '../ui/ConfirmDialog'

interface CardProps {
  cardId: Id
}

export function Card({ cardId }: CardProps): ReactNode {
  const card = useKanbanStore((state) => state.cards[cardId])
  const updateCard = useKanbanStore((state) => state.updateCard)
  const deleteCard = useKanbanStore((state) => state.deleteCard)

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cardId, data: { type: 'Card', cardId } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  if (!card) return null

  const handleSave = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== card.title) {
      updateCard(card.id, { title: trimmed })
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') setIsEditing(false)
  }

  const handleDelete = () => {
    deleteCard(card.id)
    setShowConfirm(false)
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={
          'group relative rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-3 shadow-sm transition-shadow hover:shadow-md' +
          (isDragging ? ' opacity-50' : ' opacity-100')
        }
      >
        <div className="flex items-start justify-between gap-2">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full rounded bg-transparent text-sm font-medium text-[var(--color-text-primary)] outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditTitle(card.title)
                setIsEditing(true)
              }}
              className="text-left text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
            >
              {card.title}
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="shrink-0 rounded p-0.5 text-[var(--color-text-muted)] opacity-0 transition-opacity hover:bg-[var(--color-bg-hover)] hover:text-red-400 group-hover:opacity-100"
            aria-label="Delete card"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
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

        {card.priority && (
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={
                'inline-block h-2 w-2 rounded-full' +
                (card.priority === 'high'
                  ? ' bg-red-500'
                  : card.priority === 'medium'
                    ? ' bg-amber-500'
                    : ' bg-emerald-500')
              }
            />
            <span className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)]">
              {card.priority}
            </span>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Card"
        message={`Are you sure you want to delete "${card.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}
