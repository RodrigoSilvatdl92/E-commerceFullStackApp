const mongoose = require("mongoose");

const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  products: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      productId: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
