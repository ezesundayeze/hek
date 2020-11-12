const axios = require("axios");
const { paystack } = require("../../utils/config");
const { Wallet, Transaction, Invoice, Order } = require("../../models");
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
    const verifyPayment = axios
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

          //   Set the transaction to paid:
          const transaction = await Transaction.findById({
            _id: ObjectId(result.data.data.reference),
          });

          if (transaction && !transaction.paid) {
            //   Creit User wallet
            const wallet = await Wallet.findOne({ user: user._id });
            const amount = wallet.balance + result.data.data.amount;
            wallet.balance = amount;

            const newWallet = await wallet.save();

            //   Set transaction to paid
            transaction.paid = true;
            const newTransaction = await transaction.save();

            // create a receipt for this payment
            const invoice = new Invoice({
              merchant: transaction.merchant,
              buyer: transaction.buyer,
              transactionId: result.data.data.reference,
              date: new Date(),
              status: (() => {
                if (
                  Number(result.data.data.amount) ==
                  Number(transaction.terms.totalAmount)
                ) {
                  return "paid";
                }

                if (
                  Number(transaction.terms.totalAmount) >
                  Number(result.data.data.amount)
                ) {
                  return "part";
                }
              })(),
              amountPaid: Number(result.data.data.amount),
              balance:
                Number(transaction.terms.totalAmount) -
                Number(result.data.data.amount),
              reason: transaction.terms.title,
              total: Number(transaction.terms.totalAmount),
            });

            // Send Email of Transaction
            const merchant = await User.findById({
              _id: newTransaction.merchant,
            });
            const buyer = await User.findById({
              _id: newTransaction.buyer,
            });

            await sendEmail(
              merchant.email,
              "GuardedPay: Payment Received",
              {
                name: merchant.firstName,
                merchant: transaction.merchant,
                buyer: transaction.buyer,
                amount: transaction.terms.totalAmount,
                title: transaction.terms.title,
                description: transaction.terms.description,
              },
              "./templates/email/invoice.ejs"
            );
            await sendEmail(
              buyer.email,
              "GuardedPay: Payment Received",
              {
                name: buyer.firstName,
                merchant: transaction.merchant,
                buyer: transaction.buyer,
                amount: transaction.terms.totalAmount,
                title: transaction.terms.title,
                description: transaction.terms.description,
              },
              "./templates/email/invoice.ejs"
            );

            const newInvoice = await invoice.save();

            return res
              .status(200)
              .json(response.success("OK", { invoice: newInvoice }, 200));
          }

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
