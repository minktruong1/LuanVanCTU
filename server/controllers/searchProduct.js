const Product = require("../models/product");

const searchProduct = async (req, res) => {
  const searchQuery = req.params.searchProduct; // Lấy giá trị từ tham số URL
  try {
    const products = await Product.find({
      title: { $regex: searchQuery, $options: "i" },
    }).sort({ reviewPoint: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Lỗi tìm kiếm sản phẩm." });
  }
};

module.exports = {
  searchProduct,
};
