require("dotenv").config();
require("express-async-errors");
//import packages
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
// security packages
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
//connectDB
const connectDB = require("./db/connect");


app.use(
  rateLimiter({
    windowMs: 15 * 1000 * 60,
    max: 50,
  })
);
app.use(xss());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
if (process.env.NODE_ENV === "production") {
  app.use(morgan("dev"));
}
app.use(helmet());
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

// routes
const routerAuth = require("./routes/auth");
const routerUser = require("./routes/user");
const routerProduct = require("./routes/product");
const routerReview = require("./routes/review");
const routerOrder = require("./routes/order");
app.use("/api/v1/auth", routerAuth);
app.use("/api/v1/users", routerUser);
app.use("/api/v1/products", routerProduct);
app.use("/api/v1/reviews", routerReview);
app.use("/api/v1/orders", routerOrder);
// error handler
const errorHandlerMiddleware = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

//middleware

app.use(notFound);
app.use(errorHandlerMiddleware);
const PORT = process.env.PORT || 5555;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
