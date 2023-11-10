const HttpError = require("../models/http-error");
const Cart = require("../models/cart");
const User = require("../models/user");
const mongoose = require("mongoose");

const addProductToCart = async (req, res, next) => {
  const { userId, name, image, quantity, price, productId } = req.body;

  try {
    // Find the user by their ObjectId
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      const error = new HttpError("User not found", 404);
      return next(error);
    }

    // Check if the user already has a cart
    let existingCart = await Cart.findOne({ userId: existingUser._id });

    // If the user doesn't have a cart, create a new cart
    if (!existingCart) {
      existingCart = new Cart({
        userId: userId,
        products: [
          {
            name,
            price,
            quantity: (quantity || 1) * 1,
            image,
            productId,
          },
        ],
      });
    } else {
      // Check if the product is already in the cart
      const existingProduct = existingCart.products.find(
        (product) => product.name === name
      );

      // If the product is already in the cart, update its quantity
      if (existingProduct) {
        existingProduct.quantity += (quantity || 1) * 1;
      } else {
        // If the product is not in the cart, add it
        existingCart.products.push({
          name,
          price,
          quantity: quantity || 1,
          image,
          productId,
        });
      }
    }

    let user;

    try {
      user = await User.findById(userId);
    } catch (err) {
      const error = new HttpError(
        "Creating place failed, please try again",
        500
      );
      return next(err);
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await existingCart.save({ session: sess });
      user.cart = existingCart;
      await user.save({ session: sess, validateModifiedOnly: true });
      await sess.commitTransaction();
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Creating Place failed, please try again",
        500
      );
      return next(error);
    }
    // Save the cart

    res.status(201).json({ message: "Product added to the cart" });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      `Something went wrong, please try again later`,
      500
    );
    return next(error);
  }
};

exports.addProductToCart = addProductToCart;
