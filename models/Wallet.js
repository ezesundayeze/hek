const mongoose = require("mongoose");

const Schema = mongoose.Schema;

function walletSchema() {
  return Schema(
    {
      balance: { type: Number, default: 0 },
      currencyCode: { type: String, required: true },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
}

module.exports = walletSchema;
