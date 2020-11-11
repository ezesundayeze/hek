const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

function userSchema() {
  return Schema(
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: false },
      email: { type: String, required: true, unique: true },
      image: { type: String, required: false },
      address: { type: String, default: null },
      slug: { type: String, slug: "firstName", unique: true },
      country: { type: String, default: "Nigeria" },
      city: { type: String, default: "Nigeria" },
      verificationToken: {
        token: { type: String },
        expiryDate: { type: String },
      },

      role: {
        type: String,
        default: "customer",
        enum: ["customer", "merchant"],
      },
      wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
        default: null,
      },
      bankName: { type: String, default: null },
      accountName: { type: String, default: null },
      accountNumber: { type: String, default: null },
      password: { type: String, required: true },
      status: { type: String, default: "active" },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "created_at" } }
  );
}

module.exports = userSchema;
