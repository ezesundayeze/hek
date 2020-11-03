const mongoose = require("mongoose");

const Schema = mongoose.Schema;

function invoiceSchema() {
  return Schema(
    {
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
      order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Order",
      },
      date: { type: String, required: true },
      status: {
        type: String,
        enum: ["paid","unpaid"],
        default: "unpaid",
      },
      amountPaid: { type: Number, required: true },
      balance: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
}

module.exports = invoiceSchema;
