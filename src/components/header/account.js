/* ================================================================
   js/account.js
   Responsabilidade: Controle do dropdown de conta do usuário.
   ================================================================ */

export function initAccount() {
  const accountButton   = document.getElementById("accountButton");
  const accountDropdown = document.getElementById("accountDropdown");
  const notificationDropdown = document.getElementById("notificationDropdown");

  if (accountButton && accountDropdown) {
    accountButton.addEventListener("click", (e) => {
      e.stopPropagation();
      
      // Fecha notificações usando a classe original do seu CSS
      if (notificationDropdown) {
        notificationDropdown.classList.remove("show");
        notificationDropdown.classList.remove("active");
      }

      // Alterna conta usando as duas classes para garantir que seu CSS antigo pegue
      accountDropdown.classList.toggle("show");
      accountDropdown.classList.toggle("active");
    });

    // Fecha o menu se clicar em qualquer outro lugar da tela
    document.addEventListener("click", () => {
      accountDropdown.classList.remove("show");
      accountDropdown.classList.remove("active");
    });

    // Impede de fechar se clicar dentro do próprio menu
    accountDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
}