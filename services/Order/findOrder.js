const response = require("../../utils/apiResponse");
const { Order } = require("../../models");

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id });
    return res.status(200).json(response.success("Ok", order, 200));
  } catch (error) {
    next(error.message);
  }
};

module.exports = findOne;
