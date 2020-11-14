const { Coupon, Product } = require("../../models");
const response = require("../../utils/apiResponse");

const createCoupon = async (verifiedToken, req, res, next) => {
  try {
    const { productId } = req.params;
    const payload = req.body;
    const product = await Product.findById({ _id: productId });

    if (!product) {
      return res.status(404).json(response.error("Product not found", 404));
    }

    if (product.price < payload.value) {
      return res
        .status(422)
        .json(
          response.error(
            "coupon price can not be greater than product price",
            422
          )
        );
    }

    const coupon = new Coupon(payload);
    await coupon.save();

    return res.status(201).json(response.success("OK", coupon, 201));
  } catch (error) {
    next(error.message);
  }
};

module.exports = createCoupon;
