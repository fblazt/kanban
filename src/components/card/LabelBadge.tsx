import type { ReactNode } from 'react'

import { useKanbanStore } from '../../store/kanbanStore'
import type { Id } from '../../types/kanban'

interface LabelBadgeProps {
  labelId: Id
}

export function LabelBadge({ labelId }: LabelBadgeProps): ReactNode {
  const label = useKanbanStore((state) => state.labels[labelId])

  if (!label) return null

  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-mono tracking-wide"
      style={{
        backgroundColor: label.color + '1a',
        borderLeft: `2px solid ${label.color}`,
        color: label.color,
      }}
    >
      {label.name}
    </span>
  )
}
