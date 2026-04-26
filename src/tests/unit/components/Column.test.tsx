import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { Column } from '../../../components/board/Column'
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

function createTestBoardAndGetFirstColumnId() {
  const boardId = useKanbanStore.getState().createBoard('Test')
  return useKanbanStore.getState().boards[boardId].columnIds[0]
}

describe('Column', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders empty state when no cards', () => {
    const columnId = createTestBoardAndGetFirstColumnId()

    render(<Column columnId={columnId} />)
    expect(screen.getByText('Drop cards here')).toBeInTheDocument()
  })

  it('renders cards when present', () => {
    const columnId = createTestBoardAndGetFirstColumnId()
    useKanbanStore.getState().createCard(columnId, { title: 'Task 1' })
    useKanbanStore.getState().createCard(columnId, { title: 'Task 2' })

    render(<Column columnId={columnId} />)
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('shows inline input when clicking Add a card', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()

    render(<Column columnId={columnId} />)
    await userEvent.click(screen.getByRole('button', { name: /Add a card/ }))

    expect(screen.getByPlaceholderText('Enter card title...')).toBeInTheDocument()
  })

  it('creates card when submitting inline input', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()

    render(<Column columnId={columnId} />)
    await userEvent.click(screen.getByRole('button', { name: /Add a card/ }))

    const input = screen.getByPlaceholderText('Enter card title...')
    await userEvent.type(input, 'New Task')
    await userEvent.click(screen.getByRole('button', { name: 'Add Card' }))

    expect(screen.getByText('New Task')).toBeInTheDocument()
    expect(useKanbanStore.getState().columns[columnId].cardIds).toHaveLength(1)
  })

  it('cancels card creation on Cancel click', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()

    render(<Column columnId={columnId} />)
    await userEvent.click(screen.getByRole('button', { name: /Add a card/ }))

    const input = screen.getByPlaceholderText('Enter card title...')
    await userEvent.type(input, 'Aborted')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByText('Aborted')).not.toBeInTheDocument()
    expect(useKanbanStore.getState().columns[columnId].cardIds).toHaveLength(0)
  })

  it('cancels card creation on Escape key', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()

    render(<Column columnId={columnId} />)
    await userEvent.click(screen.getByRole('button', { name: /Add a card/ }))

    const input = screen.getByPlaceholderText('Enter card title...')
    await userEvent.type(input, 'Aborted')
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByText('Aborted')).not.toBeInTheDocument()
  })
})
