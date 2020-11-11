const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function orderSchema() {
  return Schema(
    {
      products: { type: Array },
      store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        default: null,
      },

      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
}

module.exports = orderSchema;
