 // Pegando o formulário pelo ID
    const form = document.getElementById("formAgendamento");

    // Pegando a área onde os agendamentos serão exibidos
    const listaAgendamentos = document.getElementById("listaAgendamentos");

    // Array para guardar os agendamentos temporariamente
    let agendamentos = [];

    // Evento disparado quando o usuário envia o formulário
    form.addEventListener("submit", function(event) {
      event.preventDefault();

      // Criando um objeto com os dados do agendamento
      const novoAgendamento = {
        professor: document.getElementById("professor").value,
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value,
        formato: document.getElementById("formato").value,
        topico: document.getElementById("topico").value,
        resumo: document.getElementById("resumo").value,
        status: "Pendente"
      };

      // Adicionando o novo agendamento na lista
      agendamentos.push(novoAgendamento);

      // Limpando o formulário
      form.reset();

      // Atualizando a tela
      renderizarAgendamentos();
    });

    // Função responsável por mostrar os agendamentos na tela
    function renderizarAgendamentos() {
      listaAgendamentos.innerHTML = "";

      // Caso não tenha agendamentos
      if (agendamentos.length === 0) {
        listaAgendamentos.innerHTML = '<div class="empty">Nenhuma reunião agendada ainda.</div>';
        return;
      }

      // Criando visualmente cada agendamento
      agendamentos.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "agenda-item";

        card.innerHTML = `
          <h3>${item.topico}</h3>
          <p><strong>Com:</strong> ${item.professor}</p>
          <p><strong>Data:</strong> ${formatarData(item.data)}</p>
          <p><strong>Horário:</strong> ${item.hora}</p>
          <p><strong>Formato:</strong> ${item.formato}</p>
          <p><strong>Resumo:</strong> ${item.resumo}</p>
          <span class="status">${item.status}</span>
        `;

        listaAgendamentos.appendChild(card);
      });
    }

    // Função para deixar a data no formato brasileiro
    function formatarData(data) {
      const partes = data.split("-");
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

// Pegando os elementos
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");


// Evento de clique
const overlay = document.getElementById("overlay");

menuToggle.addEventListener("click", () => {

    // MOBILE
    if(window.innerWidth <= 768){

        sidebar.classList.toggle("show");
        overlay.classList.toggle("show");

    } 
    
    // DESKTOP
    else {

        sidebar.classList.toggle("hidden");

    }

});

// Fechar clicando fora
overlay.addEventListener("click", () => {

    sidebar.classList.remove("show");
    overlay.classList.remove("show");

});

const mainContent = document.getElementById("mainContent");
const menuAgendamentos = document.getElementById("menuAgendamentos");
const menuNotificacoes = document.getElementById("menuNotificacoes");

// Salvando o conteúdo inicial da página
const conteudoInicial = mainContent.innerHTML;

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

menuAgendamentos.addEventListener("click", () => {

    // Volta o conteúdo original
    mainContent.innerHTML = conteudoInicial;

    // Troca menu ativo
    menuNotificacoes.classList.remove("active");
    menuAgendamentos.classList.add("active");

});

const notificationBell = document.getElementById("notificationBell");
const notificationDropdown = document.getElementById("notificationDropdown");

notificationBell.addEventListener("click", (event) => {
    event.stopPropagation();

    accountDropdown.classList.remove("show");
    notificationDropdown.classList.toggle("show");
});


// =============================
// BUSCA DO MENU LATERAL
// =============================

// Input da busca
const menuSearch = document.getElementById("menuSearch");

// Todos os menus
const menuItems = document.querySelectorAll(".menu-item");

// Evento ao digitar
menuSearch.addEventListener("keyup", () => {

    // Texto digitado
    const texto = menuSearch.value.toLowerCase();

    // Percorrendo menus
    menuItems.forEach(item => {

        // Texto do menu
        const nomeMenu = item.innerText.toLowerCase();

        // Verifica se contém texto
        if(nomeMenu.includes(texto)){

            item.style.display = "flex";

        } else {

            item.style.display = "none";

        }

    });

});

// Fecha o menu lateral no celular ao clicar em uma opção
const opcoesMenu = document.querySelectorAll(".menu-item");

opcoesMenu.forEach(opcao => {
    opcao.addEventListener("click", () => {

        if (window.innerWidth <= 768) {
            sidebar.classList.remove("show");
            overlay.classList.remove("show");
        }

    });
});

// =============================
// DROPDOWN DA CONTA
// =============================

const accountButton = document.getElementById("accountButton");
const accountDropdown = document.getElementById("accountDropdown");

accountButton.addEventListener("click", () => {

    // Fecha notificações
    notificationDropdown.classList.remove("show");

    // Abre conta
    accountDropdown.classList.toggle("show");

});

// =============================
// MARCAR NOTIFICAÇÕES COMO LIDAS
// =============================

// Botão
const markAllRead = document.getElementById("markAllRead");

// Bolinha do sino
const notificationDot = document.querySelector(".notification-dot");

// Todas bolinhas das notificações
const itemDots = document.querySelectorAll(".item-dot");

// Clique
markAllRead.addEventListener("click", () => {

    // Remove bolinha do sino
    if(notificationDot){
        notificationDot.style.display = "none";
    }

    // Remove bolinhas das notificações
    itemDots.forEach(dot => {
        dot.style.display = "none";
    });

});

// =============================
// MODAL DE DETALHES DA NOTIFICAÇÃO
// =============================

const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalProfessor = document.getElementById("modalProfessor");
const modalDate = document.getElementById("modalDate");
const modalTime = document.getElementById("modalTime");
const modalStatus = document.getElementById("modalStatus");

const dropdownItems = document.querySelectorAll(".dropdown-item");

dropdownItems.forEach(item => {

    item.addEventListener("click", () => {

        // Dados do modal
        modalTitle.innerText = item.dataset.title;
        modalDescription.innerText = item.dataset.description;
        modalProfessor.innerText = item.dataset.professor;
        modalDate.innerText = item.dataset.date;
        modalTime.innerText = item.dataset.time;
        modalStatus.innerText = item.dataset.status;

        // Abre modal
        modalOverlay.classList.add("show");

        // Fecha dropdown
        //notificationDropdown.classList.remove("show");

        // =========================
        // REMOVE BOLINHA DA NOTIFICAÇÃO
        // =========================

        const dot = item.querySelector(".item-dot");

        if(dot){
            dot.style.display = "none";
        }

        // =========================
        // VERIFICA SE AINDA EXISTEM
        // NOTIFICAÇÕES NÃO LIDAS
        // =========================

        const remainingDots = document.querySelectorAll(
            ".item-dot[style='display: none;']"
        );

        // Total de notificações
        const totalDots = document.querySelectorAll(".item-dot").length;

        // Se todas foram lidas
        if(remainingDots.length === totalDots){

            if(notificationDot){
                notificationDot.style.display = "none";
            }

        }

    });

});

closeModal.addEventListener("click", () => {
    modalOverlay.classList.remove("show");

    // Mantém a barrinha de notificações aberta
    notificationDropdown.classList.add("show");
});

modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove("show");

        // Mantém a barrinha de notificações aberta
        notificationDropdown.classList.add("show");
    }
});

document.addEventListener("click", (event) => {
    const clicouNoSino = notificationBell.contains(event.target);
    const clicouNoDropdown = notificationDropdown.contains(event.target);
    const clicouNoModal = modalOverlay.contains(event.target);

    if (!clicouNoSino && !clicouNoDropdown && !clicouNoModal) {
        notificationDropdown.classList.remove("show");
    }
});

const searchToggle = document.getElementById("searchToggle");

searchToggle.addEventListener("click", () => {

    // Se menu estiver minimizado
    if(sidebar.classList.contains("collapsed")){

        // Abre menu
        sidebar.classList.remove("collapsed");

    }

});

