const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var purchaseInfoSchema = new mongoose.Schema(
  {
    title: String,
    productList: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        category: String,
        brand: String,
        title: String,
        quantity: Number,
        images: Array,
        price: Number,
        buyInPrice: Number,
      },
    ],
    productCount: Number,
    totalPay: Number,
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("PurchaseInfo", purchaseInfoSchema);
