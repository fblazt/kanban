import type { KanbanState } from '../types/kanban'

const STORAGE_KEY = 'kanban-app-state'
const STORAGE_VERSION_KEY = 'kanban-app-version'
const CURRENT_VERSION = 1

export function exportData(state: KanbanState): string {
  const payload = {
    version: CURRENT_VERSION,
    data: state,
  }
  return JSON.stringify(payload, null, 2)
}

export function importData(json: string): KanbanState {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('Invalid JSON: could not parse import file')
  }

  if (!isValidPayload(parsed)) {
    throw new Error('Invalid format: imported data does not match expected schema')
  }

  return parsed.data
}

function isValidPayload(value: unknown): value is { version: number; data: KanbanState } {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  if (typeof obj.version !== 'number') return false
  if (typeof obj.data !== 'object' || obj.data === null) return false

  const data = obj.data as Record<string, unknown>
  if (typeof data.boards !== 'object' || data.boards === null) return false
  if (typeof data.columns !== 'object' || data.columns === null) return false
  if (typeof data.cards !== 'object' || data.cards === null) return false
  if (typeof data.labels !== 'object' || data.labels === null) return false
  if (!['string', 'object'].includes(typeof data.activeBoardId)) return false

  return true
}

export function getStoredState(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setStoredState(json: string): void {
  localStorage.setItem(STORAGE_KEY, json)
}

export function getStoredVersion(): number | null {
  const raw = localStorage.getItem(STORAGE_VERSION_KEY)
  return raw ? parseInt(raw, 10) : null
}

export function setStoredVersion(version: number): void {
  localStorage.setItem(STORAGE_VERSION_KEY, String(version))
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STORAGE_VERSION_KEY)
}
