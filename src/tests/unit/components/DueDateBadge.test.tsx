import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { DueDateBadge } from '../../../components/card/DueDateBadge'
import { useKanbanStore } from '../../../store/kanbanStore'

describe('DueDateBadge', () => {
  beforeEach(() => {
    useKanbanStore.setState({
      boards: {},
      columns: {},
      cards: {},
      labels: {},
      activeBoardId: null,
    })
  })

  it('renders nothing when dueDate is null', () => {
    const { container } = render(<DueDateBadge dueDate={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders formatted date string', () => {
    render(<DueDateBadge dueDate="2025-12-31T00:00:00.000Z" />)
    expect(screen.getByText(/Dec/)).toBeInTheDocument()
  })
})