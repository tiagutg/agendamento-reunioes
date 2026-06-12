export function initSidebar() {
  const menuToggle   = document.getElementById("menuToggle");
  const sidebar      = document.getElementById("sidebar");
  const overlay      = document.getElementById("overlay");
  const menuSearch   = document.getElementById("menuSearch");
  const searchToggle = document.getElementById("searchToggle");

  if (!menuToggle || !sidebar) return;

  const handleToggle = () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle("show");
      if (overlay) overlay.classList.toggle("show");
    } else {
      sidebar.classList.toggle("hidden");
    }
  };

  menuToggle.removeEventListener("click", handleToggle);
  menuToggle.addEventListener("click", handleToggle);

  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
    });
  }

  if (searchToggle) {
    searchToggle.addEventListener("click", () => {
      sidebar.classList.remove("hidden");
    });
  }
}