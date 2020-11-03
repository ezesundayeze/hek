const mongoose = require("mongoose");

const Schema = mongoose.Schema;

function storeSchema() {
  return Schema(
    {
      name: {
        type: String,
        require: true
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      address: { type: String, default: null },
      country: { type: String, default: "Nigeria" },
      city: { type: String, default: "Nigeria" },
      verificationStatus: {
        type: String,
        enum: ["verified", "pending", "unverified"],
        default: "unverified",
      },

    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
}

module.exports = storeSchema;
