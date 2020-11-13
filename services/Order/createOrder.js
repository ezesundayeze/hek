const { Order, User, Product } = require("../../models");
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

    //create a new order
    payload.customer = verifiedToken._id;
    const order = new Order(payload);

    // get order amount
    let amount = 0;
    await Promise.all(
      payload.products.map(async (product) => {
        let p = await Product.findById(product.id);
        if (product.quantity > p.quantity) {
          return res
            .status(422)
            .json(response.error(" Quantity requested is not available!"));
        }
        amount += Number(p.price) * product.quantity;
      })
    );

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
    console.log(error);
    next(error.message);
  }
};

module.exports = createOrder;
