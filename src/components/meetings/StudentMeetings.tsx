import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import './meetings.css'

/* ═══════════════════════════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════════════════════════ */
interface Appointment {
  id: string
  professor: string
  date: string
  time: string
  format: string
  topic: string
  description: string
  whatsapp: string
  status: 'Pendente' | 'Aceita' | 'Recusada' | 'Cancelada'
}

interface Toast {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

interface ConfirmModal {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
}

/* ═══════════════════════════════════════════════════════════════
   DADOS DOS PROFESSORES
═══════════════════════════════════════════════════════════════ */
const PROFESSORS_CONFIG: Record<string, { slots: string[], daysOfWeek: number[], role: string, subject: string }> = {
  "Prof. João Silva":      { role: "Docente",      subject: "Engenharia de Software", slots: ["08:00","09:30","14:00","15:30"],       daysOfWeek: [1,3,5] },
  "Profª. Maria Souza":   { role: "Docente",      subject: "Matemática Aplicada",    slots: ["10:00","11:00","16:00","17:00","19:00"], daysOfWeek: [2,4]   },
  "Coord. Carlos Mendes": { role: "Coordenador",  subject: "Coordenação de Curso",   slots: ["09:00","14:30","15:00","20:00"],         daysOfWeek: [1,2,3,4,5] },
  "Profª. Ana Lima":      { role: "Docente",      subject: "Banco de Dados",         slots: ["08:30","10:00","13:30","16:00"],         daysOfWeek: [1,3]   },
  "Prof. Ricardo Torres": { role: "Docente",      subject: "Cálculo I e II",         slots: ["07:30","09:00","15:00","16:30"],         daysOfWeek: [2,4,5] },
  "Profª. Fernanda Melo": { role: "Docente",      subject: "Programação Web",        slots: ["08:00","10:30","14:00","17:00"],         daysOfWeek: [1,3,4] },
}

const FORMAT_OPTIONS = [
  { value: 'Presencial', icon: 'fa-solid fa-building',     label: 'Presencial' },
  { value: 'Híbrido',    icon: 'fa-solid fa-house-laptop', label: 'Híbrido'    },
  { value: 'Online',     icon: 'fa-solid fa-video',        label: 'Online'     },
]

const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

/* ═══════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════ */
function ToastContainer({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: number) => void }) {
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
function ConfirmDialog({ modal, onClose }: { modal: ConfirmModal, onClose: () => void }) {
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
   CALENDÁRIO EM PORTAL (resolve bug de z-index ao editar)
═══════════════════════════════════════════════════════════════ */
function CalendarPortal({
  triggerRef,
  professor,
  bookedSlots,
  editingSlot,
  onDateSelect,
  onClose,
}: {
  triggerRef: React.RefObject<HTMLButtonElement>
  professor: string
  bookedSlots: Record<string, string[]>
  editingSlot: { date: string; time: string } | null
  onDateSelect: (dateStr: string) => void
  onClose: () => void
}) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({
        top:   rect.bottom + window.scrollY + 6,
        left:  rect.left   + window.scrollX,
        width: Math.min(rect.width, 360),
      })
    }
  }, [triggerRef])

  /* fechar ao clicar fora */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, triggerRef])

  const cfg = PROFESSORS_CONFIG[professor]

  const handleDayCellClass = (arg: any) => {
    const dow   = arg.date.getDay()
    const today = new Date(); today.setHours(0,0,0,0)
    if (arg.date < today || dow === 0 || dow === 6) return ['day-blocked']
    if (cfg && !cfg.daysOfWeek.includes(dow)) return ['day-blocked']
    return ['day-available']
  }

  const handleDateClick = (info: any) => {
    const dateObj = new Date(info.dateStr + 'T00:00:00')
    const dow     = dateObj.getDay()
    const today   = new Date(); today.setHours(0,0,0,0)
    if (dateObj < today || dow === 0 || dow === 6) return
    if (cfg && !cfg.daysOfWeek.includes(dow)) return
    onDateSelect(info.dateStr)
    onClose()
  }

  return createPortal(
    <div
      ref={popoverRef}
      className="acad-floating-popover"
      style={{ top: pos.top, left: pos.left, width: Math.max(pos.width, 300) }}
    >
      <div className="popover-legend">
        <span className="legend-item available"><span className="legend-dot"></span>Disponível</span>
        <span className="legend-item blocked"><span className="legend-dot"></span>Indisponível</span>
        <button type="button" className="close-pop-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="pt-br"
        headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
        dateClick={handleDateClick}
        dayCellClassNames={handleDayCellClass}
        fixedWeekCount={false}
        showNonCurrentDates={false}
        height="auto"
      />
    </div>,
    document.body
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROFESSOR AUTOCOMPLETE
═══════════════════════════════════════════════════════════════ */
function ProfessorAutocomplete({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (name: string) => void
  disabled: boolean
}) {
  const [query, setQuery]     = useState(value)
  const [open, setOpen]       = useState(false)
  const [focused, setFocused] = useState(false)
  const wrapRef               = useRef<HTMLDivElement>(null)

  /* sincroniza query quando value muda externamente (ex: resetForm) */
  useEffect(() => { setQuery(value) }, [value])

  const filtered = query.trim().length >= 1
    ? Object.entries(PROFESSORS_CONFIG).filter(([name]) =>
        name.toLowerCase().includes(query.toLowerCase())
      )
    : Object.entries(PROFESSORS_CONFIG)

  /* fechar ao clicar fora */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        /* se não confirmou seleção, reseta para o valor atual */
        if (!Object.keys(PROFESSORS_CONFIG).includes(query)) {
          setQuery(value)
        }
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [query, value])

  const handleSelect = (name: string) => {
    setQuery(name)
    setOpen(false)
    onChange(name)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setOpen(true)
    if (!e.target.value) onChange('')
  }

  const isSelected = Object.keys(PROFESSORS_CONFIG).includes(query) && query === value

  return (
    <div ref={wrapRef} className="professor-autocomplete">
      <div className={`professor-input-wrap ${isSelected ? 'selected' : ''} ${focused ? 'focused' : ''}`}>
        <i className="fa-solid fa-user-tie prof-input-icon"></i>
        <input
          type="text"
          placeholder="Digite o nome do professor ou coordenador..."
          value={query}
          onChange={handleInput}
          onFocus={() => { setFocused(true); setOpen(true) }}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          autoComplete="off"
        />
        {query && !disabled && (
          <button
            type="button"
            className="prof-clear-btn"
            onMouseDown={e => { e.preventDefault(); setQuery(''); onChange(''); setOpen(true) }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {open && !disabled && filtered.length > 0 && (
        <div className="professor-dropdown">
          {filtered.map(([name, cfg]) => (
            <button
              key={name}
              type="button"
              className={`professor-option ${name === value ? 'active' : ''}`}
              onMouseDown={e => { e.preventDefault(); handleSelect(name) }}
            >
              <div className="prof-option-avatar">{name.replace(/^(Prof\.|Profª\.|Coord\.)\s+/, '').charAt(0)}</div>
              <div className="prof-option-info">
                <span className="prof-option-name">{name}</span>
                <span className="prof-option-meta">
                  <span className="prof-role-badge">{cfg.role}</span>
                  {cfg.subject}
                </span>
              </div>
              {name === value && <i className="fa-solid fa-check prof-check"></i>}
            </button>
          ))}
        </div>
      )}

      {open && !disabled && filtered.length === 0 && query.length > 0 && (
        <div className="professor-dropdown">
          <div className="professor-no-results">
            <i className="fa-solid fa-magnifying-glass"></i>
            Nenhum professor encontrado para "{query}"
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════════ */
export function StudentMeetings() {
  const [editingId, setEditingId]             = useState<string | null>(null)
  const [editingOriginalSlot, setEditingOriginalSlot] = useState<{ professor: string; date: string; time: string } | null>(null)
  const [professor, setProfessor]             = useState('')
  const [selectedDate, setSelectedDate]       = useState('')
  const [selectedTime, setSelectedTime]       = useState('')
  const [format, setFormat]                   = useState('')
  const [topic, setTopic]                     = useState('')
  const [description, setDescription]         = useState('')
  const [whatsapp, setWhatsapp]               = useState('')
  const [isCalendarOpen, setIsCalendarOpen]   = useState(false)
  const [isSubmitting, setIsSubmitting]       = useState(false)
  const [filterStatus, setFilterStatus]       = useState('todos')
  const [toasts, setToasts]                   = useState<Toast[]>([])
  const [confirmModal, setConfirmModal]       = useState<ConfirmModal>({
    open: false, title: '', message: '', confirmLabel: '', onConfirm: () => {}
  })

  const calendarTriggerRef = useRef<HTMLButtonElement>(null)

  /* ── HORÁRIOS RESERVADOS GLOBALMENTE (professor → "date|time"[]) ── */
  const [bookedSlots, setBookedSlots] = useState<Record<string, Set<string>>>({
    "Prof. João Silva":      new Set(),
    "Profª. Maria Souza":   new Set(),
    "Coord. Carlos Mendes": new Set(),
    "Profª. Ana Lima":      new Set(),
    "Prof. Ricardo Torres": new Set(),
    "Profª. Fernanda Melo": new Set(),
  })

  /* ── appointments ── */
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      professor: 'Prof. João Silva',
      date: '2026-06-20',
      time: '14:00',
      format: 'Online',
      topic: 'Alinhamento do TCC',
      description: 'Dúvidas sobre a metodologia aplicada no capítulo 3.',
      whatsapp: '(27) 99999-8888',
      status: 'Aceita'
    },
    {
      id: '2',
      professor: 'Coord. Carlos Mendes',
      date: '2026-06-25',
      time: '09:00',
      format: 'Presencial',
      topic: 'Revisão de grade curricular',
      description: 'Solicitar análise de aproveitamento de disciplinas.',
      whatsapp: '(27) 98888-7777',
      status: 'Pendente'
    }
  ])

  /* inicializa bookedSlots a partir dos appointments mock (somente ativos) */
  useEffect(() => {
    setBookedSlots(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(k => next[k] = new Set())
      appointments.forEach(a => {
        if (a.status !== 'Cancelada' && a.status !== 'Recusada') {
          if (!next[a.professor]) next[a.professor] = new Set()
          next[a.professor].add(`${a.date}|${a.time}`)
        }
      })
      return next
    })
  }, []) // só na montagem

  /* ── helpers ── */
  const isSlotBooked = (prof: string, date: string, time: string): boolean => {
    const key = `${date}|${time}`
    /* se estamos editando e este é o slot original, NÃO está bloqueado para nós */
    if (editingOriginalSlot &&
        editingOriginalSlot.professor === prof &&
        editingOriginalSlot.date      === date  &&
        editingOriginalSlot.time      === time) return false
    return bookedSlots[prof]?.has(key) ?? false
  }

  const reserveSlot = (prof: string, date: string, time: string) => {
    setBookedSlots(prev => {
      const next = { ...prev }
      if (!next[prof]) next[prof] = new Set()
      next[prof] = new Set(next[prof])
      next[prof].add(`${date}|${time}`)
      return next
    })
  }

  const releaseSlot = (prof: string, date: string, time: string) => {
    setBookedSlots(prev => {
      const next = { ...prev }
      if (!next[prof]) return prev
      next[prof] = new Set(next[prof])
      next[prof].delete(`${date}|${time}`)
      return next
    })
  }

  /* ── TOASTS ── */
  const addToast = useCallback((type: Toast['type'], title: string, message: string) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500)
  }, [])
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  /* ── CONFIRM ── */
  const openConfirm = (title: string, message: string, confirmLabel: string, onConfirm: () => void) =>
    setConfirmModal({ open: true, title, message, confirmLabel, onConfirm })
  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, open: false }))

  /* ── WHATSAPP MASK ── */
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g,'').slice(0,11)
    if      (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`
    else if (v.length > 0) v = `(${v}`
    setWhatsapp(v)
  }

  /* ── PROFESSOR CHANGE ── */
  const handleProfessorChange = (name: string) => {
    setProfessor(name)
    setSelectedDate('')
    setSelectedTime('')
  }

  /* ── RESET ── */
  const resetForm = () => {
    setProfessor(''); setSelectedDate(''); setSelectedTime('')
    setFormat(''); setTopic(''); setDescription(''); setWhatsapp('')
    setEditingId(null); setEditingOriginalSlot(null)
    setIsCalendarOpen(false)
  }

  /* ── SUBMIT ── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!professor || !selectedDate || !selectedTime || !format || !topic || !description || !whatsapp) return
    setIsSubmitting(true)
    setTimeout(() => {
      if (editingId) {
        /* libera slot anterior e reserva novo */
        if (editingOriginalSlot) {
          releaseSlot(editingOriginalSlot.professor, editingOriginalSlot.date, editingOriginalSlot.time)
        }
        reserveSlot(professor, selectedDate, selectedTime)

        setAppointments(prev => prev.map(a => a.id === editingId
          ? { ...a, professor, date: selectedDate, time: selectedTime, format, topic, description, whatsapp }
          : a
        ))
        addToast('success', 'Agendamento atualizado', 'As alterações foram salvas com sucesso.')
      } else {
        reserveSlot(professor, selectedDate, selectedTime)
        setAppointments(prev => [{
          id: Date.now().toString(),
          professor, date: selectedDate, time: selectedTime,
          format, topic, description, whatsapp, status: 'Pendente'
        }, ...prev])
        addToast('success', 'Reunião solicitada!', 'Confirmação enviada ao seu WhatsApp.')
      }
      resetForm()
      setIsSubmitting(false)
    }, 900)
  }

  /* ── EDITAR ── */
  const handleEditInit = (app: Appointment) => {
    if (app.status !== 'Pendente') return
    setEditingId(app.id)
    setEditingOriginalSlot({ professor: app.professor, date: app.date, time: app.time })
    setProfessor(app.professor)
    setSelectedDate(app.date)
    setSelectedTime(app.time)
    setFormat(app.format)
    setTopic(app.topic)
    setDescription(app.description)
    setWhatsapp(app.whatsapp)
    setIsCalendarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── CANCELAR ── */
  const handleCancelStatus = (id: string) => {
    const app = appointments.find(a => a.id === id)
    if (!app) return
    openConfirm(
      'Cancelar agendamento',
      'Tem certeza que deseja cancelar esta reunião? Esta ação não pode ser desfeita.',
      'Sim, cancelar',
      () => {
        releaseSlot(app.professor, app.date, app.time)
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelada' } : a))
        addToast('warning', 'Agendamento cancelado', 'Sua reunião foi cancelada com sucesso.')
      }
    )
  }

  /* ── SLOTS disponíveis para o dia selecionado ── */
  const availableSlots = professor && PROFESSORS_CONFIG[professor]
    ? PROFESSORS_CONFIG[professor].slots.filter(
        time => !isSlotBooked(professor, selectedDate, time)
      )
    : []

  const allSlots = professor && PROFESSORS_CONFIG[professor]
    ? PROFESSORS_CONFIG[professor].slots
    : []

  const filteredAppointments = filterStatus === 'todos'
    ? appointments
    : appointments.filter(a => a.status.toLowerCase() === filterStatus)

  const currentStep =
    !professor    ? 0 :
    !selectedDate ? 1 :
    !selectedTime ? 2 :
    !format       ? 3 : 4

  const formatDateBR = (d: string) => d ? d.split('-').reverse().join('/') : ''

  /* ── RENDER ── */
  return (
    <div className="acad-container animate-fade-in">

      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog modal={confirmModal} onClose={closeConfirm} />

      {/* Calendário em portal — sempre acima de tudo */}
      {isCalendarOpen && professor && (
        <CalendarPortal
          triggerRef={calendarTriggerRef}
          professor={professor}
          bookedSlots={{}}
          editingSlot={editingOriginalSlot}
          onDateSelect={dateStr => { setSelectedDate(dateStr); setSelectedTime('') }}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}

      {/* ── CABEÇALHO ── */}
      <div className="acad-header-zone">
        <div className="acad-header-left">
          <span className="acad-header-badge">
            <i className="fa-solid fa-graduation-cap"></i> Portal Acadêmico
          </span>
          <h1 className="acad-title">Agendamento de Atendimento</h1>
          <p className="acad-subtitle">Solicite reuniões com professores e coordenadores da faculdade</p>
        </div>
        <div className="acad-header-stats">
          <div className="acad-stat-pill">
            <span className="stat-num">{appointments.filter(a => a.status === 'Pendente').length}</span>
            <span className="stat-label">Pendentes</span>
          </div>
          <div className="acad-stat-pill">
            <span className="stat-num">{appointments.filter(a => a.status === 'Aceita').length}</span>
            <span className="stat-label">Aceitas</span>
          </div>
        </div>
      </div>

      <div className="acad-main-card">
        <div className="acad-split-grid">

          {/* ── FORMULÁRIO ── */}
          <div className="acad-form-side">

            <div className="acad-form-header">
              <h3 className="acad-section-title">
                <i className={editingId ? "fa-solid fa-pen" : "fa-solid fa-circle-plus"}></i>
                {editingId ? 'Editar Agendamento' : 'Nova Solicitação de Reunião'}
              </h3>
              {editingId && (
                <button className="acad-cancel-edit-btn" onClick={resetForm} type="button">
                  <i className="fa-solid fa-xmark"></i> Cancelar edição
                </button>
              )}
            </div>

            {/* PROGRESSO */}
            <div className="acad-progress-bar-wrap">
              <div className="acad-progress-track">
                <div className="acad-progress-fill" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
              </div>
              <span className="acad-progress-label">Etapa {Math.min(currentStep + 1, 5)} de 5</span>
            </div>

            <form onSubmit={handleSubmit} className="acad-interactive-form">

              {/* ETAPA 1: PROFESSOR (autocomplete) */}
              <div className="acad-field-block">
                <label><span className="step-num">1</span> Professor ou Coordenador</label>
                <ProfessorAutocomplete
                  value={professor}
                  onChange={handleProfessorChange}
                  disabled={!!editingId}
                />
                {professor && PROFESSORS_CONFIG[professor] && (
                  <div className="prof-selected-info">
                    <span className="prof-info-chip">
                      <i className="fa-solid fa-book"></i>
                      {PROFESSORS_CONFIG[professor].subject}
                    </span>
                    <span className="prof-info-chip">
                      <i className="fa-regular fa-calendar"></i>
                      {PROFESSORS_CONFIG[professor].daysOfWeek.map(d => DAY_NAMES[d]).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* ETAPA 2: DATA */}
              {professor && (
                <div className="acad-field-block fade-in-up">
                  <label><span className="step-num">2</span> Data da Reunião</label>
                  <button
                    ref={calendarTriggerRef}
                    type="button"
                    className={`acad-trigger-btn ${selectedDate ? 'filled' : ''}`}
                    onClick={() => setIsCalendarOpen(v => !v)}
                  >
                    <i className="fa-regular fa-calendar-days"></i>
                    {selectedDate
                      ? <><strong>{formatDateBR(selectedDate)}</strong><span className="trigger-hint">— clique para alterar</span></>
                      : 'Selecionar data disponível'
                    }
                    <i className={`fa-solid fa-chevron-${isCalendarOpen ? 'up' : 'down'} chevron-icon`}></i>
                  </button>
                </div>
              )}

              {/* ETAPA 3: HORÁRIO */}
              {selectedDate && (
                <div className="acad-field-block fade-in-up">
                  <label><span className="step-num">3</span> Horário Disponível</label>
                  <div className="acad-slots-flex">
                    {allSlots.map(time => {
                      const booked = isSlotBooked(professor, selectedDate, time)
                      return (
                        <button
                          type="button"
                          key={time}
                          disabled={booked}
                          className={`acad-time-btn ${selectedTime === time ? 'active' : ''} ${booked ? 'booked' : ''}`}
                          onClick={() => !booked && setSelectedTime(time)}
                          title={booked ? 'Horário já reservado' : ''}
                        >
                          <i className={booked ? 'fa-solid fa-lock' : 'fa-regular fa-clock'}></i>
                          {time}
                        </button>
                      )
                    })}
                  </div>
                  {availableSlots.length === 0 && (
                    <span className="acad-field-hint warn">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      Todos os horários deste dia estão ocupados. Escolha outra data.
                    </span>
                  )}
                </div>
              )}

              {/* ETAPA 4: FORMATO */}
              {selectedTime && (
                <div className="acad-field-block fade-in-up">
                  <label><span className="step-num">4</span> Formato do Atendimento</label>
                  <div className="acad-format-row">
                    {FORMAT_OPTIONS.map(opt => (
                      <button
                        type="button"
                        key={opt.value}
                        className={`acad-format-btn ${format === opt.value ? 'selected' : ''}`}
                        onClick={() => setFormat(opt.value)}
                      >
                        <i className={opt.icon}></i>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ETAPA 5: DETALHES */}
              {format && (
                <div className="acad-group-final fade-in-up">

                  <div className="acad-field-block">
                    <label><span className="step-num">5</span> Título da Reunião</label>
                    <input
                      type="text"
                      placeholder="Ex: Orientação de TCC, Revisão de notas..."
                      value={topic}
                      onChange={e => setTopic(e.target.value.slice(0,60))}
                      required
                    />
                    <span className="acad-char-count">{topic.length}/60</span>
                  </div>

                  <div className="acad-field-block">
                    <label>Descrição da Pauta</label>
                    <textarea
                      rows={3}
                      placeholder="Descreva brevemente o assunto para o professor se preparar adequadamente..."
                      value={description}
                      onChange={e => setDescription(e.target.value.slice(0,300))}
                      required
                    />
                    <span className="acad-char-count">{description.length}/300</span>
                  </div>

                  <div className="acad-field-block">
                    <label>WhatsApp para Notificações</label>
                    <div className="wpp-input-wrapper">
                      <i className="fa-brands fa-whatsapp wpp-prefix-icon"></i>
                      <input
                        type="text"
                        placeholder="(27) 99999-0000"
                        value={whatsapp}
                        onChange={handleWhatsappChange}
                        required
                      />
                    </div>
                    <span className="acad-field-hint">
                      <i className="fa-solid fa-circle-info"></i>
                      Você receberá atualizações sobre o agendamento neste número
                    </span>
                  </div>

                  {/* RESUMO */}
                  <div className="acad-summary-box">
                    <p className="summary-title">Resumo do agendamento</p>
                    <div className="summary-row"><i className="fa-solid fa-user-tie"></i>{professor}</div>
                    <div className="summary-row"><i className="fa-regular fa-calendar"></i>{formatDateBR(selectedDate)} às {selectedTime}</div>
                    <div className="summary-row"><i className="fa-solid fa-display"></i>{format}</div>
                  </div>

                  <button
                    type="submit"
                    className="acad-submit-btn"
                    disabled={isSubmitting || !topic || !description || !whatsapp}
                  >
                    {isSubmitting
                      ? <><span className="acad-loader"></span> Registrando solicitação...</>
                      : <><i className="fa-solid fa-calendar-check"></i> {editingId ? 'Salvar Alterações' : 'Confirmar Agendamento'}</>
                    }
                  </button>
                </div>
              )}

            </form>
          </div>

          {/* ── LISTA ── */}
          <div className="acad-list-side">

            <div className="acad-list-header">
              <h3 className="acad-section-title">
                <i className="fa-solid fa-calendar-days"></i> Meus Agendamentos
              </h3>
              <span className="acad-total-badge">{appointments.length} total</span>
            </div>

            <div className="acad-filter-tabs">
              {['todos','pendente','aceita','recusada','cancelada'].map(f => (
                <button
                  key={f}
                  type="button"
                  className={`acad-filter-tab ${filterStatus === f ? 'active' : ''}`}
                  onClick={() => setFilterStatus(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className="tab-count">
                    {f === 'todos' ? appointments.length : appointments.filter(a => a.status.toLowerCase() === f).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="acad-scroller">
              {filteredAppointments.length === 0 ? (
                <div className="acad-empty-state">
                  <i className="fa-regular fa-calendar-xmark"></i>
                  <p>Nenhum agendamento encontrado</p>
                  <small>Os agendamentos aparecerão aqui após a solicitação</small>
                </div>
              ) : (
                filteredAppointments.map(app => (
                  <div key={app.id} className={`acad-appointment-card status-${app.status.toLowerCase()}`}>
                    <div className="appt-card-top">
                      <div className="appt-card-left">
                        <div className="appt-professor-name">{app.professor}</div>
                        <div className="appt-professor-role">
                          {PROFESSORS_CONFIG[app.professor]?.role} — {PROFESSORS_CONFIG[app.professor]?.subject}
                        </div>
                      </div>
                      <span className={`acad-status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                    </div>

                    <div className="appt-badges-row">
                      <span className="appt-badge"><i className="fa-regular fa-calendar"></i> {formatDateBR(app.date)}</span>
                      <span className="appt-badge"><i className="fa-regular fa-clock"></i> {app.time}</span>
                      <span className="appt-badge format"><i className="fa-solid fa-display"></i> {app.format}</span>
                    </div>

                    <div className="appt-topic">{app.topic}</div>
                    <div className="appt-description">{app.description}</div>

                    <div className="appt-card-footer">
                      <span className="appt-wpp"><i className="fa-brands fa-whatsapp"></i> {app.whatsapp}</span>
                      {app.status !== 'Cancelada' && app.status !== 'Recusada' && (
                        <div className="appt-actions">
                          {app.status === 'Pendente' && (
                            <button type="button" className="appt-action-btn edit" onClick={() => handleEditInit(app)}>
                              <i className="fa-solid fa-pen"></i> Editar
                            </button>
                          )}
                          <button type="button" className="appt-action-btn cancel" onClick={() => handleCancelStatus(app.id)}>
                            <i className="fa-solid fa-xmark"></i> Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}