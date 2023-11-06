const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyLoginToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          message: "Mã đăng nhập hết hạn",
        });
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Yêu cầu xác thực",
    });
  }
});

const isAdmin = asyncHandler((req, res, next) => {
  const { role } = req.user;
  console.log(role);
  if (role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Yêu cầu quyền quản trị",
    });
  }
  next();
});

module.exports = {
  verifyLoginToken,
  isAdmin,
};
