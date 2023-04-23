class CustomErrAPI extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = CustomErrAPI;
