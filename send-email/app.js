require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const sendEmail = require("./controllers/sendEmail");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

// routes
app.get("/send-email", sendEmail);
app.get("/", (req, res) => {
  res.send("Home");
});

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
