import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach,describe, expect, it } from 'vitest'

import { BoardView } from '../../../components/board/BoardView'
import { useKanbanStore } from '../../../store/kanbanStore'

function resetStore() {
  useKanbanStore.setState({
    boards: {},
    columns: {},
    cards: {},
    labels: {},
    activeBoardId: null,
  })
}

describe('BoardView', () => {
  beforeEach(() => {
    resetStore()
  })

  it('shows empty state when no board is active', () => {
    render(<BoardView />)
    expect(screen.getByText('No board selected')).toBeInTheDocument()
  })

  it('renders columns for active board', () => {
    useKanbanStore.getState().createBoard('Test Board')

    render(<BoardView />)
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('adds new column when AddColumnButton is used', async () => {
    useKanbanStore.getState().createBoard('Test Board')

    render(<BoardView />)
    await userEvent.click(screen.getByRole('button', { name: /Add Column/ }))

    const input = screen.getByPlaceholderText('Enter column title...')
    await userEvent.type(input, 'Review')
    await userEvent.click(screen.getByRole('button', { name: 'Add Column' }))

    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(Object.keys(useKanbanStore.getState().columns)).toHaveLength(4)
  })
})
