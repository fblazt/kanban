import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect,it } from 'vitest'

import { AddColumnButton } from '../../../components/board/AddColumnButton'

describe('AddColumnButton', () => {
  it('renders add button in collapsed state', () => {
    render(<AddColumnButton onAdd={vi.fn()} />)
    expect(screen.getByText('Add Column')).toBeInTheDocument()
  })

  it('expands to input on click', async () => {
    render(<AddColumnButton onAdd={vi.fn()} />)
    await userEvent.click(screen.getByText('Add Column'))

    expect(screen.getByPlaceholderText('Enter column title...')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onAdd with title when submitting', async () => {
    const onAdd = vi.fn()
    render(<AddColumnButton onAdd={onAdd} />)

    await userEvent.click(screen.getByText('Add Column'))
    const input = screen.getByPlaceholderText('Enter column title...')
    await userEvent.type(input, 'Review')
    await userEvent.click(screen.getByText('Add Column'))

    expect(onAdd).toHaveBeenCalledWith('Review')
  })

  it('does not call onAdd for empty title', async () => {
    const onAdd = vi.fn()
    render(<AddColumnButton onAdd={onAdd} />)

    await userEvent.click(screen.getByText('Add Column'))
    await userEvent.click(screen.getByText('Add Column'))

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('collapses on cancel', async () => {
    render(<AddColumnButton onAdd={vi.fn()} />)

    await userEvent.click(screen.getByText('Add Column'))
    await userEvent.click(screen.getByText('Cancel'))

    expect(screen.queryByPlaceholderText('Enter column title...')).not.toBeInTheDocument()
    expect(screen.getByText('Add Column')).toBeInTheDocument()
  })

  it('collapses on Escape', async () => {
    render(<AddColumnButton onAdd={vi.fn()} />)

    await userEvent.click(screen.getByText('Add Column'))
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByPlaceholderText('Enter column title...')).not.toBeInTheDocument()
  })
})
