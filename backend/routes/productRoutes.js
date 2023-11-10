const express = require("express");
const productsController = require("../controllers/product-controller");
const { getAllProducts, getProductsByType, getProductById } =
  productsController;

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:type", getProductsByType);

router.get("/:type/:id", getProductById);

module.exports = router;
