/* ================================================================
   js/account.js
   Responsabilidade: Controle do dropdown de conta do usuário.

   - Abre/fecha o painel ao clicar no avatar
   - Fecha o dropdown de notificações ao abrir
   ================================================================ */


/* ================================================================
   REFERÊNCIAS DO DOM
   ================================================================ */

const accountButton   = document.getElementById("accountButton");
const accountDropdown = document.getElementById("accountDropdown");


/* ================================================================
   AVATAR — abre/fecha dropdown de conta
   ================================================================ */

accountButton.addEventListener("click", () => {

    // Fecha notificações
    notificationDropdown.classList.remove("show");

    // Alterna conta
    accountDropdown.classList.toggle("show");

});