const mongoose = require("mongoose");

const Schema = mongoose.Schema;

function categorySchema() {
  return Schema(
    {
      title: {
        type: String,
        require: true
      },
      description: {
        type: String,
        default: null
      },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
}

module.exports = categorySchema;
