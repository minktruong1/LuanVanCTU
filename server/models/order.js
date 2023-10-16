const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
  productList: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product" },
      count: Number,
      price: Number,
      title: String,
    },
  ],
  status: {
    type: String,
    default: "Cancelled",
    enum: ["Cancelled", "Process", "Shipping", "Done"],
  },
  totalPrice: Number,
  address: String,
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

//Export the model
module.exports = mongoose.model("Order", orderSchema);
