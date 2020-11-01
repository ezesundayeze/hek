const { User } = require("../../models");
const response = require("../../utils/apiResponse");

const updateUser = async (verifiedToken, req, res, next) => {
  try {
    const payload = req.body;
    delete payload.password;
    const user = await User.findOneAndUpdate(
      { _id: verifiedToken._id },
      { $set: payload },
      { new: true }
    );

    res.status(200).json(response.success("User updated successfully", null, 200));
  } catch (error) {
    next(error);
  }
};

module.exports = { updateUser };
