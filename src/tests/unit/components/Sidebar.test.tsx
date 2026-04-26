import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach,describe, expect, it } from 'vitest'

import { Sidebar } from '../../../components/layout/Sidebar'
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

describe('Sidebar', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders empty state when no boards', () => {
    render(<Sidebar onCreateBoard={vi.fn()} />)
    expect(screen.getByText('Boards')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /New Board/ })).toBeInTheDocument()
  })

  it('renders board list from store', () => {
    const state = useKanbanStore.getState()
    state.createBoard('Board One')
    state.createBoard('Board Two')

    render(<Sidebar onCreateBoard={vi.fn()} />)
    expect(screen.getByText('Board One')).toBeInTheDocument()
    expect(screen.getByText('Board Two')).toBeInTheDocument()
  })

  it('highlights active board', () => {
    const state = useKanbanStore.getState()
    state.createBoard('Active Board')

    render(<Sidebar onCreateBoard={vi.fn()} />)
    const activeButton = screen.getByText('Active Board')
    expect(activeButton).toBeInTheDocument()
    expect(activeButton.closest('button')).toHaveClass('border-l-2')
  })

  it('calls setActiveBoard when clicking a board', async () => {
    const state = useKanbanStore.getState()
    const boardId = state.createBoard('Clickable Board')
    useKanbanStore.getState().setActiveBoard(null)

    render(<Sidebar onCreateBoard={vi.fn()} />)
    await userEvent.click(screen.getByText('Clickable Board'))

    expect(useKanbanStore.getState().activeBoardId).toBe(boardId)
  })

  it('calls onCreateBoard when clicking new board button', async () => {
    const onCreateBoard = vi.fn()
    render(<Sidebar onCreateBoard={onCreateBoard} />)

    await userEvent.click(screen.getByRole('button', { name: /New Board/ }))
    expect(onCreateBoard).toHaveBeenCalledTimes(1)
  })
})
