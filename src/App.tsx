import { useEffect, useState } from 'react'

import './components/header/header.css'
import './components/header/account.css'
import './components/header/notifications.css'
import './components/sidebar/sidebar.css'
import logoUniSales from './img/logoUniSales.png'

import { Login } from './components/login/login.tsx'
import { StudentMeetings } from './components/meetings/StudentMeetings.tsx'
import { ProfessorMeetings } from './components/meetings/ProfessorMeetings.tsx'

type UserRole = 'student' | 'professor'
type TelaAtiva = 'home' | 'reunioes' | 'notificacoes'

function App() {
  // Controle de Autenticação
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentRole, setCurrentRole] = useState<UserRole>('student')
  const [username, setUsername] = useState('')

  // Layout states - Inicia na tela 'home'
  const [telaAtiva, setTelaAtiva] = useState<TelaAtiva>('home')
  
  // No PC inicia aberto (true), no Mobile inicia recolhido (false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768)

  // Atualiza o estado do menu caso o usuário mude a rotação ou tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fecha a barra lateral automaticamente ao mudar de tela (apenas no mobile)
  const navegarPara = (tela: TelaAtiva) => {
    setTelaAtiva(tela)
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false)
    }
  }

  const handleLoginSuccess = (user: string, role: UserRole) => {
    setUsername(user)
    setCurrentRole(role)
    setIsLoggedIn(true)
    setIsSidebarOpen(window.innerWidth > 768)
    setTelaAtiva('home')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setTelaAtiva('home')
  }

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <>
      {/* HEADER INSTITUCIONAL - CORRIGIDO Z-INDEX MÁXIMO */}
      <header style={{ zIndex: 2000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '60px' }}>
        <div className="header-left">
          <div 
            className="menu-icon" 
            id="menuToggle" 
            style={{ cursor: 'pointer', fontSize: '24px', padding: '0 10px' }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </div>
          <div className="logo">
            <img src={logoUniSales} alt="Logo UniSales" />
          </div>
        </div>

        <div className="header-right">
          <div className="notification-wrapper">
            <i className="fa-regular fa-bell" id="notificationBell" style={{ cursor: 'pointer' }}></i>
            <span className="notification-dot"></span>
            <div className="notification-dropdown" id="notificationDropdown">
              <div className="notification-header">
                <strong>Notificações</strong>
                <span id="markAllRead" style={{ cursor: 'pointer' }}>Marcar tudo como lido</span>
              </div>
              <div className="dropdown-item">
                <div className="mail-icon"><i className="fa-regular fa-envelope"></i></div>
                <div>
                  <h4>Você tem uma nova mensagem</h4>
                  <p>REUNIÃO CONFIRMADA</p>
                  <small>Hoje - 14:30</small>
                </div>
              </div>
            </div>
          </div>

          <div>▦</div>

          <div className="account-wrapper">
            <div className="avatar" id="accountButton" style={{ cursor: 'pointer' }}>
              {username.substring(0, 2).toUpperCase()}
            </div>
            <div className="account-dropdown" id="accountDropdown">
              <div className="account-header">
                <h3 style={{ textTransform: 'uppercase' }}>{username.replace('.', ' ')}</h3>
                <p>Ambiente: UNISALES (Graduação)</p>
                <span style={{ display: 'inline-block', margin: '5px 0' }}>
                  {currentRole === 'professor' ? 'Professor' : 'Estudante'}
                </span>
                <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '10px 0' }} />
                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    padding: '6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Sair do Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* BACKGROUND OVERLAY - MOBILE */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 998,
          display: window.innerWidth <= 768 && isSidebarOpen ? 'block' : 'none',
          opacity: isSidebarOpen ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      ></div>

      {/* CONTAINER PRINCIPAL COM ESPAÇAMENTO DO TOPO CONFIGURADO */}
      <div className="container" style={{ display: 'flex', paddingTop: '60px', boxSizing: 'border-box' }}>

        {/* SIDEBAR - REPOSICIONADA ABAIXO DO HEADER */}
        <aside 
          id="sidebar" 
          className={isSidebarOpen ? '' : 'collapsed'}
          style={{
            position: 'fixed',
            left: isSidebarOpen ? '0px' : '-260px',
            top: '60px',
            height: 'calc(100vh - 60px)',
            width: '230px',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 999,
            backgroundColor: '#ffffff',
            boxShadow: isSidebarOpen ? '4px 0 10px rgba(0,0,0,0.05)' : 'none',
            overflowY: 'auto'
          }}
        >
          {/* Caixa de busca reposicionada de forma relativa dentro da área visível */}
          <div className="search" style={{ padding: '15px 10px 10px 10px' }}>
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass" id="searchToggle" style={{ cursor: 'pointer' }}></i>
              <input type="text" placeholder="Buscar..." id="menuSearch" />
            </div>
          </div>

          <div 
            className={`menu-item ${telaAtiva === 'home' ? 'active' : ''}`} 
            id="menuHome"
            onClick={() => navegarPara('home')}
          >
            <i className="fa-solid fa-house"></i><span>Home</span>
          </div>
          
          <div className="menu-item" id="menuDisciplinas">
            <i className="fa-solid fa-graduation-cap"></i><span>Disciplinas</span>
          </div>

          <div
            className={`menu-item ${telaAtiva === 'notificacoes' ? 'active' : ''}`}
            id="menuNotificacoes"
            onClick={() => navegarPara('notificacoes')}
          >
            <i className="fa-solid fa-bullhorn"></i><span>Avisos</span>
          </div>

          <div className="menu-item" id="menuMensagens">
            <i className="fa-regular fa-envelope"></i><span>Mensagens</span>
          </div>

          <div className="menu-item" id="menuConquistas">
            <i className="fa-solid fa-award"></i><span>Conquistas</span>
          </div>

          <div className="menu-item" id="menuCalendario">
            <i className="fa-regular fa-calendar-days"></i><span>Calendário</span>
          </div>

          <div className="menu-item" id="menuFerramentas">
            <i className="fa-solid fa-screwdriver-wrench"></i><span>Ferramentas</span>
          </div>

          <div className="menu-item" id="menuComunidades">
            <i className="fa-solid fa-users"></i><span>Comunidades</span>
          </div>

          <div
            className={`menu-item ${telaAtiva === 'reunioes' ? 'active' : ''}`}
            id="menuAgendamentos"
            onClick={() => navegarPara('reunioes')}
          >
            <i className="fa-regular fa-calendar"></i>
            <span>{currentRole === 'professor' ? 'Atendimentos' : 'Reuniões'}</span>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL COM AJUSTE DINÂMICO DE MARGEM DA ESQUERDA */}
        <main
          id="mainContent"
          style={{
            marginLeft: window.innerWidth <= 768 ? '0px' : (isSidebarOpen ? '230px' : '0px'),
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%',
            padding: '20px',
            boxSizing: 'border-box',
            minHeight: 'calc(100vh - 60px)',
          }}
        >
          {/* TELA DE RENDERS */}
          {telaAtiva === 'home' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <h1 className="page-title" style={{ fontSize: '24px', color: '#1e293b', marginBottom: '8px' }}>
                Olá, {username.replace('.', ' ').toUpperCase()}!
              </h1>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>Bem-vindo de volta ao Ambiente Virtual de Aprendizagem UniSales.</p>
              
              <div className="meeting-card" style={{ 
                background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', 
                color: '#fff', 
                padding: '25px', 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(37,99,235,0.15)',
                marginBottom: '20px'
              }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Painel do {currentRole === 'professor' ? 'Professor' : 'Estudante'}</h2>
                <p style={{ opacity: 0.9, fontSize: '14px', marginTop: '8px', maxWidth: '600px' }}>
                  Fique por dentro das suas atividades acadêmicas. Acesse os seus agendamentos rápidos clicando no menu lateral na aba 
                  <strong> {currentRole === 'professor' ? 'Atendimentos' : 'Reuniões'}</strong>.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                <div className="meeting-card" onClick={() => navegarPara('reunioes')} style={{ cursor: 'pointer', borderLeft: '4px solid #10b981' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{currentRole === 'professor' ? 'Meus Atendimentos' : 'Minhas Reuniões'}</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Gerenciar horários solicitados.</p>
                </div>
                <div className="meeting-card" onClick={() => navegarPara('notificacoes')} style={{ cursor: 'pointer', borderLeft: '4px solid #f59e0b' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>Mural de Avisos</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Ver notificações pendentes.</p>
                </div>
              </div>
            </div>
          )}

          {telaAtiva === 'reunioes' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {currentRole === 'professor' ? <ProfessorMeetings /> : <StudentMeetings />}
            </div>
          )}

          {telaAtiva === 'notificacoes' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h1 className="page-title">Notificações</h1>
              <div className="meeting-card">
                <p>Central de avisos institucionais do ambiente UniSales.</p>
              </div>
            </div>
          )}
        </main>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          #sidebar {
            box-shadow: 5px 0 15px rgba(0,0,0,0.15) !important;
          }
        }
      `}</style>
    </>
  )
}

export default App