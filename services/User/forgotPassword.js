const response = require("../../utils/apiResponse");
const { User } = require("../../models");
const { encryptPassword } = require("../../utils/helper");
const passwordVerificationCode = require("../../utils/randomCodeGen");
const sendEmail = require("../../utils/emailer");

module.exports = {
  resetPasswordRequest: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json(response.error("User does not exist", 404));
      }
      const payload = {
        verificationToken: {
          token: passwordVerificationCode(),
          expiryDate: Date.now(),
        },
      };

      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          $set: payload,
        },
        { new: true }
      );
      sendEmail(
        email,
        "GuardedPay: Reset Password Token",
        {
          name: user.firstName,
          passwordToken: updatedUser.verificationToken.token,
        },
        "./templates/email/resetPasswordToken.handlebars"
      );
      return res.status(200).json(response.success("success", user._id, 200));
    } catch (error) {
      next(error);
    }
  },

  verifyPasswordToken: async (req, res, next) => {
    try {
      const { passwordToken } = req.body;

      const user = await User.findOne({
        "verificationToken.token": passwordToken,
      });

      if (!user) {
        return res.status(403).json(response.error("Invalid Token", 403));
      }

      const currentDate = new Date().getTime();
      const tokenExpiryDate = new Date(
        Number(user.verificationToken.expiryDate)
      ).getTime();
      const diff = currentDate - tokenExpiryDate;
      const seconds = Math.floor((diff / 1000) % 60);
      if (seconds > 300) {
        return res.status(403).json(response.error("expired token", 403));
      }

      return res
        .status(200)
        .json(response.success("success", user.verificationToken, 200));
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  newPassword: async (req, res, next) => {
    try {
      const { passwordToken, password } = req.body;

      const user = await User.findOne({
        "verificationToken.token": passwordToken,
      });

      if (!user) {
        return res.status(403).json(response.error("Invalid Token", 403));
      }

      const currentDate = new Date().getTime();
      const tokenExpiryDate = new Date(
        Number(user.verificationToken.expiryDate)
      ).getTime();
      const diff = currentDate - tokenExpiryDate;
      const seconds = Math.floor((diff / 1000) % 60);
      if (seconds > 300) {
        return res.status(403).json(response.error("expired token", 403));
      }

      if (!user) {
        return res.status(403).json(response.error("Invalid Token", 403));
      }

      const hashedPassword = await encryptPassword(password);
      const updatedUser = await User.findOneAndUpdate(
        { email: user.email },
        { $set: { password: hashedPassword } },
        { new: true }
      );
      updatedUser.verificationToken.token = null;
      await updatedUser.save();

      sendEmail(
        user.email,
        "GuardedPay: New Password",
        {
          name: user.firstName,
        },
        "./templates/email/resetPasswordSuccess.handlebars"
      );
      return res
        .status(200)
        .json(response.success("success", updatedUser._id, 200));
    } catch (error) {
      next(error);
    }
  },
};
