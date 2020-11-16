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
      discount: { type: Number, default: 0 },
      coupon: { type: String, default: null },
      paymentURL: { type: String, default: null },
      shipping: {
        name: { type: String },
        address: { type: String },
        country: { type: String },
        state: { type: String },
        postalCode: { type: String },
      },
    },

    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
}

module.exports = orderSchema;
