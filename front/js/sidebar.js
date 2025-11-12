document.addEventListener("DOMContentLoaded", () => {
  fetch("./sidebar.html")
    .then(response => {
      if (!response.ok) throw new Error("No se encontró sidebar.html");
      return response.text();
    })
    .then(html => {
      const container = document.getElementById("sidebar-container");
      if (container) {
        container.innerHTML = html;
        initializeSidebar(); // ✅ ejecuta después de insertarlo
      } else {
        console.error("No existe el contenedor #sidebar-container");
      }
    })
    .catch(err => console.error("Error al cargar el sidebar:", err));
});


function initializeSidebar() {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
        window.location.href = "login.html";
        return;
    }

    // Mostrar inicial y rol
    const avatar = document.getElementById("user-avatar");
    const role = document.getElementById("user-role");

    if (avatar && role) {
        avatar.textContent = userData.nombre_completo.charAt(0).toUpperCase();
        role.textContent = userData.rol_id === 1 ? "Administrador" : "Empleado";
    }

    // Controlar visibilidad del menú
    const menuItems = document.querySelectorAll(".menu-item");
    if (userData.rol_id === 2) {
        menuItems.forEach(item => {
            const page = item.getAttribute("data-page");
            if (page !== "ventas" && !item.classList.contains("logout")) {
                item.style.display = "none";
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "../pages/login.html";
        });
    }
}
