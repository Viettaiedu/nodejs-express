const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultErr = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong please try again",
  };

  if (err.name === "ValidationError") {
    defaultErr.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.code && err.code === 11000) {
    (defaultErr.statusCode = StatusCodes.BAD_REQUEST),
      (defaultErr.message = Object.keys(err.keyValue)
        .map((value) => `${value} is existing`)
        .join(" "));
  }
  if (err.name === "CastError") {
    defaultErr.statusCode = StatusCodes.NOT_FOUND;
    defaultErr.message = `Not found with ${err.path} ${err.value}`;
  }
  res.status(defaultErr.statusCode).json({ message: defaultErr.message });
};

module.exports = errorHandlerMiddleware;
