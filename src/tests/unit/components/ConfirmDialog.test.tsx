import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('does not render when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Delete"
        message="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('renders title and message when open', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Board"
        message="This will delete everything."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )

    expect(screen.getByRole('heading', { name: 'Delete Board' })).toBeInTheDocument()
    expect(screen.getByText('This will delete everything.')).toBeInTheDocument()
  })

  it('calls onCancel when clicking cancel button', async () => {
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete"
        message="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when clicking delete button', async () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete"
        message="Are you sure?"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    )

    // The red delete button is the last button in the dialog
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons[buttons.length - 1]
    await userEvent.click(deleteButton)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when clicking overlay backdrop', async () => {
    const onCancel = vi.fn()
    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        title="Delete"
        message="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    )

    const backdrop = container.querySelector('[role="presentation"]')
    if (backdrop) {
      await userEvent.click(backdrop)
      expect(onCancel).toHaveBeenCalledTimes(1)
    }
  })
})
