const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

function categorySchema() {
  return Schema(
    {
      title: {
        type: String,
        require: true,
      },
      slug: { type: String, slug: "title", unique: true },
      description: {
        type: String,
        default: null,
      },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
}

module.exports = categorySchema;
