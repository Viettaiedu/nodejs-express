require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
// middleware
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// security packages
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');

//  routers
const routerAuth = require("./routes/auth");
const routerJobs = require("./routes/jobs");
// connect db
const connectDB = require("./db/connect");
const notFound = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuth = require("./middlewares/auth");

//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// security packages
app.use(helmet())
app.use(cors());
app.use(xss())

// Routes
app.use("/api/v1/auth", routerAuth);
app.use("/api/v1/jobs",checkAuth, routerJobs);

// middleware handlers
app.use(notFound);
app.use(errorHandlerMiddleware);

// connect server
const PORT = process.env.PORT || 5555;
const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log("server listening on port :", PORT));
  } catch (error) {
    console.log(error);
  }
};
start();
