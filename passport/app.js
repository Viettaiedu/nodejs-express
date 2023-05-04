require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");
const cookieSession = require('cookie-session');
const routerAuth = require("./routes/auth");
const passport = require("passport");
require('./config/passport-goggle')
app.use(express.json());
// extra packages

// routes
app.set("view engine", "ejs");
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['12121dd']
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", routerAuth);

app.get("/", (req, res) => {
  res.render("Home");
});
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
