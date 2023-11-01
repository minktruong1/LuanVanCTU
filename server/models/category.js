const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // brand: {
    //   type: Array,
    //   unique: true,
    // },
    brand: [
      {
        _id: mongoose.Types.ObjectId,
        title: String,
      },
    ],
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Category", categorySchema);
