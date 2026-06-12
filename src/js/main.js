/* ================================================================
   js/main.js
   Responsabilidade: Lógica do formulário de agendamento.

   - Captura envio do formulário
   - Cria objetos de agendamento
   - Armazena no array de estado da sessão
   - Renderiza os cards na lista
   - Utilitários: formatarData, obterIconeFormato
   ================================================================ */


/* ================================================================
   REFERÊNCIAS DO DOM
   ================================================================ */

const form              = document.getElementById("formAgendamento");
const listaAgendamentos = document.getElementById("listaAgendamentos");


/* ================================================================
   ESTADO — array temporário de agendamentos da sessão
   ================================================================ */

let agendamentos = [];


/* ================================================================
   EVENTO: ENVIO DO FORMULÁRIO
   ================================================================ */

form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Monta objeto com os dados preenchidos
    const novoAgendamento = {
        professor: document.getElementById("professor").value,
        data:      document.getElementById("data").value,
        hora:      document.getElementById("hora").value,
        formato:   document.getElementById("formato").value,
        topico:    document.getElementById("topico").value,
        resumo:    document.getElementById("resumo").value,
        status:    "Pendente"
    };

    // Adiciona ao array
    agendamentos.push(novoAgendamento);

    // Limpa o formulário
    form.reset();

    // Atualiza a lista na tela
    renderizarAgendamentos();

    // Scroll suave até a lista
    listaAgendamentos.scrollIntoView({ behavior: "smooth", block: "nearest" });
});


/* ================================================================
   FUNÇÃO: RENDERIZAR AGENDAMENTOS
   Reconstrói todos os cards a partir do array.
   ================================================================ */

function renderizarAgendamentos() {
    listaAgendamentos.innerHTML = "";

    // Estado vazio
    if (agendamentos.length === 0) {
        listaAgendamentos.innerHTML = '<div class="empty">Nenhuma reunião agendada ainda.</div>';
        return;
    }

    // Cria card para cada agendamento
    agendamentos.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "agenda-item";

        const iconeFormato = obterIconeFormato(item.formato);

        card.innerHTML = `
            <h3>${item.topico}</h3>
            <p><strong>Com:</strong> ${item.professor}</p>
            <p><strong>Data:</strong> ${formatarData(item.data)}</p>
            <p><strong>Horário:</strong> ${item.hora}</p>
            <p><strong>Formato:</strong> ${iconeFormato} ${item.formato}</p>
            <p><strong>Resumo:</strong> ${item.resumo}</p>
            <span class="status">${item.status}</span>
        `;

        listaAgendamentos.appendChild(card);
    });
}


/* ================================================================
   UTILITÁRIO: FORMATAR DATA
   Converte AAAA-MM-DD → DD/MM/AAAA
   ================================================================ */

function formatarData(data) {
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


/* ================================================================
   UTILITÁRIO: ÍCONE DO FORMATO
   Retorna emoji para cada tipo de reunião.
   ================================================================ */

function obterIconeFormato(formato) {
    const icones = {
        "Presencial": "🏫",
        "Online":     "💻",
        "Híbrida":    "🔀"
    };
    return icones[formato] || "";
}