import React, { useEffect, useState } from 'react'

// Importando os arquivos de estilo (CSS) das estruturas externas
import './components/header/header.css'
import './components/header/account.css'
import './components/header/notifications.css'
import './components/sidebar/sidebar.css'

// Importando o novo core encapsulado de Agendamentos
import { StudentMeetings } from './components/meetings/StudentMeetings.js'

// Importando as lógicas antigas estruturais
import { initAccount } from './components/header/account.js'
import { initNotifications } from './components/header/notifications.js'
import { initSidebar } from './components/sidebar/sidebar.js'

function App() {
  const [telaAtiva, setTelaAtiva] = useState<'reunioes' | 'notificacoes'>('reunioes')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    initAccount()
    initNotifications()
    initSidebar()

    const menuToggle = document.getElementById("menuToggle")
    const sidebar = document.getElementById("sidebar")
    
    const sincronizarLayout = () => {
      if (sidebar) {
        setIsSidebarCollapsed(sidebar.classList.contains("hidden"))
      }
    }

    menuToggle?.addEventListener("click", sincronizarLayout)
    sincronizarLayout()

    return () => menuToggle?.removeEventListener("click", sincronizarLayout)
  }, [telaAtiva])

  return (
    <>
      {/* MODAL DE DETALHES DA NOTIFICAÇÃO DO AVA */}
      <div className="modal-overlay" id="modalOverlay">
        <div className="notification-modal">
          <div className="modal-header">
            <h2 id="modalTitle">Título</h2>
            <button id="closeModal">×</button>
          </div>
          <div className="modal-body">
            <p id="modalDescription"></p>
          </div>
        </div>
      </div>

      {/* HEADER INSTITUCIONAL */}
      <header>
        <div className="header-left">
          <div className="menu-icon" id="menuToggle" style={{ cursor: 'pointer' }}>☰</div>
          <div className="logo">
            <img src="/src/img/logoUniSales.png" alt="Logo UniSales" />
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
            <div className="avatar" id="accountButton" style={{ cursor: 'pointer' }}>TA</div>
            <div className="account-dropdown" id="accountDropdown">
              <div className="account-header">
                <h3>TIAGO LOPES ALVES</h3>
                <p>Ambiente: UNISALES (Graduação)</p>
                <span>Estudante</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="overlay" id="overlay"></div>

      <div className="container" style={{ display: 'flex' }}>
        
        {/* SIDEBAR ESTRUTURAL */}
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
            <i className="fa-regular fa-calendar"></i><span>Reuniões</span>
          </div>
        </aside>

        {/* CENTRO DINÂMICO DO PRODUTO */}
        <main 
          id="mainContent" 
          style={{ 
            marginLeft: isSidebarCollapsed ? '60px' : '230px', 
            transition: 'margin-left 0.3s ease',
            width: '100%',
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          {telaAtiva === 'reunioes' ? (
            /* Chamando nosso componente isolado de agendamentos */
            <StudentMeetings />
          ) : (
            /* Tela secundária de Avisos */
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