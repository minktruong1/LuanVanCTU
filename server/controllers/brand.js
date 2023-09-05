const Brand = require("../models/brand.js");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const response = await Brand.create(req.body);
  return res.json({
    success: response ? true : false,
    createdBrand: response ? response : "error when create Brand",
  });
});

const getAllBrand = asyncHandler(async (req, res) => {
  const response = await Brand.find();
  return res.json({
    success: response ? true : false,
    brands: response ? response : "error when get all Brand",
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { brid } = req.params;
  const response = await Brand.findByIdAndUpdate(brid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedBrand: response ? response : "error when update Brand",
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { brid } = req.params;
  const response = await Brand.findByIdAndDelete(brid);

  return res.json({
    success: response ? true : false,
    deletedBrand: response ? response : "error when delete Brand",
  });
});

module.exports = {
  createBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
};
