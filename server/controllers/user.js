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
    const { password, role, ...userData } = checkUser.toObject();
    //create login token
    const loginToken = tokenGeneration(checkUser._id, role);
    //create refresh token
    const refreshToken = tokenRefreshGeneration(checkUser._id);
    //save refresh token into database
    await User.findByIdAndUpdate(
      checkUser._id,
      { refreshToken },
      { new: true }
    );
    //save refresh token into cookie
    res.cookie("refreshToken", refreshToken, {
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

module.exports = {
  registerUser,
  loginUser,
  getUser,
  refreshLoginToken,
  logout,
  forgotPassword,
  resetPassword,
};
