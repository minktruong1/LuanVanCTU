const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    viewNumber: {
      type: Number,
      default: 0,
    },
    listOfLikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    listOfDislikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
    },
    author: {
      type: String,
      default: "Admin",
    },
    updatedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
