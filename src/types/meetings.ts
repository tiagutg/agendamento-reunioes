/* ================================================================
   src/types/meetings.ts
   Tipos centralizados do módulo de Reuniões
   ================================================================ */

// Mantemos os mesmos nomes em MAIÚSCULO como se fosse o enum antigo,
// mas usando um objeto real que o Vite consegue ler e apagar sem problemas!
export const MeetingStatus = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceita',
  REJECTED: 'Recusada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Concluída',
} as const;

// Criamos o tipo baseado nos valores desse objeto
export type MeetingStatusType = typeof MeetingStatus[keyof typeof MeetingStatus];

export interface Appointment {
  id: string
  professor: string
  studentName: string
  whatsapp: string
  date: string
  time: string
  format: 'Presencial' | 'Híbrido' | 'Online'
  topic: string
  description: string
  status: MeetingStatusType; // Atualizado para usar o tipo correto dos valores
  rejectionReason?: string
}

export interface ToastState {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

export interface ConfirmModalState {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
}