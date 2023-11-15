const HttpError = require("../models/http-error");
const Cart = require("../models/cart");
const User = require("../models/user");
const mongoose = require("mongoose");

////////////// ADD PRODUCT TO CART

const addProductToCart = async (req, res, next) => {
  const { userId, name, image, quantity, price, productId } = req.body;

  // Find the user by their ObjectId
  let existingUser;
  try {
    existingUser = await User.findById(userId);
    if (!existingUser) {
      const error = new HttpError("User not found", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Cannot find the user, please try again later",
      500
    );
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
      (product) => product.productId === productId
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
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(err);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await existingCart.save({ session: sess });
    if (!user.cart) {
      user.cart = existingCart;
      await user.save({ session: sess, validateModifiedOnly: true });
      console.log("saving cart on user");
    }
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Adding product failed, please try again", 500);
    return next(error);
  }
  // Save the cart

  res.status(201).json({ message: "Product added to the cart" });
};

////////////// DELETE PRODUCT FROM CART

const deleteProductFromCart = async (req, res, next) => {
  const { userId, productId } = req.body;

  let cartId;
  try {
    cartId = await Cart.findOne({ userId });
    console.log(cartId);
  } catch (err) {
    const error = new HttpError(
      "Cannot find any user, please try again later",
      500
    );
    return next(error);
  }

  if (!cartId) {
    const error = new HttpError("User not found", 404);
    return next(error);
  }

  const productSelected = cartId.products.find(
    (product) => product.productId === productId
  );

  if (!productSelected) {
    const error = new HttpError(
      "Product not found in the cart. Cannot delete",
      404
    );
    return next(error);
  } else {
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      if (productSelected.quantity > 1) {
        productSelected.quantity -= 1;
      } else {
        await productSelected.deleteOne({ session: sess });
      }

      await cartId.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong, could not delete product.",
        500
      );
      return next(error);
    }
  }

  if (cartId.products.length === 0) {
    const userToHaveCartDeleted = await User.findById(userId);
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await cartId.deleteOne({ session: sess });
      if (userToHaveCartDeleted.cart) {
        userToHaveCartDeleted.cart = null;
      }

      await userToHaveCartDeleted.save();
      await sess.commitTransaction();
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong, could not delete cart.",
        500
      );
      return next(error);
    }
  }

  res.json({ message: "You'r sucefull at deleting the product" });
};

const getAllCartProductsByUser = async (req, res, next) => {
  const { userId } = req.body;

  let cartId;
  try {
    cartId = await Cart.findOne({ userId });
    if (!cartId) {
      const error = new HttpError("Cart not found", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Fetching products of the Cart failed, please try again later",
      500
    );
  }

  const cartProducts = cartId.products;

  res.status(200).json({ cartProducts });
};

exports.addProductToCart = addProductToCart;
exports.deleteProductFromCart = deleteProductFromCart;
exports.getAllCartProductsByUser = getAllCartProductsByUser;
