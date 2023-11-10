const express = require("express");
const {
  addProductToCart,
} = require("../controllers/addProductToCart-controller");

const router = express.Router();

router.post("/product", addProductToCart);

module.exports = router;
