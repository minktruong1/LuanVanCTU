const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    productList: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
        title: String,
        images: Array,
      },
    ],
    status: {
      type: String,
      default: "Đang xử lý",
      enum: ["Đang xử lý", "Đang vận chuyển", "Hoàn thành", "Hủy"],
    },
    method: {
      type: String,
      default: "cod",
      enum: ["cod", "paypal"],
    },
    totalPrice: Number,
    address: String,
    buyer: {
      user: { type: mongoose.Types.ObjectId, ref: "User" },
      firstName: String,
      lastName: String,
      address: String,
      mobile: String,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
