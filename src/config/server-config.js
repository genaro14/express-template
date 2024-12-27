const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  // eslint-disable-next-line no-undef
  PORT: process.env.PORT || 5000,
};
