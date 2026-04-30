import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'

import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useMultiTabSync } from '../../hooks/useMultiTabSync'
import { BoardView } from '../board/BoardView'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  onCreateBoard: () => void
}

export function AppShell({ onCreateBoard }: AppShellProps): ReactNode {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useMultiTabSync()

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  return (
    <div className="flex h-svh bg-[var(--color-bg-base)]">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: always visible on desktop, drawer on mobile */}
      <div
        className={
          isMobile
            ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : ''
        }
      >
        <Sidebar onCreateBoard={onCreateBoard} onBoardSelect={isMobile ? closeSidebar : undefined} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuToggle={isMobile ? () => setSidebarOpen(true) : undefined} />
        <BoardView />
      </div>
    </div>
  )
}