import type { ReactNode } from 'react'

import { BoardView } from '../board/BoardView'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  onCreateBoard: () => void
}

export function AppShell({ onCreateBoard }: AppShellProps): ReactNode {
  return (
    <div className="flex h-svh bg-[var(--color-bg-base)]">
      <Sidebar onCreateBoard={onCreateBoard} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <BoardView />
      </div>
    </div>
  )
}
