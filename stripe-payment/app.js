require("dotenv").config();
require("express-async-errors");
const path = require("path");
const express = require("express");
const app = express();

// controller
const payment = require("./controllers/stripeController");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
app.set("view engine", "ejs");
app.use(express.json());

app.get("/", function (req, res) {
  res.render("Home.ejs", {
    key: process.env.STRIPE_PUBLIC_KEY,
  });
});
app.post("/payment", payment);
// stripe
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5555;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
