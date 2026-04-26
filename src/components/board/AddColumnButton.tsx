import type { ReactNode } from 'react'
import { useEffect,useRef, useState } from 'react'

interface AddColumnButtonProps {
  onAdd: (title: string) => void
}

export function AddColumnButton({ onAdd }: AddColumnButtonProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSubmit = () => {
    const trimmed = title.trim()
    if (trimmed) {
      onAdd(trimmed)
      setTitle('')
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') {
      setIsEditing(false)
      setTitle('')
    }
  }

  if (isEditing) {
    return (
      <div className="w-[280px] shrink-0 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-3">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter column title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="mb-2 w-full rounded-md border border-[var(--color-border-medium)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Add Column
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false)
              setTitle('')
            }}
            className="rounded-md px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)]"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="flex h-12 w-[280px] shrink-0 items-center justify-center gap-2 rounded-md border border-dashed border-[var(--color-border-medium)] bg-[var(--color-bg-elevated)] text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
    >
      <span className="text-lg leading-none">+</span>
      Add Column
    </button>
  )
}
