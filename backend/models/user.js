const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  cart: { type: mongoose.Types.ObjectId, ref: "Cart" },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
