/**
 * Frontend completo para CRUD de productos y gestión de sesiones.
 */

document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://uzhnb8lls6.execute-api.us-east-1.amazonaws.com/prod";
  const PRODUCTOS_API = `${API_BASE}/api/productos`;
  const PEDIDOS_API   = `${API_BASE}/api/pedidos`;
  const HEALTH_API    = `${API_BASE}/api/health`;

  let editandoId = null;
  let carrito = [];

  // Referencias a elementos del DOM
  const tbody = document.getElementById("tbodyProductos");
  const btnCargar = document.getElementById("btnCargar");
  const btnGuardar = document.getElementById("btnGuardar");
  const btnCancelar = document.getElementById("btnCancelar");
  const formTitle = document.getElementById("formTitle");
  const statusDiv = document.getElementById("status");

  const inputNombre = document.getElementById("nombre");
  const inputDescripcion = document.getElementById("descripcion");
  const inputPrecio = document.getElementById("precio");
  const inputStock = document.getElementById("stock");

  const accessView = document.getElementById("accessView");
  const accessStatus = document.getElementById("accessStatus");
  const appView = document.getElementById("appView");

  const btnIniciarSesionAdmin = document.getElementById("btnIniciarSesionAdmin");
  const btnIniciarSesionCliente = document.getElementById("btnIniciarSesionCliente");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  const sessionIdentity = document.getElementById("sessionIdentity");
  const clientView = document.getElementById("clientView");
  const tbodyCatalogo = document.getElementById("tbodyCatalogo");
  const tbodyPedidos = document.getElementById("tbodyPedidos");
  const clienteStatus = document.getElementById("clienteStatus");

  // Carrito avanzado
  const cartWidget = document.getElementById("cartWidget");
  const btnCarrito = document.getElementById("btnCarrito");
  const cartPanel = document.getElementById("cartPanel");
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartTotal = document.getElementById("cartTotal");
  const cartToast = document.getElementById("cartToast");
  const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");
  const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
  // Inicializar autenticación
  async function iniciarAplicacion() {
    try {
      await authService.inicializarAutenticacion();
      accessStatus.textContent = "Sesión inicializada correctamente.";
      cargarProductos();
      cargarCatalogo();
    } catch (err) {
      accessStatus.textContent = "Error al inicializar sesión.";
      console.error("No se pudo inicializar la autenticación:", err);
    }
  }

  // Login administrador
  btnIniciarSesionAdmin.addEventListener("click", async () => {
    btnIniciarSesionAdmin.disabled = true;
    try {
      await authService.iniciarSesion("admin");
      sessionIdentity.textContent = "Administrador conectado";
      accessView.style.display = "none";
      appView.style.display = "block";
      cargarProductos();
    } catch (err) {
      console.error("Error login admin:", err);
    } finally {
      btnIniciarSesionAdmin.disabled = false;
    }
  });

  // Login cliente
  btnIniciarSesionCliente.addEventListener("click", async () => {
    btnIniciarSesionCliente.disabled = true;
    try {
      await authService.iniciarSesion("cliente");
      sessionIdentity.textContent = "Cliente conectado";
      accessView.style.display = "none";
      clientView.style.display = "block";
      cargarCatalogo();
      cargarPedidos();
    } catch (err) {
      console.error("Error login cliente:", err);
    } finally {
      btnIniciarSesionCliente.disabled = false;
    }
  });

  // Cerrar sesión
  btnCerrarSesion.addEventListener("click", async () => {
    try {
      await authService.cerrarSesion();
      accessView.style.display = "block";
      appView.style.display = "none";
      clientView.style.display = "none";
      sessionIdentity.textContent = "";
      accessStatus.textContent = "Sesión cerrada.";
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  });
  // Cargar productos desde la API
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

  // Renderizar productos en la tabla de administración
  function renderProductos(productos) {
    tbody.innerHTML = "";
    productos.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.descripcion}</td>
        <td>${p.precio}</td>
        <td>${p.stock}</td>
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
      const response = await fetch(`${PRODUCTOS_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const producto = await response.json();
      inputNombre.value = producto.nombre;
      inputDescripcion.value = producto.descripcion;
      inputPrecio.value = producto.precio;
      inputStock.value = producto.stock;
      formTitle.textContent = "Editar producto";
    } catch (err) {
      console.error("Error al editar producto:", err);
    }
  };

  // Eliminar producto
  window.eliminarProducto = async function (id) {
    try {
      const token = await authService.obtenerTokenDeAcceso();
      await fetch(`${PRODUCTOS_API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  // Guardar producto (crear o actualizar)
  btnGuardar.addEventListener("click", async () => {
    const producto = {
      nombre: inputNombre.value,
      descripcion: inputDescripcion.value,
      precio: inputPrecio.value,
      stock: inputStock.value,
    };

    try {
      const token = await authService.obtenerTokenDeAcceso();
      if (editandoId) {
        await fetch(`${PRODUCTOS_API}/${editandoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(producto),
        });
        editandoId = null;
      } else {
        await fetch(PRODUCTOS_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(producto),
        });
      }
      formTitle.textContent = "Nuevo producto";
      inputNombre.value = "";
      inputDescripcion.value = "";
      inputPrecio.value = "";
      inputStock.value = "";
      cargarProductos();
    } catch (err) {
      console.error("Error al guardar producto:", err);
    }
  });

  // Cancelar edición
  btnCancelar.addEventListener("click", () => {
    editandoId = null;
    formTitle.textContent = "Nuevo producto";
    inputNombre.value = "";
    inputDescripcion.value = "";
    inputPrecio.value = "";
    inputStock.value = "";
  });

  // Botón para recargar productos
  btnCargar.addEventListener("click", () => {
    cargarProductos();
  });
  // Cargar catálogo de productos para el cliente
  async function cargarCatalogo() {
    try {
      const response = await fetch(PRODUCTOS_API);
      const productos = await response.json();
      renderCatalogo(productos);
    } catch (err) {
      console.error("Error al cargar catálogo:", err);
    }
  }

  // Renderizar catálogo en la vista cliente
  function renderCatalogo(productos) {
    tbodyCatalogo.innerHTML = "";
    productos.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.descripcion}</td>
        <td>${p.precio}</td>
        <td>${p.stock}</td>
        <td><button onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${p.precio})">Agregar</button></td>
      `;
      tbodyCatalogo.appendChild(tr);
    });
  }

  // Agregar producto al carrito
  window.agregarAlCarrito = function (id, nombre, precio) {
    carrito.push({ id, nombre, precio });
    renderCarrito();
  };

  // Renderizar carrito básico
  function renderCarrito() {
    cartWidget.innerHTML = "";
    let total = 0;
    carrito.forEach((item, index) => {
      total += item.precio;
      const div = document.createElement("div");
      div.textContent = `${item.nombre} - $${item.precio}`;
      const btn = document.createElement("button");
      btn.textContent = "Quitar";
      btn.onclick = () => {
        carrito.splice(index, 1);
        renderCarrito();
      };
      div.appendChild(btn);
      cartWidget.appendChild(div);
    });

    const totalDiv = document.createElement("div");
    totalDiv.textContent = `Total: $${total}`;
    cartWidget.appendChild(totalDiv);

    const confirmarBtn = document.createElement("button");
    confirmarBtn.textContent = "Confirmar pedido";
    confirmarBtn.onclick = confirmarPedido;
    cartWidget.appendChild(confirmarBtn);

    const vaciarBtn = document.createElement("button");
    vaciarBtn.textContent = "Vaciar carrito";
    vaciarBtn.onclick = () => {
      carrito = [];
      renderCarrito();
    };
    cartWidget.appendChild(vaciarBtn);
  }
  // Mostrar/ocultar panel del carrito
  btnCarrito.addEventListener("click", () => {
    if (cartPanel.style.display === "block") {
      cartPanel.style.display = "none";
    } else {
      cartPanel.style.display = "block";
      renderCarritoPanel();
    }
  });

  // Renderizar carrito avanzado en el panel
  function renderCarritoPanel() {
    cartItems.innerHTML = "";
    cartCount.textContent = carrito.length;

    if (carrito.length === 0) {
      cartEmpty.style.display = "block";
      cartTotal.textContent = "$0";
      return;
    }

    cartEmpty.style.display = "none";
    let total = 0;

    carrito.forEach((item, index) => {
      total += item.precio;
      const li = document.createElement("li");
      li.textContent = `${item.nombre} - $${item.precio}`;
      const btn = document.createElement("button");
      btn.textContent = "Quitar";
      btn.onclick = () => {
        carrito.splice(index, 1);
        renderCarritoPanel();
        mostrarToast(`${item.nombre} eliminado del carrito`);
      };
      li.appendChild(btn);
      cartItems.appendChild(li);
    });

    cartTotal.textContent = `$${total}`;
  }

  // Toast de notificación
  function mostrarToast(mensaje) {
    cartToast.textContent = mensaje;
    cartToast.style.display = "block";
    setTimeout(() => {
      cartToast.style.display = "none";
    }, 2000);
  }

  // Confirmar compra desde el panel
  btnConfirmarCompra.addEventListener("click", async () => {
    if (carrito.length === 0) {
      clienteStatus.textContent = "El carrito está vacío.";
      return;
    }

    const pedido = {
      productos: carrito.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
      })),
      total: carrito.reduce((sum, item) => sum + item.precio, 0),
    };

    try {
      const token = await authService.obtenerTokenDeAcceso();
      await fetch(PEDIDOS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pedido),
      });
      carrito = [];
      renderCarritoPanel();
      clienteStatus.textContent = "Compra confirmada correctamente.";
      cargarPedidos();
    } catch (err) {
      console.error("Error al confirmar compra:", err);
      clienteStatus.textContent = "Error al confirmar compra.";
    }
  });

  // Vaciar carrito desde el panel
  btnVaciarCarrito.addEventListener("click", () => {
    carrito = [];
    renderCarritoPanel();
    mostrarToast("Carrito vaciado");
  });

  // Cargar pedidos del cliente
  async function cargarPedidos() {
    try {
      const token = await authService.obtenerTokenDeAcceso();
      const response = await fetch(PEDIDOS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pedidos = await response.json();
      renderPedidos(pedidos);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
    }
  }

  function renderPedidos(pedidos) {
    tbodyPedidos.innerHTML = "";
    pedidos.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.fecha}</td>
        <td>${p.estado}</td>
        <td>${p.total}</td>
      `;
      tbodyPedidos.appendChild(tr);
    });
  }

  // Health check del backend
  async function verificarHealth() {
    try {
      const response = await fetch(HEALTH_API);
      const estado = await response.json();
      statusDiv.textContent = `Estado backend: ${estado.status}`;
    } catch (err) {
      console.error("Error al verificar health:", err);
    }
  }

  // Iniciar la aplicación
  iniciarAplicacion();
  verificarHealth();
});
