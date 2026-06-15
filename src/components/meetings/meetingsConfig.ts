/* ================================================================
   src/components/meetings/meetingsConfig.ts
   Config e utilitários compartilhados — sem imports externos
   ================================================================ */

export interface ProfessorInfo {
  readonly role: 'Docente' | 'Coordenador'
  readonly subject: string
  readonly slots: readonly string[]
  readonly daysOfWeek: readonly number[]
}

export const PROFESSORS_CONFIG = {
  "Prof. Alexandre Beletti":   { role: "Docente"     as const, subject: "Arquitetura e Organização de Computadores", slots: ["08:00","09:30","14:00","15:30"]        as const, daysOfWeek: [1,3,5]      as const },
  "Prof. Geraldo Magela":      { role: "Docente"     as const, subject: "Lógica de Programação",                     slots: ["10:00","11:00","16:00","17:00","19:00"] as const, daysOfWeek: [2,4]        as const },
  "Prof. Inacio de Loyola":    { role: "Docente"     as const, subject: "Teoria Geral dos Sistemas",                 slots: ["09:00","14:30","15:00","20:00"]         as const, daysOfWeek: [1,2,3,4,5]  as const },
  "Prof. Marcos de Assis":     { role: "Docente"     as const, subject: "Algoritmos e Estrutura de Dados",           slots: ["08:30","10:00","13:30","16:00"]         as const, daysOfWeek: [1,3]        as const },
  "Profª. Priscilla de Souza": { role: "Docente"     as const, subject: "Português Instrumental",                   slots: ["07:30","09:00","15:00","16:30"]         as const, daysOfWeek: [2,4,5]      as const },
  "Prof. Wellington de Souza": { role: "Docente"     as const, subject: "Introdução à Informática",                 slots: ["08:00","10:30","14:00","17:00"]         as const, daysOfWeek: [1,3,4]      as const },
} satisfies Record<string, ProfessorInfo>

export type ProfessorName = keyof typeof PROFESSORS_CONFIG

export const FORMAT_OPTIONS = [
  { value: 'Presencial' as const, icon: 'fa-solid fa-building',     label: 'Presencial' },
  { value: 'Híbrido'    as const, icon: 'fa-solid fa-house-laptop', label: 'Híbrido'    },
  { value: 'Online'     as const, icon: 'fa-solid fa-video',        label: 'Online'     },
]

export const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'] as const

/** "Prof. Alexandre Beletti" → "AB" */
export function getInitials(fullName: string): string {
  const clean = fullName.replace(/^(Prof\.|Profª\.|Coord\.)\s+/, '').trim()
  const parts = clean.split(/\s+/).filter((p: string) => p.length > 0)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** "2026-06-20" → "20/06/2026" */
export function formatDateBR(d: string): string {
  return d ? d.split('-').reverse().join('/') : ''
}

/** Status → cor hex para o FullCalendar */
export const STATUS_COLORS: Record<string, string> = {
  'Pendente':  '#f59e0b',
  'Aceita':    '#10b981',
  'Recusada':  '#ef4444',
  'Cancelada': '#ef4444',
  'Concluída': '#6b7280',
}