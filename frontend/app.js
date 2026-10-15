/**
 * Frontend simple para CRUD de productos de la tienda de perritos.
 */

document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://uzhnb8lls6.execute-api.us-east-1.amazonaws.com/prod";
  const PRODUCTOS_API = `${API_BASE}/api/productos`;
  const PEDIDOS_API   = `${API_BASE}/api/pedidos`;
  const HEALTH_API    = `${API_BASE}/api/health`;

  let editandoId = null;

  const tbody = document.querySelector("#productosTable tbody");
  const form = document.querySelector("#productoForm");
  const btnIniciarSesionAdmin = document.getElementById("btnIniciarSesionAdmin");
  const btnIniciarSesionCliente = document.getElementById("btnIniciarSesionCliente");

  // Inicializar autenticación al cargar la aplicación
  async function iniciarAplicacion() {
    try {
      await authService.inicializarAutenticacion();
      console.log("Autenticación inicializada correctamente.");
      cargarProductos();
    } catch (err) {
      console.error("No se pudo inicializar la autenticación:", err);
    }
  }

  // Manejo de login administrador
  btnIniciarSesionAdmin.addEventListener("click", async () => {
    btnIniciarSesionAdmin.disabled = true;
    try {
      await authService.iniciarSesion("admin");
      console.log("Sesión administrador iniciada.");
    } catch (err) {
      if (err?.errorCode === "interaction_in_progress") {
        console.warn("Ya hay un login en curso para administrador.");
      } else {
        console.error("No se pudo iniciar la sesión de administrador:", err);
      }
    } finally {
      btnIniciarSesionAdmin.disabled = false;
    }
  });

  // Manejo de login cliente
  btnIniciarSesionCliente.addEventListener("click", async () => {
    btnIniciarSesionCliente.disabled = true;
    try {
      await authService.iniciarSesion("cliente");
      console.log("Sesión cliente iniciada.");
    } catch (err) {
      if (err?.errorCode === "interaction_in_progress") {
        console.warn("Ya hay un login en curso para cliente.");
      } else {
        console.error("No se pudo iniciar la sesión de cliente:", err);
      }
    } finally {
      btnIniciarSesionCliente.disabled = false;
    }
  });

  // Función para cargar productos
  async function cargarProductos() {
    try {
      const token = await authService.obtenerTokenDeAcceso();
      const response = await fetch(PRODUCTOS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productos = await response.json();
      renderProductos(productos);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    }
  }

  // Renderizar productos en la tabla
  function renderProductos(productos) {
    tbody.innerHTML = "";
    productos.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.precio}</td>
        <td>
          <button onclick="editarProducto(${p.id})">Editar</button>
          <button onclick="eliminarProducto(${p.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Editar producto
  window.editarProducto = async function (id) {
    editandoId = id;
    try {
      const token = await authService.obtenerTokenDeAcceso();
      const response = await
