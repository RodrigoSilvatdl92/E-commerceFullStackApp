const HttpError = require("../models/http-error");
const User = require("../models/user");
const Cart = require("../models/cart");
const cloudinary = require("../cloudinaryConfig");

//////////////////// USER CREATE USER

const createUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const image = req.file;

  console.log(image.path, username, email, password);

  if (!image || !username || !email || !password) {
    const error = new HttpError("Please fill all the fields", 400);
    return next(error);
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists, please login instead",
      422
    );
    return next(error);
  }

  let imageCloudinaryUrl;
  const publicId = `picturesOfUsers/${username}/image`;
  try {
    const result = await cloudinary.uploader.upload(`${image.path}`, {
      public_id: publicId,
    });
    console.log(result);
    imageCloudinaryUrl = result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    const error = new HttpError("Image upload to Cloudinary failed fds", 500);
    return next(error);
  }

  const createdUser = new User({
    username,
    email,
    password,
    image: imageCloudinaryUrl,
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Creating user failed, please try again", 500);
    return next(error);
  }

  res.status(200).json({ user: createdUser.toObject({ getters: true }) });
};

//////////////////// USER LOG IN

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new HttpError("Please fill all the fields", 400);
    return next(error);
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Log in failed, please try again later", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      401
    );
    return next(error);
  }

  res.status(200).json("User Logged sucessfully");
};

exports.createUser = createUser;
exports.userLogin = userLogin;
