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
            title: "Sesión cerrada correctamente 👋",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
        });
        window.location.href = "../pages/login.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("📊 Dashboard cargado correctamente");
});
