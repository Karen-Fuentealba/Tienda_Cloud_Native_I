const express = require("express");
const { checkJwt, checkRole } = require("../auth");

function createProductRoutes(controller) {
  const router = express.Router();

  // ADMIN y CLIENTE pueden listar productos
  router.get("/", checkJwt, checkRole(["ADMIN", "CLIENTE"]), controller.listProducts);

  // ADMIN y CLIENTE pueden obtener un producto por ID
  router.get("/:id", checkJwt, checkRole(["ADMIN", "CLIENTE"]), controller.getProduct);

  // Solo ADMIN puede crear productos
  router.post("/", checkJwt, checkRole("ADMIN"), controller.createProduct);

  // Solo ADMIN puede actualizar productos
  router.put("/:id", checkJwt, checkRole("ADMIN"), controller.updateProduct);

  // Solo ADMIN puede eliminar productos
  router.delete("/:id", checkJwt, checkRole("ADMIN"), controller.deleteProduct);

  return router;
}

module.exports = { createProductRoutes };
