import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { PriorityBadge } from '../../../components/card/PriorityBadge'
import { useKanbanStore } from '../../../store/kanbanStore'

describe('PriorityBadge', () => {
  beforeEach(() => {
    useKanbanStore.setState({
      boards: {},
      columns: {},
      cards: {},
      labels: {},
      activeBoardId: null,
    })
  })

  it('renders nothing when priority is null', () => {
    const { container } = render(<PriorityBadge priority={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders low priority with green dot', () => {
    render(<PriorityBadge priority="low" />)
    expect(screen.getByText('low')).toBeInTheDocument()
    expect(screen.getByText('low').closest('div')!.querySelector('.bg-emerald-500')).toBeInTheDocument()
  })

  it('renders medium priority with amber dot', () => {
    render(<PriorityBadge priority="medium" />)
    expect(screen.getByText('medium')).toBeInTheDocument()
  })

  it('renders high priority with red dot', () => {
    render(<PriorityBadge priority="high" />)
    expect(screen.getByText('high')).toBeInTheDocument()
  })
})