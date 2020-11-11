const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;
mongoose.plugin(mongoosePaginate);

function productSchema() {
  return Schema(
    {
      title: {
        type: String,
        // required: true,
      },
      brand: {
        type: String,
        // required: true,
      },
      productType: {
        type: String,
        default: "retail",
        enum: ["retail", "wholesale"],
      },
      size: [Number],
      store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
      status: {
        type: Boolean,
      },
      quantity: { type: String, required: true },
      price: { type: String, required: true },
      images: { type: Array, required: true },
      rating: [Number],
      reviews: [
        {
          comment: { type: String },
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
    },

    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
}

module.exports = productSchema;
