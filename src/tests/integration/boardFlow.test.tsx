import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import App from '../../App'
import { useKanbanStore } from '../../store/kanbanStore'

function resetStore() {
  useKanbanStore.setState({
    boards: {},
    columns: {},
    cards: {},
    labels: {},
    activeBoardId: null,
  })
}

describe('Board lifecycle integration', () => {
  beforeEach(() => {
    resetStore()
  })

  it('creates board via sidebar and shows default columns', async () => {
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: /New Board/ }))
    const input = screen.getByPlaceholderText('Board title')
    await userEvent.type(input, 'My Project')
    await userEvent.click(screen.getByRole('button', { name: 'Create' }))

    expect(screen.getAllByText('My Project')[0]).toBeInTheDocument()
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renames column and reflects in header', async () => {
    useKanbanStore.getState().createBoard('Test Board')

    render(<App />)
    await userEvent.click(screen.getByText('To Do'))

    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'Backlog')
    await userEvent.tab()

    expect(screen.getByText('Backlog')).toBeInTheDocument()
  })

  it('deletes column with cards and shows confirm', async () => {
    const boardId = useKanbanStore.getState().createBoard('Test Board')
    const columnId = useKanbanStore.getState().boards[boardId].columnIds[0]
    useKanbanStore.getState().createCard(columnId, { title: 'Task 1' })

    render(<App />)
    const deleteButtons = screen.getAllByLabelText('Delete column')
    await userEvent.click(deleteButtons[0])

    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toBeInTheDocument()
    expect(screen.getByText(/contains 1 card/)).toBeInTheDocument()

    const dialogButtons = dialog.querySelectorAll('button')
    const deleteButton = dialogButtons[dialogButtons.length - 1]
    await userEvent.click(deleteButton)

    expect(useKanbanStore.getState().columns[columnId]).toBeUndefined()
  })

  it('persists after creating board and columns', async () => {
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: /New Board/ }))
    await userEvent.type(screen.getByPlaceholderText('Board title'), 'Persisted')
    await userEvent.click(screen.getByRole('button', { name: 'Create' }))

    await userEvent.click(screen.getAllByRole('button', { name: /Add Column/ })[0])
    await userEvent.type(screen.getByPlaceholderText('Enter column title...'), 'Review')
    await userEvent.click(screen.getByRole('button', { name: 'Add Column' }))

    const state = useKanbanStore.getState()
    expect(Object.values(state.boards)[0].title).toBe('Persisted')
    expect(Object.values(state.columns)).toHaveLength(4)
  })

  it('creates card via inline input in column', async () => {
    useKanbanStore.getState().createBoard('Card Board')

    render(<App />)
    await userEvent.click(screen.getAllByRole('button', { name: /Add a card/ })[0])

    const input = screen.getByPlaceholderText('Enter card title...')
    await userEvent.type(input, 'New Task')
    await userEvent.click(screen.getByRole('button', { name: 'Add Card' }))

    expect(screen.getByText('New Task')).toBeInTheDocument()
    const state = useKanbanStore.getState()
    expect(Object.values(state.cards)).toHaveLength(1)
  })

  it('edits card title via modal', async () => {
    const boardId = useKanbanStore.getState().createBoard('Card Board')
    const columnId = useKanbanStore.getState().boards[boardId].columnIds[0]
    useKanbanStore.getState().createCard(columnId, { title: 'Old Task' })

    render(<App />)
    await userEvent.click(screen.getByText('Old Task'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const titleInput = screen.getByDisplayValue('Old Task')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated Task')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByText('Updated Task')).toBeInTheDocument()
  })

  it('deletes card with confirm dialog', async () => {
    const boardId = useKanbanStore.getState().createBoard('Card Board')
    const columnId = useKanbanStore.getState().boards[boardId].columnIds[0]
    useKanbanStore.getState().createCard(columnId, { title: 'Gone Task' })

    render(<App />)
    await userEvent.click(screen.getByLabelText('Delete card'))

    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toBeInTheDocument()

    const buttons = dialog.querySelectorAll('button')
    const deleteButton = buttons[buttons.length - 1]
    await userEvent.click(deleteButton)

    const state = useKanbanStore.getState()
    expect(Object.values(state.cards)).toHaveLength(0)
  })
})