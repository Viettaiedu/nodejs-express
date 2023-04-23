const { StatusCodes } = require("http-status-codes");
const CustomErrAPI = require("./custom-err");
class Unauthentication extends CustomErrAPI {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = Unauthentication;
