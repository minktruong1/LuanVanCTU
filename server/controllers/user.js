const User = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const {
  tokenGeneration,
  tokenRefreshGeneration,
} = require("../middlewares/jwt.js");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail.js");
const crypto = require("crypto");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      mes: "Missing value",
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User already exist");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      mes: newUser ? "Register successful" : "Something go wrong",
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing value",
    });
  }

  const checkUser = await User.findOne({ email });
  if (checkUser && (await checkUser.isCorrectPassword(password))) {
    //remove password and role from response
    const { password, role, refreshToken, ...userData } = checkUser.toObject();
    //create login token
    const loginToken = tokenGeneration(checkUser._id, role);
    //create refresh token
    const newRefreshToken = tokenRefreshGeneration(checkUser._id);
    //save refresh token into database
    await User.findByIdAndUpdate(
      checkUser._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    //save refresh token into cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      loginToken,
      userData,
    });
  } else {
    throw new Error("Wrong email or password");
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    message: user ? user : "User not found",
  });
});

const refreshLoginToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken) {
    throw new Error("Don't have refresh token in cookie ");
  }
  const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: result._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newLoginToken: response
      ? tokenGeneration(response._id, response.role)
      : "Refresh Token invalid",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("Don't have refresh token in cookies");
  await User.findOne(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({
    success: true,
    message: "Logout success",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `
  Click here to reset your password, this link
   will be expired after 15 minutes
  <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>
  `;

  const data = {
    email,
    html,
  };

  const result = await sendMail(data);
  return res.status(200).json({
    success: true,
    result,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing input");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    message: user ? "Update password success" : "Something went wrong",
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: result ? true : false,
    users: result,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing inputs");
  const result = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: result ? true : false,
    deleteUser: result
      ? `User with email ${result.email} has been deleted`
      : `Can't found your user`,
  });
});

const updateUserByUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: result ? true : false,
    updateUser: result ? result : `Can't found your user`,
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const result = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: result ? true : false,
    updateUser: result ? result : `Can't found your user`,
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updateUserAddress: response ? response : "Error when update user address",
  });
});

const addProductIntoUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity } = req.body;
  if (!pid || !quantity) throw new Error("Missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyInCart = user?.cart?.find(
    (element) => element.product.toString() === pid
  );
  if (alreadyInCart) {
    const response = await User.updateOne(
      { cart: { $elemMatch: alreadyInCart } },
      { $set: { "cart.$.quantity": quantity } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updateCart: response ? response : "error when add product",
    });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: { cart: { product: pid, quantity } },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updateCart: response ? response : "error when add product",
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  refreshLoginToken,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers,
  deleteUser,
  updateUserAddress,
  updateUserByUser,
  updateUserByAdmin,
  addProductIntoUserCart,
};
