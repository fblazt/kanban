import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { CardModal } from '../../../components/card/CardModal'
import { useKanbanStore } from '../../../store/kanbanStore'
import type { Card } from '../../../types/kanban'

function resetStore() {
  useKanbanStore.setState({
    boards: {},
    columns: {},
    cards: {},
    labels: {},
    activeBoardId: null,
  })
}

function createTestCard(overrides: Partial<Card> = {}): { card: Card; cardId: string } {
  const boardId = useKanbanStore.getState().createBoard('Test')
  const columnId = useKanbanStore.getState().boards[boardId].columnIds[0]
  const cardId = useKanbanStore.getState().createCard(columnId, { title: 'Test Card' })
  if (overrides) {
    useKanbanStore.getState().updateCard(cardId, overrides)
  }
  return { card: useKanbanStore.getState().cards[cardId], cardId }
}

describe('CardModal', () => {
  beforeEach(() => {
    resetStore()
  })

  it('pre-fills title and description from card data', () => {
    const { card } = createTestCard({ description: 'Some desc' })
    const refreshedCard = useKanbanStore.getState().cards[card.id]

    render(<CardModal card={refreshedCard} isOpen={true} onClose={() => {}} />)

    const titleInput = screen.getByDisplayValue('Test Card')
    expect(titleInput).toBeInTheDocument()
    expect(screen.getByDisplayValue('Some desc')).toBeInTheDocument()
  })

  it('saves edited title and description on Save click', async () => {
    const { card } = createTestCard()
    const refreshedCard = useKanbanStore.getState().cards[card.id]
    const onClose = vi.fn()

    render(<CardModal card={refreshedCard} isOpen={true} onClose={onClose} />)

    const titleInput = screen.getByDisplayValue('Test Card')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated Card')

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(useKanbanStore.getState().cards[card.id].title).toBe('Updated Card')
    expect(onClose).toHaveBeenCalled()
  })

  it('closes on Cancel click without saving', async () => {
    const { card } = createTestCard()
    const refreshedCard = useKanbanStore.getState().cards[card.id]
    const onClose = vi.fn()

    render(<CardModal card={refreshedCard} isOpen={true} onClose={onClose} />)

    const titleInput = screen.getByDisplayValue('Test Card')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Should Not Save')

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(useKanbanStore.getState().cards[card.id].title).toBe('Test Card')
    expect(onClose).toHaveBeenCalled()
  })

  it('changes priority to high on click', async () => {
    const { card } = createTestCard()
    const refreshedCard = useKanbanStore.getState().cards[card.id]

    render(<CardModal card={refreshedCard} isOpen={true} onClose={() => {}} />)

    await userEvent.click(screen.getByRole('radio', { name: 'High' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(useKanbanStore.getState().cards[card.id].priority).toBe('high')
  })

  it('sets priority to none', async () => {
    const { card } = createTestCard({ priority: 'high' })
    const refreshedCard = useKanbanStore.getState().cards[card.id]

    render(<CardModal card={refreshedCard} isOpen={true} onClose={() => {}} />)

    await userEvent.click(screen.getByRole('radio', { name: 'None' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(useKanbanStore.getState().cards[card.id].priority).toBeNull()
  })

  it('shows delete confirm and deletes card', async () => {
    const { card } = createTestCard()
    const refreshedCard = useKanbanStore.getState().cards[card.id]

    render(<CardModal card={refreshedCard} isOpen={true} onClose={() => {}} />)

    await userEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()

    const dialog = screen.getByRole('alertdialog')
    const buttons = dialog.querySelectorAll('button')
    const deleteBtn = buttons[buttons.length - 1]
    await userEvent.click(deleteBtn)

    expect(useKanbanStore.getState().cards[card.id]).toBeUndefined()
  })

  it('returns null when isOpen is false', () => {
    const { card } = createTestCard()
    const refreshedCard = useKanbanStore.getState().cards[card.id]

    const { container } = render(<CardModal card={refreshedCard} isOpen={false} onClose={() => {}} />)
    expect(container.innerHTML).toBe('')
  })
})