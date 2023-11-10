const express = require("express");
const userController = require("../controllers/user-controller");
const { userLogin, createUser } = userController;
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/login", userLogin);

router.post("/signup", fileUpload.single("image"), createUser);

module.exports = router;
