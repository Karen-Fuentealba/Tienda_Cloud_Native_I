/*const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { createProductController } = require("./controllers/productController");
const { createOrderController } = require("./controllers/orderController");
const { createProductRoutes } = require("./routes/products");
const { createOrderRoutes } = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3001;

/*const {
  DB_HOST = "db",
  DB_USER = "alumno",
  DB_PASSWORD = "alumno123",
  DB_NAME = "tienda_perritos",
  DB_PORT = 3306,
} = process.env; 

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} = process.env;

const DB_HOST = MYSQL_HOST;
const DB_USER = MYSQL_USER;
const DB_PASSWORD = MYSQL_PASSWORD;
const DB_NAME = MYSQL_DATABASE;
const DB_PORT = MYSQL_PORT;

app.use(cors());
app.use(express.json());

let pool;

async function initDb() {
  try {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Pool de conexiones MySQL inicializado.");
  } catch (err) {
    console.error("Error al inicializar pool de MySQL:", err);
  }
}

async function registerRoutes() {
  await initDb();
  const productController = createProductController(pool);
  const orderController = createOrderController(pool);
  app.use("/api/productos", createProductRoutes(productController));
  app.use("/api/pedidos", createOrderRoutes(orderController));
}

// Endpoint de salud
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend de tienda de perritos en ejecución." });
});

// Iniciar servidor
async function start() {
  await registerRoutes();
  app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
  });
}

start().catch((error) => {
  console.error("No se pudo iniciar el backend:", error);
  process.exit(1);
});

***************************************************/
/*
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { createProductController } = require("./controllers/productController");
const { createOrderController } = require("./controllers/orderController");
const { createProductRoutes } = require("./routes/products");
const { createOrderRoutes } = require("./routes/orders");
const { checkJwt, checkRole } = require("./auth"); // Importar middlewares

const app = express();
const PORT = process.env.PORT || 3001;

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} = process.env;

const DB_HOST = MYSQL_HOST;
const DB_USER = MYSQL_USER;
const DB_PASSWORD = MYSQL_PASSWORD;
const DB_NAME = MYSQL_DATABASE;
const DB_PORT = MYSQL_PORT;

app.use(cors());
app.use(express.json());

let pool;

async function initDb() {
  try {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Pool de conexiones MySQL inicializado.");
  } catch (err) {
    console.error("Error al inicializar pool de MySQL:", err);
  }
}
async function registerRoutes() {
  await initDb();
  const productController = createProductController(pool);
  const orderController = createOrderController(pool);

  // Rutas protegidas con JWT
  app.use("/api/productos", checkJwt, createProductRoutes(productController));
  app.use("/api/pedidos", checkJwt, createOrderRoutes(orderController));

  // Ejemplo de protección por rol
  app.post("/api/productos", checkJwt, checkRole("ADMIN"), productController.create);
  app.post("/api/pedidos", checkJwt, checkRole("CLIENTE"), orderController.create);
}

// Endpoint de salud (sin protección)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend de tienda de perritos en ejecución." });
});

// Iniciar servidor
async function start() {
  await registerRoutes();
  app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en puerto ${PORT}`);
  });
}

start().catch((error) => {
  console.error("No se pudo iniciar el backend:", error);
  process.exit(1);
});
************************************************************/
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { createProductController } = require("./controllers/productController");
const { createOrderController } = require("./controllers/orderController");
const { createProductRoutes } = require("./routes/products");
const { createOrderRoutes } = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3001;

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} = process.env;

app.use(cors());
app.use(express.json());

let pool;

async function start() {
  try {
    pool = await mysql.createPool({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      port: MYSQL_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Pool de conexiones MySQL inicializado.");

    const productController = createProductController(pool);
    const orderController = createOrderController(pool);

    // Rutas (la seguridad se aplica dentro de products.js y orders.js)
    app.use("/api/productos", createProductRoutes(productController));
    app.use("/api/pedidos", createOrderRoutes(orderController));

    // Endpoint de salud
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", message: "Backend de tienda de perritos en ejecución." });
    });

    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el backend:", error);
    process.exit(1);
  }
}

start();


