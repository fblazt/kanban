import { render, screen } from '@testing-library/react'
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

describe('CardModal accessibility', () => {
  beforeEach(() => {
    resetStore()
  })

  it('has dialog role with aria-modal', () => {
    const { card } = createTestCard()
    const refreshedCard = useKanbanStore.getState().cards[card.id]

    render(<CardModal card={refreshedCard} isOpen={true} onClose={() => {}} />)

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('has aria-label on card title input', () => {
    const { card } = createTestCard()
    const refreshedCard = useKanbanStore.getState().cards[card.id]

    render(<CardModal card={refreshedCard} isOpen={true} onClose={() => {}} />)

    expect(screen.getByLabelText('Card title')).toBeInTheDocument()
  })

  it('has radiogroup for priority', () => {
    const { card } = createTestCard()
    const refreshedCard = useKanbanStore.getState().cards[card.id]

    render(<CardModal card={refreshedCard} isOpen={true} onClose={() => {}} />)

    expect(screen.getByRole('radiogroup', { name: /card priority/i })).toBeInTheDocument()
  })

  it('has aria-label on dialog', () => {
    const { card } = createTestCard()
    const refreshedCard = useKanbanStore.getState().cards[card.id]

    render(<CardModal card={refreshedCard} isOpen={true} onClose={() => {}} />)

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', expect.stringContaining('Test Card'))
  })

  it('priority buttons have radio role with aria-checked', () => {
    const { card } = createTestCard({ priority: 'high' })
    const refreshedCard = useKanbanStore.getState().cards[card.id]

    render(<CardModal card={refreshedCard} isOpen={true} onClose={() => {}} />)

    const highRadio = screen.getByRole('radio', { name: 'High' })
    expect(highRadio).toHaveAttribute('aria-checked', 'true')

    const noneRadio = screen.getByRole('radio', { name: 'None' })
    expect(noneRadio).toHaveAttribute('aria-checked', 'false')
  })
})