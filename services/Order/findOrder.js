const response = require("../../utils/apiResponse");
const { Order } = require("../../models");

const findOneOrder = async (verifiedToken, req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, customer: verifiedToken._id });
    if (!order) {
      return res.status(404).json(response.error("Order not found", 404));
    }
    return res.status(200).json(response.success("Ok", order, 200));
  } catch (error) {
    next(error.message);
  }
};

module.exports = findOneOrder;
