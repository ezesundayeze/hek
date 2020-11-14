const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function couponSchema() {
  return Schema(
    {
      title: {
        type: String,
        require: true,
      },
      code: { type: String },
      status: { type: String, default: "active" },
      description: {
        type: String,
        default: null,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: null,
      },
      value: { type: String, default: 0 },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
}

module.exports = couponSchema;
