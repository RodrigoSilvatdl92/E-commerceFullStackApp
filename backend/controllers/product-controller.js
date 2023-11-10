const HttpError = require("../models/http-error");
const products = require("../products.json");

const getAllProducts = (req, res, next) => {
  try {
    if (!products) {
      const error = new HttpError("Products not found", 404);
      throw error;
    }

    res.json({ products });
  } catch (error) {
    return next(error);
  }
};

const getProductsByType = (req, res, next) => {
  const type = req.params.type;

  const listOfProducts = products.filter((item) => item.type === type);

  try {
    if (!listOfProducts) {
      const error = new HttpError("Products not found", 404);
      throw error;
    }

    res.json({ listOfProducts });
  } catch (error) {
    return next(error);
  }
};

const getProductById = (req, res, next) => {
  const id = req.params.id;

  const product = products.find((item) => item.id === id);
  try {
    if (!product) {
      const error = new HttpError("Product not found", 404);
      throw new error();
    }

    res.json({ product });
  } catch (error) {
    return next(error);
  }
};

exports.getAllProducts = getAllProducts;
exports.getProductsByType = getProductsByType;
exports.getProductById = getProductById;
