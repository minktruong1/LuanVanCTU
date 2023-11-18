const ImageStore = require("../models/imageStore.js");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createImage = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const images = req?.files?.images?.map((file) => file.path);

  if (!title) {
    throw new Error("Missing required fields");
  }

  const slug = slugify(title);

  const newImage = await ImageStore.create({
    title,
    slug,
    images,
  });

  return res.status(200).json({
    success: true,
    message: "Image created successfully",
    image: newImage,
  });
});

const getAllImages = asyncHandler(async (req, res) => {
  const images = await ImageStore.find();

  return res.status(200).json({
    success: true,
    images,
  });
});

const getDetailImages = asyncHandler(async (req, res) => {
  const title = req.params.title;

  const keyword = slugify(title);

  const imageStore = await ImageStore.find({
    slug: keyword,
  }).select("images");

  return res.status(200).json({
    success: imageStore ? true : false,
    message: imageStore ? "Lấy nhóm ảnh thành công" : "Không tìm thấy ảnh",
    imageStore: imageStore,
  });
});

const updateImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const { title } = req.body;
  const images = req?.files?.images?.map((file) => file.path);

  const updatedFields = {};

  if (title) {
    updatedFields.title = title;
    updatedFields.slug = slugify(title);
  }

  if (images) {
    updatedFields.images = images;
  }

  const updatedImage = await ImageStore.findByIdAndUpdate(
    imageId,
    { $set: updatedFields },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Image updated successfully",
    image: updatedImage,
  });
});

const deleteImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const deletedImage = await ImageStore.findByIdAndDelete(imageId);

  return res.status(200).json({
    success: true,
    message: "Image deleted successfully",
    deletedImage,
  });
});

module.exports = {
  createImage,
  getAllImages,
  updateImage,
  deleteImage,
  getDetailImages,
};
