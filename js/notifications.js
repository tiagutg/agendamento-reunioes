/* ================================================================
   js/notifications.js
   Responsabilidade: Controle do dropdown de notificações.

   - Abre/fecha o dropdown ao clicar no sino
   - Marca todas as notificações como lidas
   - Fecha ao clicar fora do dropdown
   ================================================================ */


/* ================================================================
   REFERÊNCIAS DO DOM
   ================================================================ */

const notificationBell     = document.getElementById("notificationBell");
const notificationDropdown = document.getElementById("notificationDropdown");
const markAllRead          = document.getElementById("markAllRead");
const notificationDot      = document.querySelector(".notification-dot");
const itemDots             = document.querySelectorAll(".item-dot");


/* ================================================================
   SINO — abre/fecha dropdown
   ================================================================ */

notificationBell.addEventListener("click", (event) => {
    event.stopPropagation();

    // Garante que o dropdown de conta seja fechado
    accountDropdown.classList.remove("show");

    // Alterna visibilidade
    notificationDropdown.classList.toggle("show");
});


/* ================================================================
   MARCAR TODAS COMO LIDAS
   ================================================================ */

markAllRead.addEventListener("click", () => {

    // Remove bolinha do sino
    if (notificationDot) {
        notificationDot.style.display = "none";
    }

    // Remove bolinha de cada item
    itemDots.forEach(dot => {
        dot.style.display = "none";
    });

});


/* ================================================================
   FECHAR AO CLICAR FORA
   ================================================================ */

document.addEventListener("click", (event) => {
    const clicouNoSino     = notificationBell.contains(event.target);
    const clicouNoDropdown = notificationDropdown.contains(event.target);
    const clicouNoModal    = modalOverlay.contains(event.target);

    if (!clicouNoSino && !clicouNoDropdown && !clicouNoModal) {
        notificationDropdown.classList.remove("show");
    }
});