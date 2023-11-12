const express = require("express");
const {
  addProductToCart,
  deleteProductFromCart,
} = require("../controllers/cart-controller");

const router = express.Router();

router.post("/addProduct", addProductToCart);

router.delete("/deleteProduct", deleteProductFromCart);

module.exports = router;
