const User = require("../models/user.js");
const Product = require("../models/product.js");
const asyncHandler = require("express-async-handler");
const {
  tokenGeneration,
  tokenRefreshGeneration,
} = require("../middlewares/jwt.js");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail.js");
const crypto = require("crypto");
const createToken = require("uniqid");
const bcrypt = require("bcrypt");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, mobile } = req.body;
  if (!email || !password || !firstName || !lastName || !mobile) {
    return res.status(400).json({
      success: false,
      message: "Missing value",
    });
  }

  const user = await User.findOne({ email });

  if (user) {
    throw new Error("Email đã được đăng ký");
  } else {
    const token = createToken();
    const emailTransform = btoa(email) + "@" + token;
    const newUser = await User.create({
      email: emailTransform,
      password,
      firstName,
      lastName,
      mobile,
    });
    if (newUser) {
      const html = `
        <div style="text-align: center;">
          <h2 style="font-size: 20px; color: #333; margin-bottom: 20px;">Sao chép và dán đoạn mã sau:</h2>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f0f0f0;">
            ${token}
          </div>
          <button style="background-color: #007bff; color: #fff; border: none; padding: 10px 20px; margin-top: 20px; cursor: pointer;" id="copyButton">Copy Mã</button>
        </div>
        <script>
          document.getElementById("copyButton").addEventListener("click", function() {
            var tokenText = document.querySelector("div[style*='background-color: #f0f0f0;']");
            var range = document.createRange();
            range.selectNode(tokenText);
            window.getSelection().removeAllRanges(); // Clear previous selections.
            window.getSelection().addRange(range);
            document.execCommand("copy");
            window.getSelection().removeAllRanges(); // Clear the selection.
            alert("Mã đã được sao chép!");
          });
        </script>
      `;

      await sendMail({
        email,
        html,
        subject: "Xác nhận đăng ký tài khoản tại cửa hàng phụ kiện máy tính",
      });
    }

    setTimeout(async () => {
      await User.deleteOne({ email: emailTransform });
    }, [15 * 60 * 1000]);

    return res.json({
      success: newUser ? true : false,
      message: newUser
        ? "Hãy kiểm tra hộp thư để lấy mã đăng ký"
        : "Lỗi đăng ký",
    });
  }
});

const registerCheck = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const notActiveEmail = await User.findOne({ email: new RegExp(`${token}$`) });

  if (notActiveEmail) {
    notActiveEmail.email = atob(notActiveEmail?.email?.split("@")[0]);
    notActiveEmail.save();
  }

  return res.json({
    success: notActiveEmail ? true : false,
    message: notActiveEmail
      ? "Tạo tài khoản thành công, bạn có thể đăng nhập"
      : "Lỗi xác mã xác thực",
  });
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
    throw new Error("Sai tên đăng nhập hoặc mật khẩu");
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id)
    .select("-refreshToken -password")
    .populate({
      path: "cart",
      populate: {
        path: "product",
        select: "slug quantity",
      },
    })
    .populate({
      path: "wishList",
      populate: {
        path: "product",
        select: "title slug images price quantity category reviewPoint",
      },
    })
    .populate({
      path: "checkedProducts",
      populate: {
        path: "product",
        select: "title images price quantity category reviewPoint",
      },
    });
  return res.status(200).json({
    success: user ? true : false,
    getUser: user ? user : "User not found",
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  //list type of filter
  const exclusiveFields = ["limit", "sort", "page", "fields"];
  exclusiveFields.forEach((element) => {
    delete queries[element];
  });

  //syntax normalization
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );

  const formatQueries = JSON.parse(queryString);

  //Filtering(title, price)
  if (queries?.name) {
    formatQueries.name = { $regex: queries.title, $options: "i" };
  }

  if (req.query.queryCollect) {
    delete formatQueries.queryCollect;
    formatQueries["$or"] = [
      { firstName: { $regex: req.query.queryCollect, $options: "i" } },
      { lastName: { $regex: req.query.queryCollect, $options: "i" } },
      { email: { $regex: req.query.queryCollect, $options: "i" } },
      { mobile: { $regex: req.query.queryCollect, $options: "i" } },
    ];
  }

  let queryCommand = User.find(formatQueries);

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  //Range
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join("");
    queryCommand = queryCommand.select(fields);
  }

  //Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  //Running query
  try {
    const response = await queryCommand;
    const counts = await User.find(formatQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      userList: response ? response : "Error when get user List",
    });
  } catch (err) {
    throw new Error(err.message);
  }
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
  const { email } = req.body;
  if (!email) {
    throw new Error("Hãy nhập email");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `
  Nhấn vào đường link để đặt lại mật khẩu, đường link này hết hạn sau 15 phút 
  <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>
  `;

  const data = {
    email,
    html,
    subject: "Đặt lại mật khẩu của bạn",
  };

  const result = await sendMail(data);
  return res.status(200).json({
    success: result.response?.includes("OK") ? true : false,
    message: result.response?.includes("OK")
      ? "Kiểm tra hộp thư của bạn"
      : "Đã xảy ra lỗi",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;

  if (!password || !token) {
    throw new Error("Thiếu dữ liệu");
  }

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Đã quá hạn đặt lại mật khẩu");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    message: user ? "Đổi lại mật khẩu thành công" : "Lỗi cập nhật mật khẩu",
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const result = await User.findByIdAndDelete(uid);
  return res.status(200).json({
    success: result ? true : false,
    message: result
      ? `Đã xóa người dùng với email ${result.email}`
      : `Không tìm thấy người dùng`,
  });
});

const updateUserByUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { firstName, lastName, mobile, address } = req.body;
  const data = { firstName, lastName, mobile, address };
  if (req.file) data.avatar = req.file.path;
  if (!_id || Object.keys(req.body).length === 0) {
    throw new Error("Missing inputs");
  }
  const result = await User.findByIdAndUpdate(_id, data, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: result ? true : false,
    message: result
      ? "Cập nhật thông tin người dùng thành công"
      : `Lỗi cập nhật`,
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
    message: result ? "Cập nhật thành công" : `Lỗi khi cập nhật`,
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
  const { pid, cid, category, quantity, price, title, images, buyInPrice } =
    req.body;
  if (!pid) {
    throw new Error("Missing inputs");
  }
  const findProduct = await Product.findOne({ _id: pid });
  if (findProduct.quantity < quantity) {
    throw new Error("Đã hết");
  }

  const user = await User.findById(_id).select("cart");
  const alreadyInCart = user?.cart?.find(
    (element) => element.product.toString() === pid
  );
  if (alreadyInCart) {
    const response = await User.updateOne(
      { cart: { $elemMatch: alreadyInCart } },
      {
        $set: {
          "cart.$.quantity": quantity,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      message: response ? "Cập nhật giỏ hàng thành công" : "Lỗi thêm giỏ hàng",
    });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          cart: {
            product: pid,
            category: cid,
            category,
            quantity,
            price,
            title,
            images,
            buyInPrice,
          },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      message: response ? "Thêm sản phẩm thành công" : "Lỗi thêm sản phẩm",
    });
  }
});

const removeProductFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid } = req.params;

  const response = await User.findByIdAndUpdate(
    _id,
    { $pull: { cart: { product: pid } } },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    message: response ? "Xóa sản phẩm thành công" : "Lỗi xóa sản phẩm",
  });
});

const addProductToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, category, price, buyInPrice, title, images } = req.body;

  if (!pid) {
    throw new Error("Missing inputs");
  }
  const user = await User.findById(_id).select("wishList");

  const alreadyAdd = user?.wishList?.find(
    (element) => element.product.toString() === pid
  );
  if (alreadyAdd) {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $pull: { wishList: { product: pid } },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      message: response ? "Gỡ ra khỏi danh sách yêu thích" : "Lỗi gỡ sản phẩm",
    });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          wishList: {
            product: pid,
            category,
            price,
            buyInPrice,
            title,
            images,
          },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      message: response ? "Yêu thích sản phẩm" : "Lỗi thêm sản phẩm",
    });
  }
});

const pushCheckedProduct = asyncHandler(async (req, res) => {
  const { _id, pid } = req.body;

  const user = await User.findById(_id).select("checkedProducts");

  // Check if the product is already in checkedProducts
  const index = user.checkedProducts.findIndex(
    (element) => element.product.toString() === pid
  );

  if (index !== -1) {
    // If the product is already in the checkedProducts, remove it from its current position
    const [existingProduct] = user.checkedProducts.splice(index, 1);
    user.checkedProducts.unshift(existingProduct); // Move the existing product to the beginning of the array
  } else {
    // If the product is not in checkedProducts, add it to the beginning
    const productToAdd = await Product.findById(pid);
    if (productToAdd) {
      const newProduct = {
        product: productToAdd._id,
        category: productToAdd.category,
        price: productToAdd.price,
        buyInPrice: productToAdd.buyInPrice,
        title: productToAdd.title,
        images: productToAdd.images,
      };
      user.checkedProducts.unshift(newProduct);
    } else {
      throw new Error("Product not found");
    }
  }

  // Limit checkedProducts array to 10 items
  if (user.checkedProducts.length > 10) {
    user.checkedProducts = user.checkedProducts.slice(0, 10);
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Đã cập nhật sản phẩm đã xem gần đây",
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { oldPassword, newPassword } = req.body;

  const findUser = await User.findOne({ _id });

  if (findUser && (await findUser.isCorrectPassword(oldPassword))) {
    findUser.password = newPassword;
    findUser.passwordChangeAt = Date.now();
    await findUser.save();
  } else {
    throw new Error("Kiểm tra lại mật khẩu cũ");
  }

  return res.status(200).json({
    success: findUser ? true : false,
    message: findUser ? "Đổi mật khẩu thành công" : "Lỗi đổi mật khẩu",
  });
});

const getRandomForNewUser = asyncHandler(async (req, res) => {
  try {
    // Lấy 10 sản phẩm ngẫu nhiên
    const randomProducts = await Product.aggregate([{ $sample: { size: 10 } }]);

    res.status(200).json({
      success: randomProducts ? true : false,
      recommendProduct: randomProducts
        ? randomProducts
        : "Lỗi cập nhật recommendList",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const setRecommendList = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;

    // Lấy 10 sản phẩm ngẫu nhiên
    const randomProducts = await Product.aggregate([{ $sample: { size: 10 } }]);

    // Trích xuất các đối tượng sản phẩm từ kết quả
    const recommendList = randomProducts.map((product) => ({
      product: product._id,
      slug: product.slug,
      category: product.category,
      price: product.price,
      buyInPrice: product.buyInPrice,
      title: product.title,
      images: product.images,
      reviewPoint: product.reviewPoint,
    }));

    // Cập nhật recommendList của người dùng
    const user = await User.findByIdAndUpdate(
      _id,
      { recommendList },
      { new: true }
    );

    res.status(200).json({
      success: user ? true : false,
      recommendProduct: user
        ? user.recommendList
        : "Lỗi cập nhật recommendList",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const isCartProduct = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;

    // Lấy giỏ hàng của người dùng
    const user = await User.findById(_id).select("cart recommendList");

    if (!user || !user.cart) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy giỏ hàng hoặc giỏ hàng rỗng",
      });
    }

    // Lấy danh sách title của sản phẩm trong giỏ hàng
    const cartTitles = user.cart.map((item) => item.title);

    // Lấy danh sách sản phẩm có title gần nhất (loại trừ những sản phẩm trong giỏ hàng)
    const similarProducts = await Product.find({
      title: { $nin: cartTitles }, // Không chọn những sản phẩm trong giỏ hàng
    })
      .sort({ title: 1 }) // Sắp xếp theo title để lấy gần nhất
      .limit(10);

    // Xoá hết các sản phẩm trong recommendList
    user.recommendList = [];

    // Thêm các sản phẩm mới vào recommendList
    user.recommendList = similarProducts.map((product) => ({
      product: product._id,
      slug: product.slug,
      category: product.category,
      price: product.price,
      buyInPrice: product.buyInPrice,
      title: product.title,
      images: product.images,
      reviewPoint: product.reviewPoint,
    }));
    console.log(user.recommendList);

    // Lưu thay đổi vào cơ sở dữ liệu
    await user.save();

    res.status(200).json({
      success: true,
      recommendProduct: user
        ? user.recommendList
        : "Lỗi cập nhật recommendList",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
  registerCheck,
  removeProductFromCart,
  addProductToWishList,
  pushCheckedProduct,
  changePassword,
  setRecommendList,
  isCartProduct,
  getRandomForNewUser,
};
