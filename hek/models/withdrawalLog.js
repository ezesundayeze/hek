const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function withdrawalLog() {
  return Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      amount: { type: String, required: true },
      status: {
        type: String,
        default: "pending",
        enum: ["pending", "completed"],
      },
      bankDetails: {
        bankName: { type: String, default: null },
        accountName: { type: String, default: null },
        accountNumber: { type: String, default: null },
      },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "created_at" } }
  );
}

module.exports = withdrawalLog;
