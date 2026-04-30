import type { ReactNode } from 'react'

import { useFocusTrap } from '../../hooks/useFocusTrap'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps): ReactNode {
  const focusTrapRef = useFocusTrap(isOpen)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
      role="presentation"
    >
      <div
        ref={focusTrapRef}
        className="w-[360px] rounded-lg border border-[var(--color-border-medium)] bg-[var(--color-bg-elevated)] p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
      >
        <h3 className="mb-2 text-base font-medium text-[var(--color-text-primary)]">{title}</h3>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-[var(--color-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-hover)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}