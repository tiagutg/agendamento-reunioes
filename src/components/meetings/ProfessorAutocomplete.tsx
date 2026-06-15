/* ================================================================
   src/components/meetings/ProfessorAutocomplete.tsx
   Autocomplete de professor reutilizável entre aluno e professor
   ================================================================ */
import React, { useState, useEffect, useRef } from 'react'
import { PROFESSORS_CONFIG, getInitials, DAY_NAMES } from './meetingsConfig'

interface ProfessorAutocompleteProps {
  value: string
  onChange: (name: string) => void
  disabled: boolean
}

export function ProfessorAutocomplete({ value, onChange, disabled }: ProfessorAutocompleteProps) {
  const [query,   setQuery]   = useState(value)
  const [open,    setOpen]    = useState(false)
  const [focused, setFocused] = useState(false)
  const wrapRef               = useRef<HTMLDivElement>(null)

  // 👇 SOLUÇÃO DO ERRO AQUI: Sincroniza o estado de forma reativa durante a renderização, sem o useEffect
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setQuery(value)
    setPrevValue(value)
  }

  // O seu antigo useEffect(() => { setQuery(value) }, [value]) foi removido com sucesso daqui!

  const filtered = query.trim().length >= 1
    ? Object.entries(PROFESSORS_CONFIG).filter(([name]) =>
        name.toLowerCase().includes(query.toLowerCase())
      )
    : Object.entries(PROFESSORS_CONFIG)

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

  const selectedData = Object.keys(PROFESSORS_CONFIG).includes(value)
    ? PROFESSORS_CONFIG[value as keyof typeof PROFESSORS_CONFIG]
    : null

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Input de busca */}
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
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
            onMouseDown={e => { e.preventDefault(); setQuery(''); onChange(''); setOpen(true) }}
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: '12px' }}></i>
          </button>
        )}
      </div>

      {/* Dropdown */}
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
              <button
                key={name}
                type="button"
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                  textAlign: 'left', padding: '10px 12px', borderRadius: '8px', border: 'none',
                  cursor: 'pointer', backgroundColor: active ? '#2f4050' : 'transparent',
                  color: active ? '#ffffff' : '#334155', transition: 'background-color 0.15s',
                }}
                className={active ? '' : 'hover-dropdown-item'}
                onMouseDown={e => { e.preventDefault(); handleSelect(name) }}
              >
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%', display: 'flex',
                  alignItems: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0,
                  backgroundColor: active ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                  color: active ? '#ffffff' : '#475569', justifyContent: 'center', letterSpacing: '0.5px',
                }}>
                  {getInitials(name)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, gap: '2px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                  <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', color: active ? '#cbd5e1' : '#64748b' }}>
                    <span style={{
                      padding: '2px 6px', fontSize: '9px', fontWeight: 700, borderRadius: '4px',
                      textTransform: 'uppercase', backgroundColor: active ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
                      color: active ? '#ffffff' : '#475569',
                    }}>{cfg.role}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cfg.subject}</span>
                  </span>
                </div>
                {active && <i className="fa-solid fa-check" style={{ fontSize: '11px', color: '#10b981', marginRight: '4px' }}></i>}
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
          <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '6px' }}></i>
          Nenhum professor encontrado para "{query}"
        </div>
      )}

      {/* Card informativo */}
      {selectedData && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '10px',
          backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
          borderLeft: '4px solid #10b981', borderRadius: '8px',
          padding: '12px 14px', marginTop: '2px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f1f5f9',
              color: '#2f4050', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, flexShrink: 0,
            }}>
              {getInitials(value)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#10b981', letterSpacing: '0.5px' }}>
                {selectedData.role} Selecionado
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2f4050', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {value}
              </span>
            </div>
          </div>
          <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#64748b' }}>
              <i className="fa-solid fa-graduation-cap" style={{ marginTop: '2px', color: '#94a3b8', width: '14px' }}></i>
              <span><strong>Cadeira:</strong> {selectedData.subject}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b' }}>
              <i className="fa-solid fa-calendar-days" style={{ color: '#94a3b8', width: '14px' }}></i>
              <span><strong>Dias disponíveis:</strong> {selectedData.daysOfWeek.map((d: number) => DAY_NAMES[d]).join(', ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}