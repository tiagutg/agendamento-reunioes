/* ================================================================
   js/sidebar.js
   Responsabilidade: Controle completo da sidebar.

   - Toggle do hambúrguer (mobile: offcanvas / desktop: ícones)
   - Fechar sidebar ao clicar no overlay
   - Navegação entre páginas (Agendamentos / Notificações)
   - Busca interna do menu
   - Fechar sidebar no mobile ao clicar em opção
   - Expandir sidebar ao clicar na lupa (se recolhida)
   ================================================================ */


/* ================================================================
   REFERÊNCIAS DO DOM
   ================================================================ */

const menuToggle       = document.getElementById("menuToggle");
const sidebar          = document.getElementById("sidebar");
const overlay          = document.getElementById("overlay");
const mainContent      = document.getElementById("mainContent");
const menuAgendamentos = document.getElementById("menuAgendamentos");
const menuNotificacoes = document.getElementById("menuNotificacoes");
const menuSearch       = document.getElementById("menuSearch");
const searchToggle     = document.getElementById("searchToggle");


/* ================================================================
   TOGGLE DA SIDEBAR — ícone hambúrguer
   ================================================================ */

menuToggle.addEventListener("click", () => {

    // MOBILE: abre como painel offcanvas com overlay
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle("show");
        overlay.classList.toggle("show");
    }
    // DESKTOP: recolhe para modo apenas ícones
    else {
        sidebar.classList.toggle("hidden");
    }

});


/* ================================================================
   FECHAR SIDEBAR AO CLICAR NO OVERLAY (mobile)
   ================================================================ */

overlay.addEventListener("click", () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
});


/* ================================================================
   NAVEGAÇÃO — salva conteúdo inicial para restaurar depois
   ================================================================ */

const conteudoInicial = mainContent.innerHTML;


/* ================================================================
   MENU: NOTIFICAÇÕES — injeta view na área principal
   ================================================================ */

menuNotificacoes.addEventListener("click", () => {
    mainContent.innerHTML = `
        <h1 class="page-title">Notificações</h1>

        <div class="card">
            <div class="top-bar">
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    class="search-notification"
                >

                <button class="filter-btn">
                    <i class="fa-solid fa-filter"></i>
                    Filtros
                </button>
            </div>

            <div class="notification-item">
                <h3>Reunião confirmada</h3>
                <p>Professor: João Silva</p>
                <span>14/05/2026 às 19:30</span>
            </div>

            <div class="notification-item">
                <h3>Lembrete de reunião</h3>
                <p>Sua reunião começa em 30 minutos</p>
                <span>14/05/2026 às 18:00</span>
            </div>
        </div>
    `;

    menuAgendamentos.classList.remove("active");
    menuNotificacoes.classList.add("active");
});


/* ================================================================
   MENU: AGENDAMENTOS — restaura conteúdo original
   ================================================================ */

menuAgendamentos.addEventListener("click", () => {
    mainContent.innerHTML = conteudoInicial;
    menuNotificacoes.classList.remove("active");
    menuAgendamentos.classList.add("active");
});


/* ================================================================
   BUSCA INTERNA DO MENU
   Filtra itens conforme texto digitado.
   ================================================================ */

const menuItems = document.querySelectorAll(".menu-item");

menuSearch.addEventListener("keyup", () => {
    const texto = menuSearch.value.toLowerCase();

    menuItems.forEach(item => {
        const nomeMenu = item.innerText.toLowerCase();
        item.style.display = nomeMenu.includes(texto) ? "flex" : "none";
    });
});


/* ================================================================
   FECHAR SIDEBAR NO MOBILE AO CLICAR EM OPÇÃO
   ================================================================ */

const opcoesMenu = document.querySelectorAll(".menu-item");

opcoesMenu.forEach(opcao => {
    opcao.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove("show");
            overlay.classList.remove("show");
        }
    });
});


/* ================================================================
   LUPA — expande sidebar se estiver recolhida
   ================================================================ */

searchToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
    }
});