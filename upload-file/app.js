require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
// security package
const xss = require("xss-clean");
const helmet = require("helmet");
const cors = require("cors");
// middleware
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
//routes

const routerUploads = require('./routes/upload')
// database
const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errHandlerMiddleware = require("./middleware/handler-err");
// middleware parser
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
// middleware security
app.use(cors());
app.use(xss());
app.use(helmet());

// app.get("/", (req, res) => {
//   res.send("<h1>File Upload Starter</h1>");
// });

app.use('/api/v1/uploads' , routerUploads);

// middlware error handler
app.use(notFoundMiddleware);
app.use(errHandlerMiddleware);
// // middleware

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
