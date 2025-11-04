const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showLoginLink = document.getElementById('show-login');
const toggleContainer = document.getElementById('toggle-container');
document.addEventListener('DOMContentLoaded', function () {
    // Función para mostrar el formulario de Login
    // function showLoginForm() {
    //     loginForm.classList.add('active');
    //     registerForm.classList.remove('active');
    //     loginTab.classList.add('active');
    //     registerTab.classList.remove('active');
    //     toggleContainer.classList.remove('register-active');
    // }

    // Función para mostrar el formulario de Registro
    // function showRegisterForm() {
    //     registerForm.classList.add('active');
    //     loginForm.classList.remove('active');
    //     registerTab.classList.add('active');
    //     loginTab.classList.remove('active');
    //     toggleContainer.classList.add('register-active');
    // }

    // Eventos de clic para las pestañas
    // loginTab.addEventListener('click', showLoginForm);
    // registerTab.addEventListener('click', showRegisterForm);
    // showLoginLink.addEventListener('click', function(e) {
    //     e.preventDefault();
    //     showLoginForm();
    // });

    // Efecto de enfoque en inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});

// ---- Login ----
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm)
  const data = Object.fromEntries(formData)

  try {
    const response = await fetch("http://localhost:4000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const dataBack = await response.json();
    console.log("🚀 ~ dataBack:", dataBack)

    if (dataBack.succes) {
      alert("Bienvenido " + dataBack.user.nombre_completo + " 🎉");
      localStorage.setItem('user', JSON.stringify(dataBack.user))
      // Aquí podrías redirigir a otra página:
      window.location.href = "dashboard.html";
    } else {
      alert(dataBack.msg || "Error en login ❌");
    }
  } catch (err) {
    alert("Error al iniciar sesión ❌");
    console.error(err);
  }
});

// ---- Registro ----
// registerForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const formData = new FormData(registerForm)
//   const data = Object.fromEntries(formData)

//   try {
//     const response = await fetch("http://localhost:4000/api/users/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data)
//     });

//     const dataBack = await response.json();
//     if (!dataBack.succes) {
//       alert(dataBack.msg || "Error en registro ❌");
//       return;
//     }
//     alert(dataBack.msg || "Registro realizado ✅");
//     window.location.href = "dashboard.html";
//   } catch (err) {
//     alert("Error al registrar ❌");
//     console.error(err);
//   }
// });
