const { catchAllAsyncErrors } = require("./catchAllAsyncErrors");
const { verifyToken } = require("./verifyToken");
const { checkRole } = require("./role");

module.exports = {
  catchAllAsyncErrors,
  verifyToken,
  checkRole,
};
