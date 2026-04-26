import { Download, Upload } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useKanbanStore } from '../../store/kanbanStore'

interface ExportImportButtonsProps {
  className?: string
}

export function ExportImportButtons({ className }: ExportImportButtonsProps): ReactNode {
  const exportData = useKanbanStore((state) => state.exportData)
  const importData = useKanbanStore((state) => state.importData)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'kanban-board-export.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    setImportError(null)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string
        importData(json)
        setImportError(null)
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Import failed')
      }
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (importError) {
      const timer = setTimeout(() => setImportError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [importError])

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <button
        type="button"
        onClick={handleExport}
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
        aria-label="Export board data"
      >
        <Download size={14} />
        Export
      </button>

      <button
        type="button"
        onClick={handleImportClick}
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
        aria-label="Import board data"
      >
        <Upload size={14} />
        Import
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {importError && (
        <span className="text-xs text-red-400">{importError}</span>
      )}
    </div>
  )
}