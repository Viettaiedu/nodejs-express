const CustomErrAPI = require("./custom-error");
const { StatusCodes } = require("http-status-codes");
class UnauthenrizationError extends CustomErrAPI {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenrizationError;
