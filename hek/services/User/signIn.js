const { User } = require("../../models");
const response = require("../../utils/apiResponse");
const { secret } = require("../../utils/config");
const { genToken, decryptPassword } = require("../../utils/helper");

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user != null) {
      const pass = await decryptPassword(password, user.password);
      if (!pass) {
        return res
          .status(422)
          .json(response.error("Invalid username or password", 422));
      }

      const token = await genToken(user._id, user.role);
      const payload = { ...user._doc };
      delete payload.password;

      return res
        .status(200)
        .json(response.success(null, { token, ...payload }, 200));
    }
  } catch (error) {
    next(error);
  }
};

const socialSignIn = async (req, res, next) => {};

const verifyUser = async (verifiedToken, req, res, next) => {
  try {
    return res
      .status(200)
      .json(response.success("Valid User", { isLoggedIn: true }, 200));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signIn,
  socialSignIn,
  verifyUser,
};
