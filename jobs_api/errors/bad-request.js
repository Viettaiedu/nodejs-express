const CustomErrAPI  = require("./custom-error");
const { StatusCodes } = require("http-status-codes");
class BadRequestError extends CustomErrAPI {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
