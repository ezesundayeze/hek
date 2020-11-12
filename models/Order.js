const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function orderSchema() {
  return Schema(
    {
      products: { type: Array },
      status: { type: String, default: "unpaid", enum: ["paid", "unpaid"] },
      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      paymentURL: { type: String, default: null },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
}

module.exports = orderSchema;
