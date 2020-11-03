const { Wallet, User, WithdrawalLog, Transaction } = require("../../models");
const response = require("../../utils/apiResponse");

const withdraw = async (verifiedToken, req, res, next) => {
  try {
    //checks if bank details have been updated
    const { bankName, accountName, accountNumber } = await User.findById({
      _id: verifiedToken._id,
    });
    if (bankName == null || accountName == null || accountNumber == null) {
      return res
        .status(401)
        .json(
          response.error(
            "Sorry you need to update you account details in your profile",
            401
          )
        );
    }
    const { amount } = req.body;
    const userWallet = await Wallet.findOne({ user: verifiedToken._id });
    let balance = userWallet.balance;

    // check for open transactions
    const transactions = await Transaction.find({
      status: { $ne: "complete" },
      paid: true,
    }).or([{ merchant: verifiedToken._id }, { buyer: verifiedToken._id }]);

    let transactionAmount = 0;

    // Get the total amount for the open transactions
    transactions.map((transaction) => {
      transactionAmount += transaction.terms.totalAmount;
    });

    // get funds availabe for withdrawal
    let availableForWithdrawal = balance - transactionAmount;

    // Return an error if the funds avaialable for withdrawal is less than the request amount
    if (!(availableForWithdrawal >= amount)) {
      return res
        .status(401)
        .json(
          response.error(
            `Sorry you cannot withdraw this amount your available balance for withdrawal is ${availableForWithdrawal}`,
            401
          )
        );
    }

    if (balance < amount) {
      return res
        .status(401)
        .json(
          response.error(
            `Sorry you cannot withdraw this amount your available balance for withdrawal is ${userWallet.balance}`,
            401
          )
        );
    }

    balance = balance - amount;
    userWallet.balance = balance;
    const wallet = await userWallet.save();
    //creating withdrawal log for audit
    if (wallet) {
      const payload = {
        user: verifiedToken._id,
        amount,
        status: "pending",
        bankDetails: {
          bankName,
          accountName,
          accountNumber,
        },
      };
      const log = new WithdrawalLog(payload);
      await log.save();
    }
    res
      .status(200)
      .json(
        response.success("please wait while we process your payment", null, 200)
      );
  } catch (error) {
    next(error);
  }
};

const findAllWithdrawals = async (verifiedToken, req, res, next) => {
  try {
    const withdrawals = await WithdrawalLog.find({ user: verifiedToken._id });
    if (withdrawals.length < 1) {
      return res.status(404).json(response.error(` No transaction found`, 404));
    }
    return res.status(200).json(response.success("OK", withdrawals, 200));
  } catch (error) {
    next(error.message);
  }
};
module.exports = {
  withdraw,
  findAllWithdrawals,
};
