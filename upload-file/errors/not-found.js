const { StatusCodes } = require("http-status-codes");
const CustomErrAPI = require("./custom-err");
class NotFound extends CustomErrAPI {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFound;
