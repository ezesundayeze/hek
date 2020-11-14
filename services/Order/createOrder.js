const { Order, User, Product, Coupon } = require("../../models");
const response = require("../../utils/apiResponse");
const { initializePayment } = require("../Payment/paystack");

const createOrder = async (verifiedToken, req, res, next) => {
  try {
    const payload = req.body;
    // get customer email and confirm that user exists
    const user = await User.findOne({ _id: verifiedToken._id });
    if (!user) {
      return res.status(404).json(response.error("User does not exist", 404));
    }

    //confirm product exist
    await Promise.all(
      payload.products.map(async (product) => {
        let p = await Product.findById(product.id);
        if (!p) {
          return res
            .status(422)
            .json(response.error("One or more products does not exist"));
        }
      })
    );

    //
    let amount = 0;
    await Promise.all(
      payload.products.map(async (product) => {
        let p = await Product.findById(product.id);
        if (product.quantity > p.quantity) {
          return res
            .status(422)
            .json(response.error("Quantity requested is not available!"));
        }
        // check for discount
        const coupon = await Coupon.findOne({
          code: payload.coupon,
          status: "active",
        });
        if (coupon) {
          amount += (Number(p.price) - Number(coupon.value)) * product.quantity;
        }
        amount += Number(p.price) * product.quantity;
      })
    );

    //create a new order
    payload.customer = verifiedToken._id;

    const order = new Order(payload);

    // initiate payment
    const initPayment = await initializePayment({
      email: user.email,
      amount: amount,
      reference: order._id,
    });

    // add payment link to the order
    order.paymentURL = initPayment.authorization_url;

    //  save order
    await order.save();

    return res.status(201).json(response.success("OK", order, 201));
  } catch (error) {
    next(error.message);
  }
};

module.exports = createOrder;
