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
menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
});
