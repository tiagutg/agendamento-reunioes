/* ================================================================
   js/modal.js
   Responsabilidade: Controle do modal de detalhes da notificação.

   - Preenche campos do modal ao clicar em notificação
   - Remove bolinha lida do item clicado
   - Verifica se todas as notificações foram lidas
   - Fecha via botão × ou clique no overlay
   - Mantém dropdown de notificações aberto ao fechar modal
   ================================================================ */


/* ================================================================
   REFERÊNCIAS DO DOM
   ================================================================ */

const modalOverlay     = document.getElementById("modalOverlay");
const closeModal       = document.getElementById("closeModal");
const modalTitle       = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalProfessor   = document.getElementById("modalProfessor");
const modalDate        = document.getElementById("modalDate");
const modalTime        = document.getElementById("modalTime");
const modalStatus      = document.getElementById("modalStatus");
const dropdownItems    = document.querySelectorAll(".dropdown-item");


/* ================================================================
   ABRIR MODAL AO CLICAR EM NOTIFICAÇÃO
   ================================================================ */

dropdownItems.forEach(item => {
    item.addEventListener("click", () => {

        // Preenche os campos com data-attributes do item
        modalTitle.innerText       = item.dataset.title;
        modalDescription.innerText = item.dataset.description;
        modalProfessor.innerText   = item.dataset.professor;
        modalDate.innerText        = item.dataset.date;
        modalTime.innerText        = item.dataset.time;
        modalStatus.innerText      = item.dataset.status;

        // Exibe o modal
        modalOverlay.classList.add("show");

        // Fecha dropdown
        //notificationDropdown.classList.remove("show");

        // Remove bolinha do item clicado
        const dot = item.querySelector(".item-dot");
        if (dot) {
            dot.style.display = "none";
        }

        // Verifica se todas as notificações foram lidas
        const remainingDots = document.querySelectorAll(".item-dot[style='display: none;']");
        const totalDots     = document.querySelectorAll(".item-dot").length;

        if (remainingDots.length === totalDots) {
            if (notificationDot) {
                notificationDot.style.display = "none";
            }
        }

    });
});


/* ================================================================
   FECHAR MODAL — botão ×
   ================================================================ */

closeModal.addEventListener("click", () => {
    modalOverlay.classList.remove("show");
    notificationDropdown.classList.add("show");
});


/* ================================================================
   FECHAR MODAL — clique no overlay
   ================================================================ */

modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove("show");
        notificationDropdown.classList.add("show");
    }
});