const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var imageStoreSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
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
module.exports = mongoose.model("ImageStore", imageStoreSchema);
