const { User } = require("../../models");
const response = require("../../utils/apiResponse");

const findOneUser = async (verifiedToken, req, res, next) => {
    try {
      const user = await User.findById({ _id: verifiedToken._id })
      if (!user) {
        return res.status(404).json(response.error("User Not Found", 404));
      }
      delete user.password;
      return res.status(200).json(response.success("OK", user, 200));
    } catch (error) {
        console.log(error.message)
      next(error.message);
    }
  };

  module.exports = findOneUser;