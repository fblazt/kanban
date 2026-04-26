import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { useKanbanStore } from '../../store/kanbanStore'
import type { Id } from '../../types/kanban'
import { CardModal } from '../card/CardModal'
import { DueDateBadge } from '../card/DueDateBadge'
import { LabelBadge } from '../card/LabelBadge'
import { PriorityBadge } from '../card/PriorityBadge'
import { ConfirmDialog } from '../ui/ConfirmDialog'

interface CardProps {
  cardId: Id
}

export function Card({ cardId }: CardProps): ReactNode {
  const card = useKanbanStore((state) => state.cards[cardId])
  const deleteCard = useKanbanStore((state) => state.deleteCard)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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

  if (!card) return null

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
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-left text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
          >
            {card.title}
          </button>

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

        {card.description && (
          <p className="mt-1.5 line-clamp-2 text-[13px] text-[var(--color-text-secondary)]">
            {card.description}
          </p>
        )}

        {/* Meta row */}
        {(card.priority || card.labels.length > 0 || card.dueDate) && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={card.priority} />
            {card.labels.map((labelId) => (
              <LabelBadge key={labelId} labelId={labelId} />
            ))}
            <DueDateBadge dueDate={card.dueDate} />
          </div>
        )}
      </div>

      <CardModal card={card} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

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
