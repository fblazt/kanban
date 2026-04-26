import { Calendar } from 'lucide-react'
import type { ReactNode } from 'react'

import { formatDateShort, isOverdue } from '../../utils/date'

interface DueDateBadgeProps {
  dueDate: string | null
}

export function DueDateBadge({ dueDate }: DueDateBadgeProps): ReactNode {
  if (!dueDate) return null

  const overdue = isOverdue(dueDate)

  return (
    <div className={`flex items-center gap-1 ${overdue ? 'text-red-400' : 'text-[var(--color-text-muted)]'}`}>
      <Calendar size={12} />
      <span className="text-[11px] font-mono tracking-wide">{formatDateShort(dueDate)}</span>
    </div>
  )
}
