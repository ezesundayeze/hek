const { Dispute, Transaction, User } = require("../../models");
const response = require("../../utils/apiResponse");
const { sendEmail } = require("../../utils/helper");
const { ObjectId } = require("mongoose").Types;

const createDispute = async (verifyToken, req, res, next) => {
  try {
    const payload = req.body;

    const transaction = await Transaction.findOne({
      _id: ObjectId(payload.transactionId),
    });

    if (!transaction) {
      return res
        .status(404)
        .json(
          response.success(
            "There is no such transaction to open a dispute for",
            404
          )
        );
    }

    payload.buyer = transaction.buyer;
    payload.merchant = transaction.merchant;
    payload.author = verifyToken._id;
    const dispute = new Dispute(payload);
    const newDispute = await dispute.save();

    // Send email to the receiver of the dispute
    let emailToSendTo;
    let user;

    if (transaction.merchant != verifyToken._id) {
      user = await User.findOne({ _id: transaction.merchant });
      emailToSendTo = user.email;
    }
    if (transaction.buyer != verifyToken._id) {
      user = await User.findOne({ _id: transaction.buyer });
      emailToSendTo = user.email;
    }

    if (!user) {
      user = await User.findOne({ _id: verifyToken._id });
    }

    sendEmail(
      emailToSendTo,
      " Dispute Opened",
      {
        name: user.firstName,
        transaction: transaction._id,
        title: transaction.terms.title,
      },
      "./templates/email/createDispute.ejs"
    );
    return res.status(201).json(response.success("Ok", newDispute, 201));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createDispute,
};
