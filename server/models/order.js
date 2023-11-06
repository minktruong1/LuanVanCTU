const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    productList: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        category: { type: mongoose.Types.ObjectId, ref: "Category" },
        categoryTitle: String,
        title: String,
        quantity: Number,
        images: Array,
        price: Number,
        buyInPrice: Number,
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
      enum: ["cod", "paypal", "VNpay"],
    },
    totalPrice: Number,
    profit: Number,
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
