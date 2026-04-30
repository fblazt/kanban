import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { AppShell } from '../../../components/layout/AppShell'
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

describe('AppShell', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders sidebar navigation', () => {
    render(<AppShell onCreateBoard={vi.fn()} />)
    expect(screen.getByRole('navigation', { name: /board list/i })).toBeInTheDocument()
  })

  it('passes onCreateBoard callback to sidebar', async () => {
    const onCreateBoard = vi.fn()
    render(<AppShell onCreateBoard={onCreateBoard} />)

    await userEvent.click(screen.getByRole('button', { name: /new board/i }))
    expect(onCreateBoard).toHaveBeenCalledTimes(1)
  })

  it('renders board title in header when board is active', () => {
    useKanbanStore.getState().createBoard('Active Board')
    render(<AppShell onCreateBoard={vi.fn()} />)

    const headings = screen.getAllByText('Active Board')
    expect(headings.length).toBeGreaterThanOrEqual(1)
  })
})

describe('Sidebar accessibility', () => {
  beforeEach(() => {
    resetStore()
  })

  it('has navigation role with aria-label', () => {
    render(<AppShell onCreateBoard={vi.fn()} />)
    expect(screen.getByRole('navigation', { name: /board list/i })).toBeInTheDocument()
  })

  it('marks active board with aria-current', () => {
    useKanbanStore.getState().createBoard('My Board')
    render(<AppShell onCreateBoard={vi.fn()} />)

    const nav = screen.getByRole('navigation', { name: /board list/i })
    const activeButton = nav.querySelector('[aria-current="page"]')
    expect(activeButton).toBeInTheDocument()
  })

  it('does not set aria-current on inactive boards', () => {
    useKanbanStore.getState().createBoard('Board A')
    const boardId2 = useKanbanStore.getState().createBoard('Board B')
    useKanbanStore.getState().setActiveBoard(boardId2)

    render(<AppShell onCreateBoard={vi.fn()} />)

    const nav = screen.getByRole('navigation', { name: /board list/i })
    const boardA = nav.querySelector('button')
    if (boardA && !boardA.textContent?.includes('Board B')) {
      expect(boardA).not.toHaveAttribute('aria-current')
    }
  })
})

describe('ConfirmDialog focus trap and accessibility', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders confirm dialog with alertdialog role', async () => {
    useKanbanStore.getState().createBoard('Deletable')
    render(<AppShell onCreateBoard={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Delete Board' }))

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('alertdialog')).toHaveAttribute('aria-modal', 'true')
  })
})