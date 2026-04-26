import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { useKanbanStore } from '../../store/kanbanStore'
import type { Id } from '../../types/kanban'
import { Card } from './Card'
import { ColumnHeader } from './ColumnHeader'

interface ColumnProps {
  columnId: Id
}

export function Column({ columnId }: ColumnProps): ReactNode {
  const column = useKanbanStore((state) => state.columns[columnId])
  const cards = useKanbanStore((state) => state.cards)
  const createCard = useKanbanStore((state) => state.createCard)

  const [isAdding, setIsAdding] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')

  const { setNodeRef } = useDroppable({
    id: columnId,
    data: { type: 'Column', columnId },
  })

  if (!column) return null

  const columnCards = column.cardIds.map((id) => cards[id]).filter(Boolean)

  const handleAddCard = () => {
    const trimmed = newCardTitle.trim()
    if (trimmed) {
      createCard(columnId, { title: trimmed })
    }
    setNewCardTitle('')
    setIsAdding(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddCard()
    if (e.key === 'Escape') {
      setNewCardTitle('')
      setIsAdding(false)
    }
  }

  return (
    <div className="group flex w-[280px] shrink-0 flex-col rounded-md border border-[var(--color-border-subtle)] border-t-2 border-t-[var(--color-border-medium)] bg-[var(--color-bg-elevated)] shadow-sm">
      <ColumnHeader columnId={columnId} />

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          {columnCards.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded border border-dashed border-[var(--color-border-subtle)] py-8">
              <span className="text-xs text-[var(--color-text-muted)]">
                Drop cards here
              </span>
            </div>
          ) : (
            columnCards.map((card) => <Card key={card.id} cardId={card.id} />)
          )}
        </SortableContext>
      </div>

      <div className="p-3 pt-0">
        {isAdding ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full rounded-md border border-[var(--color-border-medium)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddCard}
                className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                Add Card
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewCardTitle('')
                  setIsAdding(false)
                }}
                className="rounded-md bg-[var(--color-bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-hover)]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
          >
            <span className="text-base leading-none">+</span>
            Add a card
          </button>
        )}
      </div>
    </div>
  )
}
