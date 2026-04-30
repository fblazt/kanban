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

describe('Card detail editing integration', () => {
  beforeEach(() => {
    resetStore()
  })

  it('opens modal, edits title/description/priority, saves', async () => {
    const boardId = useKanbanStore.getState().createBoard('Board')
    const columnId = useKanbanStore.getState().boards[boardId].columnIds[0]
    useKanbanStore.getState().createCard(columnId, { title: 'Task' })

    render(<App />)
    await userEvent.click(screen.getByText('Task'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const titleInput = screen.getByDisplayValue('Task')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated Task')

    const textarea = screen.getByPlaceholderText('Add a more detailed description...')
    await userEvent.type(textarea, 'New description')

    await userEvent.click(screen.getByRole('radio', { name: 'High' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    const state = useKanbanStore.getState()
    const card = Object.values(state.cards)[0]
    expect(card.title).toBe('Updated Task')
    expect(card.description).toBe('New description')
    expect(card.priority).toBe('high')
  })

  it('closes modal without saving on Cancel', async () => {
    const boardId = useKanbanStore.getState().createBoard('Board')
    const columnId = useKanbanStore.getState().boards[boardId].columnIds[0]
    useKanbanStore.getState().createCard(columnId, { title: 'Original' })

    render(<App />)
    await userEvent.click(screen.getByText('Original'))

    const titleInput = screen.getByDisplayValue('Original')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Changed')

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    const card = Object.values(useKanbanStore.getState().cards)[0]
    expect(card.title).toBe('Original')
  })

  it('deletes card from modal', async () => {
    const boardId = useKanbanStore.getState().createBoard('Board')
    const columnId = useKanbanStore.getState().boards[boardId].columnIds[0]
    useKanbanStore.getState().createCard(columnId, { title: 'ToRemove' })

    render(<App />)
    await userEvent.click(screen.getByText('ToRemove'))

    const dialog = screen.getByRole('dialog')
    const deleteButton = dialog.querySelector('button[class*="hover:text-red-400"]')
    await userEvent.click(deleteButton!)

    const confirmDialog = screen.getByRole('alertdialog')
    const buttons = confirmDialog.querySelectorAll('button')
    await userEvent.click(buttons[buttons.length - 1])

    expect(Object.values(useKanbanStore.getState().cards)).toHaveLength(0)
  })

  it('assigns and displays labels on card', async () => {
    const boardId = useKanbanStore.getState().createBoard('Board')
    const columnId = useKanbanStore.getState().boards[boardId].columnIds[0]
    useKanbanStore.getState().createCard(columnId, { title: 'Labeled' })

    render(<App />)
    await userEvent.click(screen.getByText('Labeled'))

    await userEvent.click(screen.getByText('+ New'))

    const labelInput = screen.getByPlaceholderText('Label name')
    await userEvent.type(labelInput, 'Bug')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    await userEvent.click(screen.getByText('Bug'))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    const card = Object.values(useKanbanStore.getState().cards)[0]
    expect(card.labels).toHaveLength(1)
  })

  it('sets due date on card', async () => {
    const boardId = useKanbanStore.getState().createBoard('Board')
    const columnId = useKanbanStore.getState().boards[boardId].columnIds[0]
    useKanbanStore.getState().createCard(columnId, { title: 'Dated' })

    render(<App />)
    await userEvent.click(screen.getByText('Dated'))

    const dialog = screen.getByRole('dialog')
    const dateInput = dialog.querySelector('input[type="date"]') as HTMLInputElement
    await userEvent.type(dateInput, '2025-12-31')

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    const card = Object.values(useKanbanStore.getState().cards)[0]
    expect(card.dueDate).toBeTruthy()
  })
})

describe('Export/Import integration', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders export and import buttons when board is active', async () => {
    useKanbanStore.getState().createBoard('Export Board')

    render(<App />)

    expect(screen.getByLabelText('Export board data')).toBeInTheDocument()
    expect(screen.getByLabelText('Import board data')).toBeInTheDocument()
  })
})