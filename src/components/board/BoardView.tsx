import type {
  DragEndEvent,
  DragStartEvent} from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { useKanbanStore } from '../../store/kanbanStore'
import { AddColumnButton } from './AddColumnButton'
import { Column } from './Column'

export function BoardView(): ReactNode {
  const activeBoardId = useKanbanStore((state) => state.activeBoardId)
  const boards = useKanbanStore((state) => state.boards)
  const columns = useKanbanStore((state) => state.columns)
  const createColumn = useKanbanStore((state) => state.createColumn)
  const moveCard = useKanbanStore((state) => state.moveCard)

  const [activeCardId, setActiveCardId] = useState<string | null>(null)

  const board = activeBoardId ? boards[activeBoardId] : null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  )

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === 'Card') {
      setActiveCardId(active.id as string)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCardId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeData = active.data.current
    if (activeData?.type !== 'Card') return

    const overData = over.data.current

    let targetColumnId: string
    let targetIndex: number

    if (overData?.type === 'Card') {
      // Dropped over another card
      const overCard = useKanbanStore.getState().cards[overId]
      if (!overCard) return
      targetColumnId = overCard.columnId
      const column = useKanbanStore.getState().columns[targetColumnId]
      targetIndex = column.cardIds.indexOf(overId)
    } else if (overData?.type === 'Column') {
      // Dropped over a column (empty or at end)
      targetColumnId = overId
      const column = useKanbanStore.getState().columns[targetColumnId]
      targetIndex = column.cardIds.length
    } else {
      return
    }

    moveCard(activeId, targetColumnId, targetIndex)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-1 gap-4 overflow-x-auto p-5">
        {boardColumns.map((column) => (
          <Column key={column.id} columnId={column.id} />
        ))}
        <AddColumnButton onAdd={handleAddColumn} />
      </div>
      <DragOverlay dropAnimation={null}>
        {activeCardId ? (
          <div className="rounded-md border border-[var(--color-border-medium)] bg-[var(--color-bg-elevated)] p-3 shadow-lg opacity-90">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {useKanbanStore.getState().cards[activeCardId]?.title}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
