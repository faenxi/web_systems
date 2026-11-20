import type { Participant } from '../types/participant'

export const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const PHONE_REGEXP = /^\+380\d{9}$/

const REQUIRED = 'This value is required.'

export function getTodayIso(): string {
  return new Date().toLocaleDateString('en-CA') // yyyy-mm-dd (локальна дата)
}

export function validateName(value: string): string {
  return value.trim() ? '' : REQUIRED
}

export function validateBirthDate(value: string): string {
  if (!value) return REQUIRED
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) {
    return 'Enter a valid date.'
  }
  return value > getTodayIso() ? 'Date of birth cannot be in the future.' : ''
}

export function validateEmail(value: string): string {
  if (!value.trim()) return REQUIRED
  return EMAIL_REGEXP.test(value.trim()) ? '' : 'Enter a valid email.'
}

export function validatePhone(value: string): string {
  if (!value.trim()) return REQUIRED
  return PHONE_REGEXP.test(value.trim()) ? '' : 'Phone must look like +380XXXXXXXXX.'
}

export function isEmailTaken(email: string, participants: Participant[], ignoreId?: string): boolean {
  const normalized = email.trim().toLowerCase()
  return participants.some((p) => p.id !== ignoreId && p.email.toLowerCase() === normalized)
}
