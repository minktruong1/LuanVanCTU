const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
  productList: [
    {
      productName: { type: mongoose.Types.ObjectId, ref: "Product" },
      count: Number,
      description: String,
    },
  ],
  status: {
    type: String,
    default: "Processing",
    enum: ["Cancelled", "Processing", "Done"],
  },
  lastPrice: {
    type: Number,
  },
  coupon: {
    type: mongoose.Types.ObjectId,
    ref: "Coupon",
  },
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

//Export the model
module.exports = mongoose.model("Order", orderSchema);
