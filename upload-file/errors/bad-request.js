const { StatusCodes } = require("http-status-codes");
const CustomErrAPI = require("./custom-err");
class BadRequest extends CustomErrAPI {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;
