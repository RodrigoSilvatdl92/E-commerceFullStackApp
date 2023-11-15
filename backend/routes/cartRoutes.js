const express = require("express");
const {
  addProductToCart,
  deleteProductFromCart,
  getAllCartProductsByUser,
} = require("../controllers/cart-controller");

const router = express.Router();

router.post("/addProduct", addProductToCart);

router.delete("/deleteProduct", deleteProductFromCart);

router.get("/getProductsByUser", getAllCartProductsByUser);

module.exports = router;
