const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/usersRoutes");
const addProductToCart = require("./routes/addToCartRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/products", productRoutes);

app.use("/users", userRoutes);

app.use("/addToCart", addProductToCart);

app.use((error, req, res, next) => {
  if (req.file)
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });

  if (res.headerSent) {
    //checkar se alguma resposta ja foi enviada
    return next(error); // só podemos enviar uma resposta, portanto se já foi enviada basicamente saimos da funçao e nao continuamos para baixo
  }
  // se chegarmos aqui e a condição em cima nao for verdadeira, então enviamos o erro para o cliente

  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

module.exports = app;
