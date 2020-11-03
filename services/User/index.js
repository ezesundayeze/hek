const { signIn } = require("./signIn");
const { signUp } = require("./signUp");
const { updateUser } = require("./updateUser");
const {
  resetPasswordRequest,
  newPassword,
  verifyPasswordToken,
} = require("./forgotPassword");
module.exports = {
  signIn,
  signUp,
  updateUser,
  resetPasswordRequest,
  newPassword,
  verifyPasswordToken,
};
