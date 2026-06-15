/* ================================================================
   src/components/meetings/ProfessorMeetings.tsx
   Tela do Professor — gerenciamento de reuniões
   ================================================================ */
   
import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

// Importando os tipos incluindo o novo MeetingStatusType
import type {
  Appointment,
  ToastState,
  ConfirmModalState,
  MeetingStatusType,
} from '../../types/meetings'

// Importando o objeto MeetingStatus normal (como valor de runtime)
import { MeetingStatus } from '../../types/meetings'

import { 
  PROFESSORS_CONFIG, 
  getInitials, 
  formatDateBR, 
  STATUS_COLORS 
} from './meetingsConfig'

// Importando o tipo isolado com 'import type'
import type { ProfessorName } from './meetingsConfig'
import { AvailabilityManager } from './AvailabilityManager'
import './meetings.css'

/* ── Quem está logado (mock — vem do contexto de auth em produção) ── */
const CURRENT_PROFESSOR: ProfessorName = 'Prof. Alexandre Beletti'

/* ── Simula carregamento de reuniões da API ── */
async function loadMeetings(): Promise<Appointment[]> {
  return new Promise(resolve =>
    setTimeout(() => resolve(MOCK_APPOINTMENTS), 600)
  )
}

/** Simula atualização de status via API */
async function updateMeetingStatus(
  id: string,
  status: MeetingStatusType,
  reason?: string
): Promise<void> {
  // Consumimos as variáveis para acalmar o ESLint/TypeScript
  console.log(`Atualizando reunião ${id} para o status: ${status}. Motivo: ${reason || 'Nenhum'}`);
  
  return new Promise(resolve => setTimeout(resolve, 500))
}

/* ── Dados mock ── */
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    professor:   CURRENT_PROFESSOR,
    studentName: 'Tiago Lopes Alves',
    whatsapp:    '(27) 99999-8888',
    date:        '2026-06-20',
    time:        '14:00',
    format:      'Online',
    topic:       'Alinhamento do TCC',
    description: 'Dúvidas sobre a metodologia aplicada no capítulo 3.',
    status:      MeetingStatus.PENDING,
  },
  {
    id: '2',
    professor:   CURRENT_PROFESSOR,
    studentName: 'Fernanda Costa',
    whatsapp:    '(27) 98888-7777',
    date:        '2026-06-23',
    time:        '09:30',
    format:      'Presencial',
    topic:       'Dúvidas sobre lista de exercícios',
    description: 'Exercícios 4 e 5 da lista de lógica combinatória.',
    status:      MeetingStatus.ACCEPTED,
  },
  {
    id: '3',
    professor:   CURRENT_PROFESSOR,
    studentName: 'Rafael Moura',
    whatsapp:    '(27) 97777-6666',
    date:        '2026-06-17',
    time:        '15:30',
    format:      'Híbrido',
    topic:       'Revisão de prova',
    description: 'Solicitar revisão da nota obtida na prova P2.',
    status:      MeetingStatus.REJECTED,
    rejectionReason: 'Prazo de revisão encerrado conforme edital.',
  },
]

/* ═══════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════ */
function ToastContainer({ toasts, onRemove }: { toasts: ToastState[], onRemove: (id: number) => void }) {
  return createPortal(
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`acad-toast toast-${t.type}`}>
          <div className="toast-icon-wrap">
            <i className={
              t.type === 'success' ? 'fa-solid fa-circle-check' :
              t.type === 'error'   ? 'fa-solid fa-circle-xmark' :
              t.type === 'warning' ? 'fa-solid fa-triangle-exclamation' :
                                     'fa-solid fa-circle-info'
            }></i>
          </div>
          <div className="toast-body">
            <p className="toast-title">{t.title}</p>
            <p className="toast-message">{t.message}</p>
          </div>
          <button className="toast-close-btn" onClick={() => onRemove(t.id)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}

/* ═══════════════════════════════════════════════════════════════
   CONFIRM MODAL
═══════════════════════════════════════════════════════════════ */
function ConfirmDialog({ modal, onClose }: { modal: ConfirmModalState, onClose: () => void }) {
  if (!modal.open) return null
  return createPortal(
    <div className="confirm-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon-wrap">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 className="confirm-title">{modal.title}</h3>
        <p className="confirm-message">{modal.message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn-secondary" onClick={onClose}>Voltar</button>
          <button className="confirm-btn-danger" onClick={() => { modal.onConfirm(); onClose() }}>
            {modal.confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ═══════════════════════════════════════════════════════════════
   TOOLTIP DO CALENDÁRIO
═══════════════════════════════════════════════════════════════ */
function CalendarTooltip({ appointment, pos }: { appointment: Appointment, pos: { x: number, y: number } }) {
  return createPortal(
    <div
      className="prof-cal-tooltip"
      style={{ top: pos.y + 12, left: pos.x + 12 }}
    >
      <div className="prof-cal-tooltip-name">{appointment.studentName}</div>
      <div className="prof-cal-tooltip-row">
        <i className="fa-regular fa-clock"></i> {appointment.time}
      </div>
      <div className="prof-cal-tooltip-row">
        <i className="fa-solid fa-display"></i> {appointment.format}
      </div>
      <div className="prof-cal-tooltip-row">
        <span className={`acad-status-badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
      </div>
    </div>,
    document.body
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAINEL DIREITO — ESTADO 1: DASHBOARD
═══════════════════════════════════════════════════════════════ */
function DashboardPanel({
  appointments,
  professorConfig,
  onOpenAvailability,
}: {
  appointments: Appointment[]
  professorConfig: typeof PROFESSORS_CONFIG[ProfessorName]
  onOpenAvailability: () => void
}) {
  const now      = new Date()
  const weekEnd  = new Date(now); weekEnd.setDate(now.getDate() + 7)
  const pending  = appointments.filter(a => a.status === MeetingStatus.PENDING)
  const accepted = appointments.filter(a => a.status === MeetingStatus.ACCEPTED)
  const thisWeek = appointments.filter(a => {
    const d = new Date(a.date + 'T00:00:00')
    return d >= now && d <= weekEnd && a.status !== MeetingStatus.CANCELLED && a.status !== MeetingStatus.REJECTED
  })

  const next = appointments
    .filter(a => new Date(a.date + 'T00:00:00') >= now && a.status === MeetingStatus.ACCEPTED)
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  return (
    <div className="prof-panel-dashboard">

      <div className="prof-panel-greeting">
        <div className="prof-avatar-lg">{getInitials(CURRENT_PROFESSOR)}</div>
        <div>
          <p className="prof-panel-name">{CURRENT_PROFESSOR}</p>
          <p className="prof-panel-subject">{professorConfig.subject}</p>
        </div>
      </div>

      {/* Indicadores */}
      <div className="prof-stats-grid">
        <div className="prof-stat-card pending">
          <span className="prof-stat-num">{pending.length}</span>
          <span className="prof-stat-label">Pendentes</span>
        </div>
        <div className="prof-stat-card accepted">
          <span className="prof-stat-num">{accepted.length}</span>
          <span className="prof-stat-label">Aceitas</span>
        </div>
        <div className="prof-stat-card week">
          <span className="prof-stat-num">{thisWeek.length}</span>
          <span className="prof-stat-label">Esta semana</span>
        </div>
      </div>

      {/* Próxima reunião */}
      {next && (
        <div className="prof-next-meeting">
          <p className="prof-next-label"><i className="fa-solid fa-circle-dot"></i> Próxima reunião</p>
          <p className="prof-next-student">{next.studentName}</p>
          <div className="prof-next-meta">
            <span><i className="fa-regular fa-calendar"></i> {formatDateBR(next.date)}</span>
            <span><i className="fa-regular fa-clock"></i> {next.time}</span>
            <span><i className="fa-solid fa-display"></i> {next.format}</span>
          </div>
        </div>
      )}

      {/* Ações rápidas */}
      <div className="prof-quick-actions">
        <p className="prof-section-label">Ações rápidas</p>
        <button type="button" className="prof-quick-btn" onClick={onOpenAvailability}>
          <i className="fa-solid fa-sliders"></i> Configurar Disponibilidade
        </button>
      </div>

      {/* Gerenciador de disponibilidade inline */}
      <div className="prof-avail-section">
        <p className="prof-section-label"><i className="fa-solid fa-calendar-check"></i> Minha Disponibilidade</p>
        <AvailabilityManager
          professorName={CURRENT_PROFESSOR}
          initialDays={[...professorConfig.daysOfWeek]}
          initialSlots={[...professorConfig.slots]}
          onSave={() => {/* em produção: atualiza contexto/API */}}
          onToast={() => {/* gerenciado pelo pai via prop */}}
        />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAINEL DIREITO — ESTADO 2: REUNIÃO SELECIONADA
═══════════════════════════════════════════════════════════════ */
function MeetingDetailPanel({
  appointment,
  onAccept,
  onReject,
  onCancel,
  onBack,
}: {
  appointment: Appointment
  onAccept: (id: string) => void
  onReject: (id: string, reason: string) => void
  onCancel: (id: string, reason: string) => void
  onBack: () => void
}) {
  const [showRejectInput,  setShowRejectInput]  = useState(false)
  const [showCancelInput,  setShowCancelInput]  = useState(false)
  const [rejectReason,     setRejectReason]     = useState('')
  const [cancelReason,     setCancelReason]     = useState('')
  const [isActing,         setIsActing]         = useState(false)

  const initials = getInitials(appointment.studentName)

  const handleAccept = async () => {
    setIsActing(true)
    await updateMeetingStatus(appointment.id, MeetingStatus.ACCEPTED)
    onAccept(appointment.id)
    setIsActing(false)
  }

  const handleReject = async () => {
    setIsActing(true)
    await updateMeetingStatus(appointment.id, MeetingStatus.REJECTED, rejectReason)
    onReject(appointment.id, rejectReason)
    setIsActing(false)
  }

  const handleCancel = async () => {
    setIsActing(true)
    await updateMeetingStatus(appointment.id, MeetingStatus.CANCELLED, cancelReason)
    onCancel(appointment.id, cancelReason)
    setIsActing(false)
  }

  return (
    <div className="prof-panel-detail">

      {/* Voltar */}
      <button type="button" className="prof-back-btn" onClick={onBack}>
        <i className="fa-solid fa-arrow-left"></i> Voltar
      </button>

      {/* Avatar + nome do aluno */}
      <div className="prof-detail-student">
        <div className="prof-student-avatar">{initials}</div>
        <div>
          <p className="prof-student-name">{appointment.studentName}</p>
          <p className="prof-student-label">Aluno solicitante</p>
        </div>
      </div>

      {/* Badges de status + dados */}
      <div className="prof-detail-meta">
        <span className={`acad-status-badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
      </div>

      <div className="prof-detail-info-grid">
        <div className="prof-detail-info-row">
          <i className="fa-solid fa-graduation-cap"></i>
          <span><strong>Matéria:</strong> {PROFESSORS_CONFIG[CURRENT_PROFESSOR].subject}</span>
        </div>
        <div className="prof-detail-info-row">
          <i className="fa-regular fa-calendar"></i>
          <span><strong>Data:</strong> {formatDateBR(appointment.date)}</span>
        </div>
        <div className="prof-detail-info-row">
          <i className="fa-regular fa-clock"></i>
          <span><strong>Horário:</strong> {appointment.time}</span>
        </div>
        <div className="prof-detail-info-row">
          <i className="fa-solid fa-display"></i>
          <span><strong>Formato:</strong> {appointment.format}</span>
        </div>
        <div className="prof-detail-info-row">
          <i className="fa-brands fa-whatsapp"></i>
          <span>{appointment.whatsapp}</span>
        </div>
      </div>

      <div className="prof-detail-topic">{appointment.topic}</div>
      <p className="prof-detail-description">{appointment.description}</p>

      {appointment.rejectionReason && (
        <div className="prof-rejection-note">
          <i className="fa-solid fa-circle-info"></i>
          <span>{appointment.rejectionReason}</span>
        </div>
      )}

      {/* ── Ações por status ── */}
      {appointment.status === MeetingStatus.PENDING && (
        <div className="prof-detail-actions">
          {!showRejectInput && !showCancelInput && (
            <>
              <button
                type="button"
                className="prof-action-accept"
                onClick={handleAccept}
                disabled={isActing}
              >
                {isActing ? <span className="acad-loader"></span> : <i className="fa-solid fa-check"></i>}
                Aceitar Reunião
              </button>
              <button
                type="button"
                className="prof-action-reject"
                onClick={() => setShowRejectInput(true)}
                disabled={isActing}
              >
                <i className="fa-solid fa-xmark"></i> Recusar Reunião
              </button>
            </>
          )}

          {showRejectInput && (
            <div className="prof-reason-box">
              <label className="prof-reason-label">Justificativa (opcional)</label>
              <textarea
                className="prof-reason-input"
                rows={3}
                placeholder="Informe o motivo da recusa ao aluno..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              />
              <div className="prof-reason-actions">
                <button type="button" className="confirm-btn-secondary" onClick={() => setShowRejectInput(false)}>
                  Cancelar
                </button>
                <button type="button" className="prof-action-reject" onClick={handleReject} disabled={isActing}>
                  {isActing ? <span className="acad-loader"></span> : 'Confirmar Recusa'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {appointment.status === MeetingStatus.ACCEPTED && (
        <div className="prof-detail-actions">
          {!showCancelInput ? (
            <button
              type="button"
              className="prof-action-cancel-outline"
              onClick={() => setShowCancelInput(true)}
              disabled={isActing}
            >
              <i className="fa-solid fa-ban"></i> Cancelar Reunião
            </button>
          ) : (
            <div className="prof-reason-box">
              <label className="prof-reason-label">Motivo do cancelamento (opcional)</label>
              <textarea
                className="prof-reason-input"
                rows={3}
                placeholder="Informe o motivo ao aluno..."
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
              />
              <div className="prof-reason-actions">
                <button type="button" className="confirm-btn-secondary" onClick={() => setShowCancelInput(false)}>
                  Voltar
                </button>
                <button type="button" className="prof-action-reject" onClick={handleCancel} disabled={isActing}>
                  {isActing ? <span className="acad-loader"></span> : 'Confirmar Cancelamento'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════════ */
export function ProfessorMeetings() {
  const [appointments,    setAppointments]    = useState<Appointment[]>([])
  const [loading,         setLoading]         = useState(true)
  const [selectedMeeting, setSelectedMeeting] = useState<Appointment | null>(null)
  const [panelMode,       setPanelMode]       = useState<'dashboard' | 'detail' | 'availability'>('dashboard')
  const [toasts,          setToasts]          = useState<ToastState[]>([])
  const [confirmModal,    setConfirmModal]    = useState<ConfirmModalState>({
    open: false, title: '', message: '', confirmLabel: '', onConfirm: () => {},
  })
  const [tooltip, setTooltip] = useState<{ appointment: Appointment, pos: { x: number, y: number } } | null>(null)

  const professorConfig = PROFESSORS_CONFIG[CURRENT_PROFESSOR]

  /* Carrega reuniões */
  useEffect(() => {
    loadMeetings().then(data => {
      setAppointments(data)
      setLoading(false)
    })
  }, [])

  /* ── Toasts ── */
  const addToast = useCallback((toast: Omit<ToastState, 'id'>) => {
    const id = Date.now()
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500)
  }, [])
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  /* ── Confirm ── */
  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, open: false }))

  /* ── Ações do professor ── */
  const handleAccept = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: MeetingStatus.ACCEPTED } : a))
    setSelectedMeeting(prev => prev?.id === id ? { ...prev, status: MeetingStatus.ACCEPTED } : prev)
    addToast({ type: 'success', title: 'Reunião aceita!', message: 'O aluno será notificado via WhatsApp.' })
  }

  const handleReject = (id: string, reason: string) => {
    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: MeetingStatus.REJECTED, rejectionReason: reason } : a
    ))
    setSelectedMeeting(prev => prev?.id === id ? { ...prev, status: MeetingStatus.REJECTED, rejectionReason: reason } : prev)
    addToast({ type: 'warning', title: 'Reunião recusada', message: 'O aluno foi notificado.' })
  }

  const handleCancel = (id: string, reason: string) => {
    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: MeetingStatus.CANCELLED, rejectionReason: reason } : a
    ))
    setSelectedMeeting(null)
    setPanelMode('dashboard')
    addToast({ type: 'warning', title: 'Reunião cancelada', message: 'O aluno foi notificado.' })
  }

  /* ── Clique no evento do calendário ── */
  const handleEventClick = (info: { event: { id: string } }) => {
    const appt = appointments.find(a => a.id === info.event.id)
    if (!appt) return
    setSelectedMeeting(appt)
    setPanelMode('detail')
  }

  /* ── Eventos para o FullCalendar ── */
  const calendarEvents = appointments.map(a => ({
    id:    a.id,
    title: `${a.time} — ${a.studentName}`,
    date:  a.date,
    color: STATUS_COLORS[a.status] ?? '#94a3b8',
    extendedProps: { appointmentId: a.id },
  }))

  return (
    <div className="acad-container animate-fade-in">

      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog modal={confirmModal} onClose={closeConfirm} />
      {tooltip && <CalendarTooltip appointment={tooltip.appointment} pos={tooltip.pos} />}

      {/* ── CABEÇALHO ── */}
      <div className="acad-header-zone">
        <div className="acad-header-left">
          <span className="acad-header-badge">
            <i className="fa-solid fa-chalkboard-user"></i> Painel do Professor
          </span>
          <h1 className="acad-title">Gerenciamento de Reuniões</h1>
          <p className="acad-subtitle">Visualize e gerencie as solicitações de atendimento dos seus alunos</p>
        </div>
        <div className="acad-header-stats">
          <div className="acad-stat-pill">
            <span className="stat-num">{appointments.filter(a => a.status === MeetingStatus.PENDING).length}</span>
            <span className="stat-label">Pendentes</span>
          </div>
          <div className="acad-stat-pill">
            <span className="stat-num">{appointments.filter(a => a.status === MeetingStatus.ACCEPTED).length}</span>
            <span className="stat-label">Aceitas</span>
          </div>
        </div>
      </div>

      <div className="acad-main-card">
        <div className="acad-split-grid">

          {/* ── CALENDÁRIO (coluna esquerda) ── */}
          <div className="acad-form-side prof-calendar-side">
            <div className="acad-form-header">
              <h3 className="acad-section-title">
                <i className="fa-solid fa-calendar-days"></i> Agenda de Reuniões
              </h3>
            </div>

            <div className="prof-legend-row">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <span key={status} className="prof-legend-item">
                  <span className="prof-legend-dot" style={{ backgroundColor: color }}></span>
                  {status}
                </span>
              ))}
            </div>

            {loading ? (
              <div className="prof-calendar-loading">
                <span className="acad-loader" style={{ borderColor: 'rgba(47,64,80,0.2)', borderBottomColor: '#2f4050' }}></span>
                <span>Carregando agenda...</span>
              </div>
            ) : (
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="pt-br"
                headerToolbar={{ left: 'prev', center: 'title', right: 'next today' }}
                events={calendarEvents}
                eventClick={handleEventClick}
                eventMouseEnter={info => {
                  const appt = appointments.find(a => a.id === info.event.id)
                  if (appt) {
                    setTooltip({ appointment: appt, pos: { x: info.jsEvent.clientX, y: info.jsEvent.clientY } })
                  }
                }}
                eventMouseLeave={() => setTooltip(null)}
                fixedWeekCount={false}
                showNonCurrentDates={false}
                height="auto"
                eventDisplay="block"
                eventBorderColor="transparent"
              />
            )}
          </div>

          {/* ── PAINEL DIREITO ── */}
          <div className="acad-list-side prof-panel-side">
            {panelMode === 'dashboard' && (
              <DashboardPanel
                appointments={appointments}
                professorConfig={professorConfig}
                onOpenAvailability={() => setPanelMode('availability')}
              />
            )}

            {panelMode === 'detail' && selectedMeeting && (
              <MeetingDetailPanel
                appointment={selectedMeeting}
                onAccept={handleAccept}
                onReject={handleReject}
                onCancel={handleCancel}
                onBack={() => { setSelectedMeeting(null); setPanelMode('dashboard') }}
              />
            )}

            {panelMode === 'availability' && (
              <div className="prof-panel-dashboard">
                <button type="button" className="prof-back-btn" onClick={() => setPanelMode('dashboard')}>
                  <i className="fa-solid fa-arrow-left"></i> Voltar
                </button>
                <div className="acad-section-title" style={{ marginBottom: '16px' }}>
                  <i className="fa-solid fa-sliders"></i> Configurar Disponibilidade
                </div>
                <AvailabilityManager
                  professorName={CURRENT_PROFESSOR}
                  initialDays={[...professorConfig.daysOfWeek]}
                  initialSlots={[...professorConfig.slots]}
                  onSave={() => setPanelMode('dashboard')}
                  onToast={addToast}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
