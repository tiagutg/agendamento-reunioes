/* ================================================================
   src/components/meetings/AvailabilityManager.tsx
   Gerenciador de disponibilidade do professor
   ================================================================ */
import { useState } from 'react'
import type { ToastState } from '../../types/meetings'

interface AvailabilityManagerProps {
  professorName: string
  initialDays: number[]
  initialSlots: string[]
  onSave: (days: number[], slots: string[]) => void
  onToast: (toast: Omit<ToastState, 'id'>) => void
}

const WEEKDAYS = [
  { label: 'Segunda', value: 1 },
  { label: 'Terça',   value: 2 },
  { label: 'Quarta',  value: 3 },
  { label: 'Quinta',  value: 4 },
  { label: 'Sexta',   value: 5 },
]

/** Simula chamada de API */
async function saveAvailability(
  professorName: string,
  days: number[],
  slots: string[]
): Promise<void> {
  // Consumimos as variáveis no console apenas para o ESLint/TypeScript ver que elas são usadas!
  console.log(`Salvando agenda de ${professorName}. Dias: ${days}, Horários: ${slots}`);
  
  return new Promise(resolve => setTimeout(resolve, 700));
}

export function AvailabilityManager({
  professorName,
  initialDays,
  initialSlots,
  onSave,
  onToast,
}: AvailabilityManagerProps) {
  const [activeDays,  setActiveDays]  = useState<number[]>([...initialDays])
  const [slots,       setSlots]       = useState<string[]>([...initialSlots])
  const [newTime,     setNewTime]     = useState('')
  const [isSaving,    setIsSaving]    = useState(false)

  const toggleDay = (day: number) => {
    setActiveDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    )
  }

  const addSlot = () => {
    if (!newTime) return
    if (slots.includes(newTime)) {
      onToast({ type: 'warning', title: 'Horário duplicado', message: 'Este horário já está cadastrado.' })
      return
    }
    const updated = [...slots, newTime].sort()
    setSlots(updated)
    setNewTime('')
    onToast({ type: 'info', title: 'Horário adicionado', message: `${newTime} foi adicionado à sua disponibilidade.` })
  }

  const removeSlot = (time: string) => {
    setSlots(prev => prev.filter(s => s !== time))
    onToast({ type: 'warning', title: 'Horário removido', message: `${time} foi removido da sua disponibilidade.` })
  }

  const handleSave = async () => {
    if (activeDays.length === 0) {
      onToast({ type: 'error', title: 'Nenhum dia selecionado', message: 'Selecione ao menos um dia da semana.' })
      return
    }
    if (slots.length === 0) {
      onToast({ type: 'error', title: 'Nenhum horário', message: 'Adicione ao menos um horário.' })
      return
    }
    setIsSaving(true)
    await saveAvailability(professorName, activeDays, slots)
    setIsSaving(false)
    onSave(activeDays, slots)
    onToast({ type: 'success', title: 'Disponibilidade salva!', message: 'Sua agenda foi atualizada com sucesso.' })
  }

  return (
    <div className="avail-manager">
      <div className="avail-section-title">
        <i className="fa-solid fa-calendar-days"></i> Dias de Atendimento
      </div>

      <div className="avail-days-row">
        {WEEKDAYS.map(d => (
          <button
            key={d.value}
            type="button"
            className={`avail-day-chip ${activeDays.includes(d.value) ? 'active' : ''}`}
            onClick={() => toggleDay(d.value)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="avail-section-title" style={{ marginTop: '16px' }}>
        <i className="fa-regular fa-clock"></i> Horários Cadastrados
      </div>

      <div className="avail-slots-list">
        {slots.length === 0 && (
          <p className="avail-empty-hint">Nenhum horário cadastrado ainda.</p>
        )}
        {slots.map(time => (
          <div key={time} className="avail-slot-row">
            <span className="avail-slot-time">
              <i className="fa-regular fa-clock"></i> {time}
            </span>
            <button
              type="button"
              className="avail-slot-remove"
              onClick={() => removeSlot(time)}
              title="Remover horário"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="avail-add-row">
        <input
          type="time"
          className="avail-time-input"
          value={newTime}
          onChange={e => setNewTime(e.target.value)}
        />
        <button
          type="button"
          className="avail-add-btn"
          onClick={addSlot}
          disabled={!newTime}
        >
          <i className="fa-solid fa-plus"></i> Adicionar
        </button>
      </div>

      <button
        type="button"
        className="avail-save-btn"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving
          ? <><span className="acad-loader"></span> Salvando...</>
          : <><i className="fa-solid fa-floppy-disk"></i> Salvar Disponibilidade</>
        }
      </button>
    </div>
  )
}