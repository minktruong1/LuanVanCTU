const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var imagesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    images: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Images", imageSchema);
