const axios = require("axios");
const { paystack } = require("../../utils/config");
const {
  Wallet,
  Transaction,
  Invoice,
  Order,
  Product,
} = require("../../models");
const response = require("../../utils/apiResponse");
const { User } = require("../../models");
const sendEmail = require("../../utils/emailer");
const { ObjectId } = require("mongoose").Types;

axios.defaults.headers.common = {
  Authorization: `Bearer ${paystack.secretKey}`,
  "Content-Type": "application/json",
};

/**
 *  Initialize Pastack payment
 * @param {*} data - contains, @customer, @email, @amount and @reference
 *
 */
const initializePayment = async (data) => {
  try {
    const init = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      data
    );
    return init.data.data;
  } catch (error) {
    return error;
  }
};

const webhook = async (req, res, next) => {
  try {
    const data = req.body.data;
    const url = `https://api.paystack.co/transaction/verify/${data.reference}`;
    axios
      .get(url)
      .then(async (result) => {
        if (result.data.data.reference != data.reference) {
          return res
            .status(400)
            .json(response.error("Invalid Transaction", 400));
        }

        if (result.data.data.reference == data.reference) {
          const user = await User.findOne({
            email: result.data.data.customer.email,
          });

          // find order

          const order = await Order.findById({
            _id: result.data.data.reference,
          });

          if (!order) {
            return res
              .status(404)
              .json(response.error("Order does not exist", 404));
          }

          //set order to paid
          order.status = "paid";
          await order.save();

          const products = order.products.map(async (productId) => {
            const product = await Product.findById({ _id: productId });
            return product;
          });

          // send email with order details

          sendEmail(
            user.email,
            "HEK:Payment",
            {
              name: user.firstName,
              products: products,
            },
            "../templates/email/order.handlebars"
          );

          return res.status(200).json(response.success("OK", null, 200));
        }
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  webhook,
  initializePayment,
};
