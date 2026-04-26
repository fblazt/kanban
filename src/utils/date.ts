import { format, isPast, parseISO } from 'date-fns'

export function formatDate(isoDate: string): string {
  return format(parseISO(isoDate), 'MMM d, yyyy')
}

export function formatDateShort(isoDate: string): string {
  return format(parseISO(isoDate), 'MMM d')
}

export function isOverdue(isoDate: string | null): boolean {
  if (!isoDate) return false
  return isPast(parseISO(isoDate))
}

export function nowISO(): string {
  return new Date().toISOString()
}
