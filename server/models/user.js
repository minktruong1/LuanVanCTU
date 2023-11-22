const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    cart: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        category: String,
        quantity: Number,
        price: Number,
        buyInPrice: Number,
        title: String,
        images: Array,
      },
    ],
    wishList: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        category: String,
        price: Number,
        buyInPrice: Number,
        title: String,
        images: Array,
      },
    ],
    recommendList: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        slug: String,
        category: String,
        price: Number,
        buyInPrice: Number,
        title: String,
        images: Array,
        reviewPoint: Number,
      },
    ],
    checkedProducts: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        category: String,
        price: Number,
        buyInPrice: Number,
        title: String,
        images: Array,
      },
    ],
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
};
//Export the model
module.exports = mongoose.model("User", userSchema);
