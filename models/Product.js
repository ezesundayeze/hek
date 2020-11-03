const mongoose = require("mongoose");

const Schema = mongoose.Schema;

function productSchema() {
  return Schema(
    {
    
    title: {
        type: String, 
        required: true
    },
    brand: {
        type: String, 
        required: true
    },
    productType:{ type: String, default: "retail", enum: ["retail", "wholesale"]},
    size: [ Number ], 
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category",
      },
      status: {
        type: Boolean,
        default: true
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      images: { type: Array, required: true },
      rating: [ Number ],
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