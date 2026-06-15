import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
  PROFESSORS_CONFIG,
  FORMAT_OPTIONS,
  DAY_NAMES,
  getInitials,
  formatDateBR,
} from './meetingsConfig'
import './meetings.css'

/* ═══════════════════════════════════════════════════════════════
   TIPOS LOCAIS
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
   AUTOCOMPLETE DO PROFESSOR
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
  const [query,   setQuery]   = useState(value)
  const [open,    setOpen]    = useState(false)
  const [focused, setFocused] = useState(false)
  const wrapRef               = useRef<HTMLDivElement>(null)

  // Sincronização segura durante a renderização (Remove o useEffect com re-renderização em cascata)
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setQuery(value)
    setPrevValue(value)
  }

  const allProfessors = Object.entries(PROFESSORS_CONFIG)
  const filtered = query.trim().length >= 1
    ? allProfessors.filter(([name]) => name.toLowerCase().includes(query.toLowerCase()))
    : allProfessors

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        if (!Object.keys(PROFESSORS_CONFIG).includes(query)) setQuery(value)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [query, value])

  const handleSelect = (name: string) => { setQuery(name); setOpen(false); onChange(name) }
  const handleInput  = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); setOpen(true)
    if (!e.target.value) onChange('')
  }

  const selectedData = Object.keys(PROFESSORS_CONFIG).includes(value)
    ? PROFESSORS_CONFIG[value as keyof typeof PROFESSORS_CONFIG]
    : null

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        border: selectedData ? '1px solid #10b981' : (focused ? '1px solid #2f4050' : '1px solid #e2e8f0'),
        borderRadius: '8px', padding: '10px 12px', backgroundColor: '#f8fafc',
        boxSizing: 'border-box', width: '100%', transition: 'all 0.2s ease',
        boxShadow: focused ? '0 0 0 3px rgba(47,64,80,0.06)' : 'none',
      }}>
        <i className="fa-solid fa-user-tie" style={{ color: selectedData ? '#10b981' : '#94a3b8', fontSize: '13px', flexShrink: 0 }}></i>
        <input
          type="text"
          placeholder="Busque pelo nome do docente..."
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '12px', color: '#2f4050', fontWeight: 500, padding: 0, margin: 0 }}
          value={query}
          onChange={handleInput}
          onFocus={() => { setFocused(true); setOpen(true) }}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          autoComplete="off"
        />
        {query && !disabled && (
          <button type="button"
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
            onMouseDown={e => { e.preventDefault(); setQuery(''); onChange(''); setOpen(true) }}>
            <i className="fa-solid fa-xmark" style={{ fontSize: '12px' }}></i>
          </button>
        )}
      </div>

      {open && !disabled && filtered.length > 0 && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '44px', backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
          zIndex: 9999, maxHeight: '220px', overflowY: 'auto', padding: '6px',
          display: 'flex', flexDirection: 'column', gap: '2px',
        }}>
          {filtered.map(([name, cfg]) => {
            const active = name === value
            return (
              <button key={name} type="button"
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                  textAlign: 'left', padding: '10px 12px', borderRadius: '8px', border: 'none',
                  cursor: 'pointer', backgroundColor: active ? '#2f4050' : 'transparent',
                  color: active ? '#ffffff' : '#334155', transition: 'background-color 0.15s',
                }}
                className={active ? '' : 'hover-dropdown-item'}
                onMouseDown={e => { e.preventDefault(); handleSelect(name) }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%', display: 'flex',
                  alignItems: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0,
                  backgroundColor: active ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                  color: active ? '#ffffff' : '#475569', justifyContent: 'center',
                }}>
                  {getInitials(name)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, gap: '2px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                  <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', color: active ? '#cbd5e1' : '#64748b' }}>
                    <span style={{ padding: '2px 6px', fontSize: '9px', fontWeight: 700, borderRadius: '4px', textTransform: 'uppercase', backgroundColor: active ? 'rgba(255,255,255,0.15)' : '#f1f5f9', color: active ? '#ffffff' : '#475569' }}>{cfg.role}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cfg.subject}</span>
                  </span>
                </div>
                {active && <i className="fa-solid fa-check" style={{ fontSize: '11px', color: '#10b981' }}></i>}
              </button>
            )
          })}
        </div>
      )}

      {open && !disabled && filtered.length === 0 && query.length > 0 && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '44px', backgroundColor: '#fff',
          border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px',
          zIndex: 9999, fontSize: '12px', color: '#94a3b8', textAlign: 'center',
        }}>
          Nenhum professor encontrado para "{query}"
        </div>
      )}

      {selectedData && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981', borderRadius: '8px',
          padding: '12px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#2f4050', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
              {getInitials(value)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#10b981', letterSpacing: '0.5px' }}>{selectedData.role} Selecionado</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2f4050', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
            </div>
          </div>
          <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#64748b' }}>
              <i className="fa-solid fa-graduation-cap" style={{ marginTop: '2px', color: '#94a3b8', width: '14px' }}></i>
              <span><strong>Cadeira:</strong> {selectedData.subject}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b' }}>
              <i className="fa-solid fa-calendar-days" style={{ color: '#94a3b8', width: '14px' }}></i>
              <span><strong>Dias disponíveis:</strong> {[...selectedData.daysOfWeek].map(d => DAY_NAMES[d]).join(', ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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
   CALENDÁRIO EM PORTAL (CORRIGIDO)
═══════════════════════════════════════════════════════════════ */
function CalendarPortal({
  triggerRef,
  professor,
  onDateSelect,
  onClose,
}: {
  triggerRef: React.RefObject<HTMLButtonElement | null> // Corrigido para aceitar o estado inicial nulo do ref
  professor: string
  onDateSelect: (dateStr: string) => void
  onClose: () => void
}) {
  const [pos, setPos]   = useState({ top: 0, left: 0, width: 0 })
  const popoverRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX, width: rect.width })
    }
  }, [triggerRef])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, triggerRef])

  const cfg = professor ? PROFESSORS_CONFIG[professor as keyof typeof PROFESSORS_CONFIG] : null

  const handleDayCellClass = (arg: { date: Date }) => {
    const dow   = arg.date.getDay()
    const today = new Date(); today.setHours(0, 0, 0, 0)
    if (arg.date < today || dow === 0 || dow === 6) return ['day-blocked']
    if (cfg && !(cfg.daysOfWeek as readonly number[]).includes(dow)) return ['day-blocked']
    return ['day-available']
  }

  const handleDateClick = (info: { dateStr: string }) => {
    const dateObj = new Date(info.dateStr + 'T00:00:00')
    const dow     = dateObj.getDay()
    const today   = new Date(); today.setHours(0, 0, 0, 0)
    if (dateObj < today || dow === 0 || dow === 6) return
    if (cfg && !(cfg.daysOfWeek as readonly number[]).includes(dow)) return
    onDateSelect(info.dateStr)
    onClose()
  }

  return createPortal(
    <div ref={popoverRef} className="acad-floating-popover"
      style={{ top: pos.top, left: pos.left, width: Math.max(pos.width, 300) }}>
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
   COMPONENTE PRINCIPAL — ALUNO
═══════════════════════════════════════════════════════════════ */
export function StudentMeetings() {
  const [editingId,           setEditingId]           = useState<string | null>(null)
  const [editingOriginalSlot, setEditingOriginalSlot] = useState<{ professor: string; date: string; time: string } | null>(null)
  const [professor,           setProfessor]           = useState('')
  const [selectedDate,        setSelectedDate]        = useState('')
  const [selectedTime,        setSelectedTime]        = useState('')
  const [format,              setFormat]              = useState('')
  const [topic,               setTopic]               = useState('')
  const [description,         setDescription]         = useState('')
  const [whatsapp,            setWhatsapp]            = useState('')
  const [isCalendarOpen,      setIsCalendarOpen]      = useState(false)
  const [isSubmitting,        setIsSubmitting]        = useState(false)
  const [filterStatus,        setFilterStatus]        = useState('todos')
  const [toasts,              setToasts]              = useState<Toast[]>([])
  const [confirmModal,        setConfirmModal]        = useState<ConfirmModal>({
    open: false, title: '', message: '', confirmLabel: '', onConfirm: () => {},
  })

  const calendarTriggerRef = useRef<HTMLButtonElement>(null)

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1', professor: 'Prof. Alexandre Beletti', date: '2026-06-20', time: '14:00',
      format: 'Online', topic: 'Alinhamento do TCC',
      description: 'Dúvidas sobre a metodologia aplicada no capítulo 3.',
      whatsapp: '(27) 99999-8888', status: 'Aceita',
    },
    {
      id: '2', professor: 'Prof. Inacio de Loyola', date: '2026-06-25', time: '09:00',
      format: 'Presencial', topic: 'Revisão de grade curricular',
      description: 'Solicitar análise de aproveitamento de disciplinas.',
      whatsapp: '(27) 98888-7777', status: 'Pendente',
    },
  ])

  /* 👇 SOLUÇÃO DO SEGUNDO ERRO AQUI: Inicialização preguiçosa de estado (lazy state initialization)
    Calcula o bookedSlots inicial síncronamente na montagem sem depender de um useEffect tardio.
  */
  const [bookedSlots, setBookedSlots] = useState<Record<string, Set<string>>>(() => {
    const initial: Record<string, Set<string>> = {}
    const defaultAppointments: Appointment[] = [
      {
        id: '1', professor: 'Prof. Alexandre Beletti', date: '2026-06-20', time: '14:00',
        format: 'Online', topic: 'Alinhamento do TCC',
        description: 'Dúvidas sobre a metodologia aplicada no capítulo 3.',
        whatsapp: '(27) 99999-8888', status: 'Aceita',
      },
      {
        id: '2', professor: 'Prof. Inacio de Loyola', date: '2026-06-25', time: '09:00',
        format: 'Presencial', topic: 'Revisão de grade curricular',
        description: 'Solicitar análise de aproveitamento de disciplinas.',
        whatsapp: '(27) 98888-7777', status: 'Pendente',
      },
    ]
    defaultAppointments.forEach(a => {
      if (a.status !== 'Cancelada' && a.status !== 'Recusada') {
        if (!initial[a.professor]) initial[a.professor] = new Set()
        initial[a.professor].add(`${a.date}|${a.time}`)
      }
    })
    return initial
  })

  /* ── helpers de slot ── */
  const isSlotBooked = (prof: string, date: string, time: string): boolean => {
    if (
      editingOriginalSlot &&
      editingOriginalSlot.professor === prof &&
      editingOriginalSlot.date      === date &&
      editingOriginalSlot.time      === time
    ) return false
    return bookedSlots[prof]?.has(`${date}|${time}`) ?? false
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
      if (!prev[prof]) return prev
      const next = { ...prev }
      next[prof] = new Set(next[prof])
      next[prof].delete(`${date}|${time}`)
      return next
    })
  }

  /* ── Toasts ── */
  const addToast = useCallback((type: Toast['type'], title: string, message: string) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500)
  }, [])
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  /* ── Confirm ── */
  const openConfirm = (title: string, message: string, confirmLabel: string, onConfirm: () => void) =>
    setConfirmModal({ open: true, title, message, confirmLabel, onConfirm })
  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, open: false }))

  /* ── WhatsApp mask ── */
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
    if      (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`
    else if (v.length > 0) v = `(${v}`
    setWhatsapp(v)
  }

  /* ── Mudança de professor ── */
  const handleProfessorChange = (name: string) => {
    setProfessor(name); setSelectedDate(''); setSelectedTime('')
  }

  /* ── Reset ── */
  const resetForm = () => {
    setProfessor(''); setSelectedDate(''); setSelectedTime('')
    setFormat(''); setTopic(''); setDescription(''); setWhatsapp('')
    setEditingId(null); setEditingOriginalSlot(null); setIsCalendarOpen(false)
  }

  /* ── Submit ── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!professor || !selectedDate || !selectedTime || !format || !topic || !description || !whatsapp) return
    setIsSubmitting(true)
    setTimeout(() => {
      if (editingId) {
        if (editingOriginalSlot) releaseSlot(editingOriginalSlot.professor, editingOriginalSlot.date, editingOriginalSlot.time)
        reserveSlot(professor, selectedDate, selectedTime)
        setAppointments(prev => prev.map(a => a.id === editingId
          ? { ...a, professor, date: selectedDate, time: selectedTime, format, topic, description, whatsapp }
          : a
        ))
        addToast('success', 'Agendamento updated', 'As alterações foram salvas com sucesso.')
      } else {
        reserveSlot(professor, selectedDate, selectedTime)
        setAppointments(prev => [{
          id: Date.now().toString(), professor, date: selectedDate, time: selectedTime,
          format, topic, description, whatsapp, status: 'Pendente',
        }, ...prev])
        addToast('success', 'Reunião solicitada!', 'Confirmação enviada ao seu WhatsApp.')
      }
      resetForm(); setIsSubmitting(false)
    }, 900)
  }

  /* ── Editar ── */
  const handleEditInit = (app: Appointment) => {
    if (app.status !== 'Pendente') return
    setEditingId(app.id)
    setEditingOriginalSlot({ professor: app.professor, date: app.date, time: app.time })
    setProfessor(app.professor); setSelectedDate(app.date); setSelectedTime(app.time)
    setFormat(app.format); setTopic(app.topic); setDescription(app.description); setWhatsapp(app.whatsapp)
    setIsCalendarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Cancelar ── */
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

  /* ── Slots ── */
  const cfg = professor ? PROFESSORS_CONFIG[professor as keyof typeof PROFESSORS_CONFIG] : null
  const allSlots = cfg ? [...cfg.slots] : []

  const filteredAppointments = filterStatus === 'todos'
    ? appointments
    : appointments.filter(a => a.status.toLowerCase() === filterStatus)

  const currentStep =
    !professor    ? 0 :
    !selectedDate ? 1 :
    !selectedTime ? 2 :
    !format       ? 3 : 4

  /* ── RENDER ── */
  return (
    <div className="acad-container animate-fade-in">

      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog modal={confirmModal} onClose={closeConfirm} />

      {isCalendarOpen && professor && (
  <CalendarPortal
    triggerRef={calendarTriggerRef}
    professor={professor}
    onDateSelect={dateStr => { setSelectedDate(dateStr); setSelectedTime('') }}
    onClose={() => setIsCalendarOpen(false)}
  />
)}

      {/* CABEÇALHO */}
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
                <i className={editingId ? 'fa-solid fa-pen' : 'fa-solid fa-circle-plus'}></i>
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

              {/* ETAPA 1 */}
              <div className="acad-field-block">
                <label><span className="step-num">1</span> Professor ou Coordenador</label>
                <ProfessorAutocomplete value={professor} onChange={handleProfessorChange} disabled={!!editingId} />
              </div>

              {/* ETAPA 2 */}
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

              {/* ETAPA 3 */}
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
                  {allSlots.every(t => isSlotBooked(professor, selectedDate, t)) && (
                    <span className="acad-field-hint warn">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      Todos os horários deste dia estão ocupados. Escolha outra data.
                    </span>
                  )}
                </div>
              )}

              {/* ETAPA 4 */}
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

              {/* ETAPA 5 */}
              {format && (
                <div className="acad-group-final fade-in-up">
                  <div className="acad-field-block">
                    <label><span className="step-num">5</span> Título da Reunião</label>
                    <input type="text" placeholder="Ex: Orientação de TCC, Revisão de notas..."
                      value={topic} onChange={e => setTopic(e.target.value.slice(0, 60))} required />
                    <span className="acad-char-count">{topic.length}/60</span>
                  </div>

                  <div className="acad-field-block">
                    <label>Descrição da Pauta</label>
                    <textarea rows={3} placeholder="Descreva brevemente o assunto para o professor se preparar adequadamente..."
                      value={description} onChange={e => setDescription(e.target.value.slice(0, 300))} required />
                    <span className="acad-char-count">{description.length}/300</span>
                  </div>

                  <div className="acad-field-block">
                    <label>WhatsApp para Notificações</label>
                    <div className="wpp-input-wrapper">
                      <i className="fa-brands fa-whatsapp wpp-prefix-icon"></i>
                      <input type="text" placeholder="(27) 99999-0000" value={whatsapp} onChange={handleWhatsappChange} required />
                    </div>
                    <span className="acad-field-hint">
                      <i className="fa-solid fa-circle-info"></i>
                      Você receberá atualizações sobre o agendamento neste número
                    </span>
                  </div>

                  <div className="acad-summary-box">
                    <p className="summary-title">Resumo do agendamento</p>
                    <div className="summary-row"><i className="fa-solid fa-user-tie"></i>{professor}</div>
                    <div className="summary-row"><i className="fa-regular fa-calendar"></i>{formatDateBR(selectedDate)} às {selectedTime}</div>
                    <div className="summary-row"><i className="fa-solid fa-display"></i>{format}</div>
                  </div>

                  <button type="submit" className="acad-submit-btn"
                    disabled={isSubmitting || !topic || !description || !whatsapp}>
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
                <button key={f} type="button"
                  className={`acad-filter-tab ${filterStatus === f ? 'active' : ''}`}
                  onClick={() => setFilterStatus(f)}>
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
                          {PROFESSORS_CONFIG[app.professor as keyof typeof PROFESSORS_CONFIG]?.role}
                          {' — '}
                          {PROFESSORS_CONFIG[app.professor as keyof typeof PROFESSORS_CONFIG]?.subject}
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