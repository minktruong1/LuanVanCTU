const Images = require("../models/images.js");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createImage = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const images = req?.files?.images?.map((file) => file.path);

  if (!title || !images) {
    throw new Error("Missing required fields");
  }

  const slug = slugify(title);

  const newImage = await Images.create({
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
  const images = await Images.find();

  return res.status(200).json({
    success: true,
    images,
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

  const updatedImage = await Images.findByIdAndUpdate(
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
  const deletedImage = await Images.findByIdAndDelete(imageId);

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
};
