import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useKanbanStore } from '../../store/kanbanStore'
import type { Card, Id, Priority } from '../../types/kanban'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { DueDateBadge } from './DueDateBadge'

interface CardModalProps {
  card: Card
  isOpen: boolean
  onClose: () => void
}

export function CardModal({ card, isOpen, onClose }: CardModalProps): ReactNode {
  const updateCard = useKanbanStore((state) => state.updateCard)
  const deleteCard = useKanbanStore((state) => state.deleteCard)
  const labels = useKanbanStore((state) => state.labels)
  const board = useKanbanStore((state) =>
    card ? state.boards[card.boardId] : null
  )
  const createLabel = useKanbanStore((state) => state.createLabel)
  const deleteLabel = useKanbanStore((state) => state.deleteLabel)
  const isMobile = useMediaQuery('(max-width: 767px)')

  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description)
  const [priority, setPriority] = useState<Priority | null>(card.priority)
  const [selectedLabels, setSelectedLabels] = useState<Id[]>(card.labels)
  const [dueDate, setDueDate] = useState<string | null>(card.dueDate)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('#f59e0b')
  const [showLabelForm, setShowLabelForm] = useState(false)

  const focusTrapRef = useFocusTrap(isOpen)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !card) return null

  const boardLabels = board?.labelIds.map((id) => labels[id]).filter(Boolean) ?? []

  const handleSave = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    updateCard(card.id, {
      title: trimmed,
      description,
      priority,
      labels: selectedLabels,
      dueDate,
    })
    onClose()
  }

  const handleDelete = () => {
    deleteCard(card.id)
    setShowDeleteConfirm(false)
    onClose()
  }

  const toggleLabel = (labelId: Id) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    )
  }

  const handleCreateLabel = () => {
    const trimmed = newLabelName.trim()
    if (!trimmed || !board) return
    createLabel(board.id, trimmed, newLabelColor)
    setNewLabelName('')
    setShowLabelForm(false)
  }

  const handleDeleteLabel = (labelId: Id) => {
    deleteLabel(labelId)
    setSelectedLabels((prev) => prev.filter((id) => id !== labelId))
  }

  const priorityOptions: { value: Priority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ]

  const labelColors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280']

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        role="presentation"
      >
        <div
          ref={focusTrapRef}
          className={
            isMobile
              ? 'flex h-full w-full flex-col overflow-y-auto bg-[var(--color-bg-elevated)]'
              : 'w-full max-w-[520px] rounded-lg border border-[var(--color-border-medium)] bg-[var(--color-bg-elevated)] p-6 shadow-lg'
          }
          role="dialog"
          aria-modal="true"
          aria-label={`Edit card: ${card.title}`}
        >
          {isMobile && (
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-2 py-1 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
              >
                Cancel
              </button>
              <h2 className="text-sm font-medium text-[var(--color-text-secondary)]">Edit Card</h2>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-md bg-[var(--color-accent)] px-3 py-1 text-sm font-medium text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]"
              >
                Save
              </button>
            </div>
          )}

          <div className={isMobile ? 'flex-1 overflow-y-auto p-4' : ''}>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4 w-full border-b border-transparent bg-transparent text-lg font-semibold text-[var(--color-text-primary)] outline-none focus:border-[var(--color-border-medium)]"
              aria-label="Card title"
            />

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                rows={4}
                className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-medium)]"
                aria-label="Card description"
              />
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Priority
              </label>
              <div className="flex gap-2" role="radiogroup" aria-label="Card priority">
                <button
                  type="button"
                  onClick={() => setPriority(null)}
                  role="radio"
                  aria-checked={priority === null}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    priority === null
                      ? 'bg-[var(--color-bg-active)] text-[var(--color-text-primary)]'
                      : 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]'
                  }`}
                >
                  None
                </button>
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    role="radio"
                    aria-checked={priority === opt.value}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      priority === opt.value
                        ? opt.value === 'low'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : opt.value === 'medium'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-red-500/15 text-red-400'
                        : 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Labels
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                {boardLabels.map((label) => (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label.id)}
                    className={`group relative inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono tracking-wide transition-opacity ${
                      selectedLabels.includes(label.id) ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                    }`}
                    style={{
                      backgroundColor: label.color + '1a',
                      borderLeft: `2px solid ${label.color}`,
                      color: label.color,
                    }}
                  >
                    {label.name}
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteLabel(label.id)
                      }}
                      className="ml-0.5 inline-flex h-3 w-3 cursor-pointer items-center justify-center rounded-full text-[9px] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/20"
                      role="button"
                      aria-label={`Delete label ${label.name}`}
                    >
                      x
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowLabelForm((prev) => !prev)}
                  className="rounded-md border border-dashed border-[var(--color-border-medium)] px-2 py-0.5 text-[11px] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  + New
                </button>
              </div>

              {showLabelForm && (
                <div className="flex items-center gap-2 rounded-md bg-[var(--color-bg-surface)] p-2">
                  <input
                    type="text"
                    placeholder="Label name"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateLabel()
                      if (e.key === 'Escape') setShowLabelForm(false)
                    }}
                    autoFocus
                    className="flex-1 rounded bg-transparent px-2 py-1 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                    aria-label="New label name"
                  />
                  <div className="flex gap-1">
                    {labelColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewLabelColor(color)}
                        className={`h-5 w-5 rounded-full transition-transform ${
                          newLabelColor === color ? 'scale-110 ring-2 ring-white/30' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateLabel}
                    className="rounded-md bg-[var(--color-accent)] px-2 py-1 text-xs font-medium text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)]"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Due Date
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={dueDate ?? ''}
                  onChange={(e) => setDueDate(e.target.value || null)}
                  className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-border-medium)]"
                  aria-label="Due date"
                />
                {dueDate && (
                  <button
                    type="button"
                    onClick={() => setDueDate(null)}
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                  >
                    Clear
                  </button>
                )}
              </div>
              {dueDate && (
                <div className="mt-1.5">
                  <DueDateBadge dueDate={dueDate} />
                </div>
              )}
            </div>

            {!isMobile && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-red-400"
                >
                  Delete
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md bg-[var(--color-bg-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-hover)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-hover)]"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Card"
        message={`Are you sure you want to delete "${card.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}