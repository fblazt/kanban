import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { Card } from '../../../components/board/Card'
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

describe('Card', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders card title', () => {
    const columnId = createTestBoardAndGetFirstColumnId()
    const cardId = useKanbanStore.getState().createCard(columnId, { title: 'My Task' })

    render(<Card cardId={cardId} />)
    expect(screen.getByText('My Task')).toBeInTheDocument()
  })

  it('renders description preview', () => {
    const columnId = createTestBoardAndGetFirstColumnId()
    const cardId = useKanbanStore.getState().createCard(columnId, {
      title: 'Task',
      description: 'A detailed description of the task',
    })

    render(<Card cardId={cardId} />)
    expect(screen.getByText('A detailed description of the task')).toBeInTheDocument()
  })

  it('shows priority badge when set', () => {
    const columnId = createTestBoardAndGetFirstColumnId()
    useKanbanStore.getState().createCard(columnId, { title: 'High', priority: 'high' })
    const cardId = Object.keys(useKanbanStore.getState().cards)[0]

    render(<Card cardId={cardId} />)
    expect(screen.getByText('high')).toBeInTheDocument()
  })

  it('shows label badge when card has labels', () => {
    const boardId = useKanbanStore.getState().createBoard('Test')
    const columnId = useKanbanStore.getState().boards[boardId].columnIds[0]
    const labelId = useKanbanStore.getState().createLabel(boardId, 'Bug', '#ef4444')
    const cardId = useKanbanStore.getState().createCard(columnId, { title: 'Labeled', labels: [labelId] })

    render(<Card cardId={cardId} />)
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('shows due date badge when card has due date', () => {
    const columnId = createTestBoardAndGetFirstColumnId()
    const cardId = useKanbanStore.getState().createCard(columnId, {
      title: 'Dated',
      dueDate: '2025-12-31T00:00:00.000Z',
    })

    render(<Card cardId={cardId} />)
    expect(screen.getByText(/Dec/)).toBeInTheDocument()
  })

  it('opens CardModal when clicking title', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()
    const cardId = useKanbanStore.getState().createCard(columnId, { title: 'Clickable' })

    render(<Card cardId={cardId} />)
    await userEvent.click(screen.getByText('Clickable'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows confirm dialog when clicking delete', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()
    const cardId = useKanbanStore.getState().createCard(columnId, { title: 'To Delete' })

    render(<Card cardId={cardId} />)
    await userEvent.click(screen.getByLabelText('Delete card'))

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('deletes card on confirm', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()
    const cardId = useKanbanStore.getState().createCard(columnId, { title: 'Gone' })

    render(<Card cardId={cardId} />)
    await userEvent.click(screen.getByLabelText('Delete card'))

    const dialog = screen.getByRole('alertdialog')
    const buttons = dialog.querySelectorAll('button')
    const deleteButton = buttons[buttons.length - 1]
    await userEvent.click(deleteButton)

    expect(useKanbanStore.getState().cards[cardId]).toBeUndefined()
  })
})