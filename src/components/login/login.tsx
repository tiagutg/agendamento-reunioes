import React, { useState } from 'react'
import imgLogin from '../../img/ImgLoginUnisales.png';

interface LoginProps {
  onLoginSuccess: (username: string, role: 'student' | 'professor') => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    // Simulação de regras de perfil:
    if (username.toLowerCase().includes('prof')) {
      onLoginSuccess(username, 'professor')
    } else {
      onLoginSuccess(username, 'student')
    }
  }

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      fontFamily: 'sans-serif'
    }}>
      
      {/* ================= METADE ESQUERDA: FOTO ORIGINAL DO PORTAL COM OVERLAY ================= */}
      <div style={{
        position: 'relative',
        width: '50%',
        height: '100%',
        display: 'block',
        backgroundColor: '#111'
      }}>
        {/* Camada vermelha com a opacidade exata do sistema AVA */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(145, 10, 35, 0.82), rgba(185, 15, 45, 0.68))',
          mixBlendMode: 'multiply' as React.CSSProperties['mixBlendMode'],
          zIndex: 2
        }}></div>
        
        {/* Imagem oficial do AVA UniSales */}
        <img 
  src={imgLogin}
  alt="Estudante no Notebook UniSales"
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  }}
/>
      </div>

      {/* ================= METADE DIREITA: FORMULÁRIO CENTRALIZADO ================= */}
      <div style={{
        width: '50%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '380px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center' // Garante centralização vertical de todos os filhos
        }}>
          
          {/* LOGO UNISALES CENTRALIZADA */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginBottom: '20px' 
          }}>
            <img 
              src="/src/img/logoUniSales.png" 
              alt="Logo UniSales" 
              style={{ maxWidth: '210px', height: 'auto', display: 'block', margin: '0 auto' }} 
            />
          </div>

          <p style={{ 
            color: '#64748b', 
            fontSize: '13.5px', 
            marginBottom: '35px', 
            textAlign: 'center',
            width: '100%'
          }}>Seja bem-vindo</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%' }}>
            
            {/* CAMPO USUÁRIO COM ÍCONE DO AVA */}
            <div style={{ position: 'relative', width: '100%' }}>
              <label style={{
                fontSize: '11px',
                color: '#64748b',
                position: 'absolute',
                top: '-8px',
                left: '12px',
                background: '#ffffff',
                padding: '0 5px',
                zIndex: 3
              }}>Usuário</label>
              
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                {/* Ícone Vetorial de Usuário do AVA */}
                <svg style={{ position: 'absolute', left: '14px', width: '16px', height: '16px', fill: '#94a3b8' }} viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Digite seu usuário..." 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '13px 14px 13px 42px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    backgroundColor: '#f8fafc',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* CAMPO SENHA COM ÍCONES DO AVA */}
            <div style={{ position: 'relative', width: '100%' }}>
              <label style={{
                fontSize: '11px',
                color: '#64748b',
                position: 'absolute',
                top: '-8px',
                left: '12px',
                background: '#ffffff',
                padding: '0 5px',
                zIndex: 3
              }}>Senha</label>
              
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                {/* Ícone Vetorial de Cadeado do AVA */}
                <svg style={{ position: 'absolute', left: '14px', width: '16px', height: '16px', fill: '#94a3b8' }} viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '13px 44px 13px 42px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    backgroundColor: '#f8fafc',
                    outline: 'none'
                  }}
                />
                {/* Ícone do Olho Visualizador do AVA */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg style={{ width: '20px', height: '20px', fill: showPassword ? '#1e3a8a' : '#64748b' }} viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Dica opcional para desenvolvedor */}
            <small style={{ color: '#cbd5e1', fontSize: '10px', marginTop: '-12px', textAlign: 'left' }}>
              
            </small>

            {/* BOTÃO ENTRAR CORPORATIVO ACINZENTADO */}
            <button type="submit" style={{
              background: '#273b4a',
              color: '#ffffff',
              border: 'none',
              padding: '13px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '4px',
              width: '100%',
              letterSpacing: '0.3px'
            }}>
              Entrar
            </button>
          </form>

          {/* RODAPÉ DE RECUPERAÇÃO DE CONTA */}
          <div style={{ 
            marginTop: '32px', 
            fontSize: '13px', 
            color: '#64748b',
            width: '100%',
            textAlign: 'center'
          }}>
            <a href="#esqueceu" style={{ color: '#1e3a8a', textDecoration: 'none', fontWeight: '500' }}>Esqueci o usuário</a>
            <span style={{ margin: '0 8px', color: '#cbd5e1' }}>ou</span>
            <a href="#esqueceu" style={{ color: '#1e3a8a', textDecoration: 'none', fontWeight: '500' }}>Esqueci a senha</a>
          </div>

        </div>
      </div>

    </div>
  )
}