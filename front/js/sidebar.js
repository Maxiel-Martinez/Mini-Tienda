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
  document.getElementById("logout-btn").addEventListener("click", async () => {
    const confirm = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión se cerrará y volverás al inicio de sesión.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      localStorage.removeItem("user");
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Sesión cerrada correctamente",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      window.location.href = "../pages/login.html";
    }
  });

  document.querySelectorAll(".menu-item").forEach(item => {
    const page = item.getAttribute("data-page");

    if (page && !item.classList.contains("logout")) {
      item.addEventListener("click", () => {
        window.location.href = `../pages/${page}.html`;
      });
    }
  });
}
