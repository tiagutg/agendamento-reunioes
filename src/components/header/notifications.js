/* ================================================================
   js/notifications.js
   Responsabilidade: Controle do dropdown de notificações.
   ================================================================ */

export function initNotifications() {
  const notificationBell     = document.getElementById("notificationBell");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const markAllRead          = document.getElementById("markAllRead");
  const notificationDot      = document.querySelector(".notification-dot");
  const itemDots             = document.querySelectorAll(".item-dot");
  const accountDropdown      = document.getElementById("accountDropdown");
  const modalOverlay         = document.getElementById("modalOverlay");

  // Só ativa os eventos se o sino e o dropdown existirem na tela
  if (notificationBell && notificationDropdown) {
    
    /* SINO — abre/fecha dropdown */
    notificationBell.addEventListener("click", (event) => {
      event.stopPropagation();

      // Garante que o dropdown de conta seja fechado
      if (accountDropdown) {
        accountDropdown.classList.remove("show");
        accountDropdown.classList.remove("active");
      }

      // Alterna visibilidade usando as duas classes (compatibilidade com seu CSS antigo)
      notificationDropdown.classList.toggle("show");
      notificationDropdown.classList.toggle("active");
    });

    /* MARCAR TODAS COMO LIDAS */
    if (markAllRead) {
      markAllRead.addEventListener("click", () => {
        if (notificationDot) {
          notificationDot.style.display = "none";
        }
        itemDots.forEach(dot => {
          dot.style.display = "none";
        });
      });
    }

    /* FECHAR AO CLICAR FORA */
    document.addEventListener("click", (event) => {
      const clicouNoSino     = notificationBell.contains(event.target);
      const clicouNoDropdown = notificationDropdown.contains(event.target);
      const clicouNoModal    = modalOverlay ? modalOverlay.contains(event.target) : false;

      if (!clicouNoSino && !clicouNoDropdown && !clicouNoModal) {
        notificationDropdown.classList.remove("show");
        notificationDropdown.classList.remove("active");
      }
    });
  }
}