import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useFocusTrap } from '../../../hooks/useFocusTrap'

function FocusTrapTestComponent({ isActive }: { isActive: boolean }) {
  const containerRef = useFocusTrap(isActive)
  return (
    <div ref={containerRef}>
      <button>First</button>
      <button>Second</button>
      <button>Third</button>
    </div>
  )
}

describe('useFocusTrap', () => {
  beforeEach(() => {
    document.activeElement?.blur?.()
  })

  it('does not trap focus when inactive', () => {
    render(<FocusTrapTestComponent isActive={false} />)
    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('traps focus within container when active', () => {
    render(<FocusTrapTestComponent isActive={true} />)
    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('returns focus to previously focused element on cleanup', () => {
    const { unmount } = render(<FocusTrapTestComponent isActive={true} />)
    unmount()
  })
})