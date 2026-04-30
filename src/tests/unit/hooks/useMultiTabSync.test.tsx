import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useMultiTabSync } from '../../../hooks/useMultiTabSync'
import { useKanbanStore } from '../../../store/kanbanStore'

function TestWrapper() {
  useMultiTabSync()
  return <div data-testid="sync-wrapper">Sync Active</div>
}

describe('useMultiTabSync', () => {
  beforeEach(() => {
    useKanbanStore.setState({
      boards: {},
      columns: {},
      cards: {},
      labels: {},
      activeBoardId: null,
    })
  })

  it('renders without errors', () => {
    const { unmount } = render(<TestWrapper />)
    expect(unmount).toBeDefined()
  })

  it('listens for storage events on kanban-app-state key', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    render(<TestWrapper />)

    const storageCall = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === 'storage'
    )
    expect(storageCall).toBeDefined()
    addEventListenerSpy.mockRestore()
  })

  it('removes storage listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<TestWrapper />)

    unmount()

    const storageCall = removeEventListenerSpy.mock.calls.find(
      (call) => call[0] === 'storage'
    )
    expect(storageCall).toBeDefined()
    removeEventListenerSpy.mockRestore()
  })
})