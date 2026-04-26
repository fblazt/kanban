import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { LabelBadge } from '../../../components/card/LabelBadge'
import { useKanbanStore } from '../../../store/kanbanStore'

describe('LabelBadge', () => {
  beforeEach(() => {
    useKanbanStore.setState({
      boards: {},
      columns: {},
      cards: {},
      labels: {},
      activeBoardId: null,
    })
  })

  it('renders label name with color', () => {
    useKanbanStore.setState({
      labels: { 'label-1': { id: 'label-1', name: 'Bug', color: '#ef4444' } },
    })

    render(<LabelBadge labelId="label-1" />)
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('renders nothing for non-existent label', () => {
    const { container } = render(<LabelBadge labelId="nonexistent" />)
    expect(container.innerHTML).toBe('')
  })
})