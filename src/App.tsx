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
type TelaAtiva = 'reunioes' | 'notificacoes'

function App() {
  // Controle de Autenticação
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentRole, setCurrentRole] = useState<UserRole>('student')
  const [username, setUsername] = useState('')

  // Layout states
  const [telaAtiva, setTelaAtiva] = useState<TelaAtiva>('reunioes')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) return

    const menuToggle = document.getElementById('menuToggle')
    const sidebar    = document.getElementById('sidebar')

    const sincronizarLayout = () => {
      if (sidebar) setIsSidebarCollapsed(sidebar.classList.contains('hidden'))
    }

    menuToggle?.addEventListener('click', sincronizarLayout)
    sincronizarLayout()

    return () => menuToggle?.removeEventListener('click', sincronizarLayout)
  }, [telaAtiva, isLoggedIn])

  // Callback disparado ao efetuar o login com sucesso no componente isolado
  const handleLoginSuccess = (user: string, role: UserRole) => {
    setUsername(user)
    setCurrentRole(role)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setTelaAtiva('reunioes')
  }

  // 1. RENDERIZAÇÃO DA TELA DE LOGIN (Caso não esteja autenticado)
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // 2. RENDERIZAÇÃO DO SISTEMA PRINCIPAL (Após o login efetuado)
  return (
    <>
      {/* HEADER INSTITUCIONAL */}
   {/* HEADER INSTITUCIONAL */}
      <header>
        <div className="header-left">
          <div className="menu-icon" id="menuToggle" style={{ cursor: 'pointer' }}>☰</div>
          <div className="logo">
            {/* CORRIGIDO: Agora usa a variável importada entre chaves e sem aspas */}
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

      <div className="overlay" id="overlay"></div>

      <div className="container" style={{ display: 'flex' }}>

        {/* SIDEBAR */}
        <aside id="sidebar">
          <div className="search">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass" id="searchToggle" style={{ cursor: 'pointer' }}></i>
              <input type="text" placeholder="Buscar..." id="menuSearch" />
            </div>
          </div>

          <div className="menu-item" id="menuHome"><i className="fa-solid fa-house"></i><span>Home</span></div>
          <div className="menu-item" id="menuDisciplinas"><i className="fa-solid fa-graduation-cap"></i><span>Disciplinas</span></div>

          <div
            className={`menu-item ${telaAtiva === 'notificacoes' ? 'active' : ''}`}
            id="menuNotificacoes"
            onClick={() => setTelaAtiva('notificacoes')}
          >
            <i className="fa-solid fa-bullhorn"></i><span>Avisos</span>
          </div>

          <div className="menu-item" id="menuMensagens"><i className="fa-regular fa-envelope"></i><span>Mensagens</span></div>
          <div className="menu-item" id="menuCalendario"><i className="fa-regular fa-calendar-days"></i><span>Calendário</span></div>

          <div
            className={`menu-item ${telaAtiva === 'reunioes' ? 'active' : ''}`}
            id="menuAgendamentos"
            onClick={() => setTelaAtiva('reunioes')}
          >
            <i className="fa-regular fa-calendar"></i>
            <span>{currentRole === 'professor' ? 'Atendimentos' : 'Reuniões'}</span>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL (COM RECUO DE SEGURANÇA PARA O HEADER) */}
        <main
          id="mainContent"
          style={{
            marginLeft:  isSidebarCollapsed ? '60px' : '230px',
            transition:  'margin-left 0.3s ease',
            width:       '100%',
            padding:     '20px',
            paddingTop:  '85px',
            boxSizing:   'border-box',
            minHeight:   '100vh',
          }}
        >
          {telaAtiva === 'reunioes' ? (
            currentRole === 'professor' ? <ProfessorMeetings /> : <StudentMeetings />
          ) : (
            <>
              <h1 className="page-title">Notificações</h1>
              <div className="meeting-card">
                <p>Central de avisos institucionais do ambiente UniSales.</p>
              </div>
            </>
          )}
        </main>

      </div>
    </>
  )
}

export default App