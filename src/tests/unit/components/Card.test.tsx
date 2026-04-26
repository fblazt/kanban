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

  it('shows priority badge when set', () => {
    const columnId = createTestBoardAndGetFirstColumnId()
    useKanbanStore.getState().createCard(columnId, { title: 'High Priority', priority: 'high' })
    const cardId = Object.keys(useKanbanStore.getState().cards)[0]

    render(<Card cardId={cardId} />)
    expect(screen.getByText('high')).toBeInTheDocument()
  })

  it('switches to edit mode when clicking title', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()
    const cardId = useKanbanStore.getState().createCard(columnId, { title: 'Editable' })

    render(<Card cardId={cardId} />)
    await userEvent.click(screen.getByText('Editable'))

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('updates card title on blur', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()
    const cardId = useKanbanStore.getState().createCard(columnId, { title: 'Old' })

    render(<Card cardId={cardId} />)
    await userEvent.click(screen.getByText('Old'))

    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'New')
    await userEvent.tab()

    expect(useKanbanStore.getState().cards[cardId].title).toBe('New')
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
