const { StatusCodes } = require("http-status-codes");

const health = (req, res) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "API Health is OK. Running Express Starter",
    error: {},
    data: {},
  });
};

module.exports = {
  health,
};
