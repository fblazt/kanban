import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach,describe, expect, it } from 'vitest'

import { Header } from '../../../components/layout/Header'
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

describe('Header', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders empty header when no active board', () => {
    render(<Header />)
    expect(document.querySelector('header')).toBeInTheDocument()
  })

  it('displays active board title', () => {
    useKanbanStore.getState().createBoard('My Project')

    render(<Header />)
    expect(screen.getByText('My Project')).toBeInTheDocument()
  })

  it('switches to edit mode when clicking title', async () => {
    useKanbanStore.getState().createBoard('Editable Board')

    render(<Header />)
    await userEvent.click(screen.getByText('Editable Board'))

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('saves edited title on blur', async () => {
    useKanbanStore.getState().createBoard('Old Title')

    render(<Header />)
    await userEvent.click(screen.getByText('Old Title'))

    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'New Title')
    await userEvent.tab()

    expect(screen.getByText('New Title')).toBeInTheDocument()
    const boards = Object.values(useKanbanStore.getState().boards)
    expect(boards[0].title).toBe('New Title')
  })

  it('cancels editing on Escape', async () => {
    useKanbanStore.getState().createBoard('Escape Test')

    render(<Header />)
    await userEvent.click(screen.getByText('Escape Test'))

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Changed')
    await userEvent.keyboard('{Escape}')

    expect(screen.getByText('Escape Test')).toBeInTheDocument()
  })

  it('shows confirm dialog when clicking delete', async () => {
    useKanbanStore.getState().createBoard('Deletable')

    render(<Header />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete Board' }))

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Delete Board' })).toBeInTheDocument()
  })

  it('deletes board and clears active on confirm', async () => {
    useKanbanStore.getState().createBoard('Gone')

    render(<Header />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete Board' }))

    // Click the red delete button (last button in dialog)
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons[buttons.length - 1]
    await userEvent.click(deleteButton)

    expect(useKanbanStore.getState().activeBoardId).toBeNull()
    expect(Object.keys(useKanbanStore.getState().boards)).toHaveLength(0)
  })
})
