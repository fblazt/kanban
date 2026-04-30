import { useEffect } from 'react'

import { useKanbanStore } from '../store/kanbanStore'

export function useMultiTabSync() {
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== 'kanban-app-state') return
      if (!e.newValue) return

      try {
        const parsed = JSON.parse(e.newValue)
        const state = parsed?.state
        if (!state) return

        const store = useKanbanStore.getState()
        store.importData(JSON.stringify(state))

        const newActiveId = state.activeBoardId ?? null
        if (store.activeBoardId !== newActiveId) {
          store.setActiveBoard(newActiveId)
        }
      } catch {
        // ignore malformed data from other tabs
      }
    }

    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])
}