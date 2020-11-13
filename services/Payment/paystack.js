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

          console.log(order);
          let total = 0;
          let subtotal = 0;

          const products = await Promise.all(
            order.products.map(async (product) => {
              let productOne = await Product.findById({ _id: product.id });

              // update product quantity
              productOne.quantity =
                Number(productOne.quantity) - Number(product.quantity);
              await productOne.save();

              subtotal += Number(productOne.price) * product.quantity;
              return {
                product: productOne,
                quantity: product.quantity,
              };
            })
          );

          // total includes fees
          //assuming delivery is 500 naira
          let delivery = 500;
          total = subtotal + delivery;

          if (!order) {
            return res
              .status(404)
              .json(response.error("Order does not exist", 404));
          }

          //set order to paid
          order.status = "paid";

          await order.save();

          console.log(products);

          // send email with order details

          sendEmail(
            user.email,
            "HEK:Payment",
            {
              name: user.firstName,
              products: products,
              subtotal: subtotal,
              total: total,
            },
            "../templates/email/order.handlebars"
          );

          return res.status(200).json(response.success("OK", null, 200));
        }
      })
      .catch((error) => {
        console.log(error.message);
        next(error);
      });
  } catch (error) {
    console.log(error.message);

    next(error);
  }
};

module.exports = {
  webhook,
  initializePayment,
};
