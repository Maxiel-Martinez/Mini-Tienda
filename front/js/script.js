// ----------------------------
// VARIABLES GLOBALES
// ----------------------------
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleContainer = document.getElementById('toggle-container');
const showLoginLink = document.getElementById('show-login');

// ----------------------------
// EFECTOS Y EVENTOS DE INTERFAZ
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Efecto visual en inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      this.parentElement.style.transform = 'scale(1.02)';
    });
    input.addEventListener('blur', function () {
      this.parentElement.style.transform = 'scale(1)';
    });
  });

  // Alternar entre login y registro (pestañas)
  if (loginTab && registerTab && toggleContainer) {
    loginTab.addEventListener('click', () => {
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      toggleContainer.classList.remove('register-active');
    });

    registerTab.addEventListener('click', () => {
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      toggleContainer.classList.add('register-active');
    });
  }

  // Si hay un enlace de "ya tengo cuenta"
  if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      toggleContainer.classList.remove('register-active');
    });
  }
});

// ----------------------------
// LOGIN
// ----------------------------
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(loginForm));

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const dataBack = await response.json();
      console.log("🚀 Login:", dataBack);

      if (dataBack.succes) {
        const fullName = dataBack.user.nombre_completo;

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `¡Bienvenido ${fullName}! 🎉`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });

        localStorage.setItem('user', JSON.stringify(dataBack.user));
        window.location.href = "dashboard.html";
      } else {
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: dataBack.msg || 'Usuario o contraseña incorrectos ❌',
          showConfirmButton: false,
          timer: 1200,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      console.error("❌ Error en login:", err);

      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: err.message || 'Verifica que el servidor esté en ejecución.',
      });
    }
  });
}

// ----------------------------
// REGISTRO
// ----------------------------
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(registerForm));

    try {
      const response = await fetch("http://localhost:3000/api/users/register", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const dataBack = await response.json();
      console.log("🚀 Registro:", dataBack);

      if (!dataBack.succes) {
        await Swal.fire({
          icon: "error",
          title: "Error en registro ❌",
          text: dataBack.msg || "No se pudo crear el usuario.",
        });
        return;
      }

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Registro exitoso 🎉",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      localStorage.setItem('user', JSON.stringify(dataBack.user));
      window.location.href = "dashboard.html";

    } catch (err) {
      console.error("❌ Error en registro:", err);

      await Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: err.message,
      });
    }
  });
}
