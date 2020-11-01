const mongoose = require("mongoose");

const Schema = mongoose.Schema;

function disputeSchema() {
  return Schema({
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String },
    complain: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    transactionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ["resolved", "closed", "open"],
      default: "open",
    },
  });
}

module.exports = disputeSchema;
