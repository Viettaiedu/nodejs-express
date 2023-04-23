const notFoundMiddleware = (req, res) =>
  res.status(404).json({ message: "Path is not exsting" });

module.exports = notFoundMiddleware;
