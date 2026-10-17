/*
const express = require("express");
const { checkJwt, checkRole } = require("../auth");

function createOrderRoutes(controller) {
  const router = express.Router();

  router.post("/", checkJwt, checkRole("CLIENTE"), controller.createOrder);
  router.get("/", checkJwt, checkRole(["ADMIN", "CLIENTE"]), controller.listOrders);

  return router;
}

module.exports = { createOrderRoutes }; 
************************************************/

const express = require("express");
const { checkJwt, checkRole } = require("../auth");

function createOrderRoutes(controller) {
  const router = express.Router();

  // Solo CLIENTE puede crear pedidos
  router.post("/", checkJwt, checkRole("CLIENTE"), controller.createOrder);

  // ADMIN y CLIENTE pueden listar pedidos
  router.get("/", checkJwt, checkRole(["ADMIN", "CLIENTE"]), controller.listOrders);

  return router;
}

module.exports = { createOrderRoutes };

