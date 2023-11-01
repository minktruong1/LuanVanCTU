const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    quantity: {
      type: Number,
    },
    percentDiscount: {
      type: Number,
      default: 0,
    },
    directDiscount: {
      type: Number,
      default: 0,
    },
    expire: {
      type: Date,
      require: true,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);
