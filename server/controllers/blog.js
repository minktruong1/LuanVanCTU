const Blog = require("../models/blog.js");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const blogController = {
  createBlog: asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const image = req?.files?.image[0]?.path;

    if (!title && !description) {
      throw new Error("Thiếu dữ liệu");
    }

    if (req.body.image) {
      req.body.image = image;
    }

    req.body.slug = slugify(title);

    const response = await Blog.create(req.body);
    return res.status(200).json({
      success: response ? true : false,
      message: response ? "Tạo thành công" : "Lỗi tạo blog",
    });
  }),

  updateBlog: asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const files = req?.files;

    if (req.body && req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    if (files?.image) {
      req.body.image = files?.image[0]?.path;
    }

    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.json({
      success: response ? true : false,
      message: response
        ? "Cập nhật bài viết thành công"
        : "Lỗi cập nhật bài viết",
    });
  }),

  userGetAllBlog: asyncHandler(async (req, res) => {
    let query = Blog.find();

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }

    // Limit
    const limit = req.query.limit ? +req.query.limit : -1;
    if (limit !== -1) {
      query = query.limit(limit);
    }

    const response = await query.exec();
    return res.json({
      success: response ? true : false,
      blogs: response ? response : "error when get all Blogs ",
    });
  }),

  likeBlog: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;

    if (!bid) {
      throw new Error("Missing inputs");
    }

    const blog = await Blog.findById(bid);

    const alreadyDisliked = blog?.listOfDislikes?.some(
      (element) => element.toString() === _id
    );

    if (alreadyDisliked) {
      const response = await Blog.findByIdAndUpdate(
        bid,
        {
          $pull: { listOfDislikes: _id },
          $addToSet: { listOfLikes: _id },
        },
        { new: true }
      );
      return res.json({
        success: response ? true : false,
        results: response,
      });
    }

    const isLiked = blog?.listOfLikes?.some(
      (element) => element.toString() === _id
    );

    if (isLiked) {
      const response = await Blog.findByIdAndUpdate(
        bid,
        { $pull: { listOfLikes: _id } },
        { new: true }
      );
      return res.json({
        success: response ? true : false,
        results: response,
      });
    } else {
      const response = await Blog.findByIdAndUpdate(
        bid,
        { $addToSet: { listOfLikes: _id } },
        { new: true }
      );
      return res.json({
        success: response ? true : false,
        results: response,
      });
    }
  }),

  dislikeBlog: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;

    if (!bid) {
      throw new Error("Missing inputs");
    }

    const blog = await Blog.findById(bid);

    const alreadyLiked = blog?.listOfLikes?.some(
      (element) => element.toString() === _id
    );

    if (alreadyLiked) {
      const response = await Blog.findByIdAndUpdate(
        bid,
        {
          $pull: { listOfLikes: _id },
          $addToSet: { listOfDislikes: _id },
        },
        { new: true }
      );
      return res.json({
        success: response ? true : false,
        results: response,
      });
    }

    const isDisliked = blog?.listOfDislikes?.some(
      (element) => element.toString() === _id
    );

    if (isDisliked) {
      const response = await Blog.findByIdAndUpdate(
        bid,
        { $pull: { listOfDislikes: _id } },
        { new: true }
      );
      return res.json({
        success: response ? true : false,
        results: response,
      });
    } else {
      const response = await Blog.findByIdAndUpdate(
        bid,
        { $addToSet: { listOfDislikes: _id } },
        { new: true }
      );
      return res.json({
        success: response ? true : false,
        results: response,
      });
    }
  }),

  getBlog: asyncHandler(async (req, res) => {
    const { bid } = req.params;

    const blog = await Blog.findByIdAndUpdate(
      bid,
      { $inc: { viewNumber: 1 } },
      { new: true }
    )
      .populate("listOfLikes", "firstName lastName")
      .populate("listOfDislikes", "firstName lastName");

    const countLike = blog.listOfLikes.length;
    const countDislike = blog.listOfDislikes.length;

    return res.json({
      success: blog ? true : false,
      countLike,
      countDislike,
      getBlog: blog,
    });
  }),

  deleteBlog: asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndDelete(bid);
    return res.json({
      success: response ? true : false,
      message: response ? "Đã xóa bài viết" : "Lỗi xóa bài viết",
    });
  }),

  uploadBlogImg: asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (!req.file) {
      throw new Error("Missing inputs");
    }

    const response = await Blog.findByIdAndUpdate(
      bid,
      { image: req.file.path },
      { new: true }
    );

    return res.status(200).json({
      status: response ? true : false,
      updatedBlogImg: response ? response : "Lỗi đăng ảnh bài viết",
    });
  }),

  adminGetBlogList: asyncHandler(async (req, res) => {
    const queries = { ...req.query };

    //list type of filter
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((element) => {
      delete queries[element];
    });

    //syntax normalization
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (matchedEl) => `$${matchedEl}`
    );

    const formatQueries = JSON.parse(queryString);

    let queryBlock = {};
    if (queries?.query) {
      delete formatQueries.query;
      queryBlock = {
        $or: [
          { title: { $regex: queries.query, $options: "i" } },
          { category: { $regex: queries.query, $options: "i" } },
        ],
      };
    }

    const groupQuery = { ...formatQueries, ...queryBlock };
    let queryCommand = Blog.find(groupQuery);

    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    }

    //Range
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommand = queryCommand.select(fields);
    }

    //Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_ORDERS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    try {
      const response = await queryCommand;
      const counts = await Blog.find(groupQuery).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        blogs: response ? response : "Lỗi lấy danh sách bài viết",
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }),
};

module.exports = blogController;
