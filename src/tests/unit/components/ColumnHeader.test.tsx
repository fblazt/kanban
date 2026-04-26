import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach,describe, expect, it } from 'vitest'

import { ColumnHeader } from '../../../components/board/ColumnHeader'
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

describe('ColumnHeader', () => {
  beforeEach(() => {
    resetStore()
  })

  function createTestBoardAndGetFirstColumnId() {
    const boardId = useKanbanStore.getState().createBoard('Test')
    return useKanbanStore.getState().boards[boardId].columnIds[0]
  }

  it('renders column title and card count', () => {
    const columnId = createTestBoardAndGetFirstColumnId()

    render(<ColumnHeader columnId={columnId} />)
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('switches to edit mode when clicking title', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()

    render(<ColumnHeader columnId={columnId} />)
    await userEvent.click(screen.getByText('To Do'))

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('updates column title on blur', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()

    render(<ColumnHeader columnId={columnId} />)
    await userEvent.click(screen.getByText('To Do'))

    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'New Name')
    await userEvent.tab()

    expect(useKanbanStore.getState().columns[columnId].title).toBe('New Name')
  })

  it('shows confirm dialog when clicking delete', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()

    render(<ColumnHeader columnId={columnId} />)
    const deleteButton = screen.getByLabelText('Delete column')
    await userEvent.click(deleteButton)

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('deletes column on confirm', async () => {
    const columnId = createTestBoardAndGetFirstColumnId()

    render(<ColumnHeader columnId={columnId} />)
    await userEvent.click(screen.getByLabelText('Delete column'))

    // Click the red delete button (last button in dialog)
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons[buttons.length - 1]
    await userEvent.click(deleteButton)

    expect(useKanbanStore.getState().columns[columnId]).toBeUndefined()
  })
})
