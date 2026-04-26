import type { ReactNode } from 'react'

import type { Id } from '../../types/kanban'
import { ColumnHeader } from './ColumnHeader'

interface ColumnProps {
  columnId: Id
}

export function Column({ columnId }: ColumnProps): ReactNode {
  return (
    <div className="group flex w-[280px] shrink-0 flex-col rounded-md border border-[var(--color-border-subtle)] border-t-2 border-t-[var(--color-border-medium)] bg-[var(--color-bg-elevated)] shadow-sm">
      <ColumnHeader columnId={columnId} />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {/* Cards will go here in Phase 3 */}
        <div className="flex flex-1 items-center justify-center rounded border border-dashed border-[var(--color-border-subtle)] py-8">
          <span className="text-xs text-[var(--color-text-muted)]">Drop cards here</span>
        </div>
      </div>
      <div className="p-3 pt-0">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
        >
          <span className="text-base leading-none">+</span>
          Add a card
        </button>
      </div>
    </div>
  )
}
