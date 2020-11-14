const { Product, Order } = require("../../models");
const response = require("../../utils/apiResponse");

const addReview = async (verifiedToken, req, res, next) => {
  try {
    const { productId } = req.params;
    const { comment, orderId, rate } = req.body;
    const product = await Product.findById({ _id: productId });
    const order = await Order.findById({
      _id: orderId,
      customer: verifiedToken._id,
      status: "paid",
    });
    if (!product && !order) {
      return res
        .status(422)
        .json(response.error("You can only review items you purchased"));
    }
    if (comment) {
      product.reviews.push({ comment, userId: verifiedToken._id });
    }

    if (rate && rate <= 5) {
      product.rating.push(rate);
    }

    const newProduct = await product.save();

    return res
      .status(200)
      .json(
        response.success(
          "OK",
          { reviews: newProduct.reviews, ratings: newProduct.rating },
          200
        )
      );
  } catch (error) {
    next(error.message);
  }
};

module.exports = addReview;
