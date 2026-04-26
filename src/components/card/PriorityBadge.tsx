import type { ReactNode } from 'react'

import type { Priority } from '../../types/kanban'

interface PriorityBadgeProps {
  priority: Priority | null
}

export function PriorityBadge({ priority }: PriorityBadgeProps): ReactNode {
  if (!priority) return null

  const config = {
    low: { color: 'bg-emerald-500', text: 'text-emerald-400' },
    medium: { color: 'bg-amber-500', text: 'text-amber-400' },
    high: { color: 'bg-red-500', text: 'text-red-400' },
  }

  const { color, text } = config[priority]

  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      <span className={`text-[11px] uppercase tracking-wide ${text}`}>{priority}</span>
    </div>
  )
}
