const {StatusCodes} = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  // Default Error handler
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong please try again",
  };
  // Bad request
  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
  }
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.message = Object.keys(err.keyValue).map(
      (value) => `${value} is existing`
    ).join(' ');
  }

  // Not found
  if(err.name === 'CastError') {
    defaultError.statusCode = StatusCodes.NOT_FOUND;
    defaultError.message = `Not found with ${err.path} ${err.value}`
  }

  return res
    .status(defaultError.statusCode)
    .json({ message: defaultError.message });
};

module.exports = errorHandlerMiddleware;
