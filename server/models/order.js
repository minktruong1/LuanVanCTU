const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
  products: [
    {
      productName: { type: mongoose.Types.ObjectId, ref: "Product" },
      count: Number,
      description: String,
    },
  ],
  status: {
    type: String,
    default: "Process",
    enum: ["Cancelled", "Processing", "Done"],
  },
  payment: {},
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

//Export the model
module.exports = mongoose.model("Order", orderSchema);
