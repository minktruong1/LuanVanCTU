import axios from "../axios";

export const apiGetAllBlogs = () =>
  axios({
    url: "/blog/",
    method: "GET",
  });

export const apiGetBlogDetail = (bid) =>
  axios({
    url: "/blog/" + bid,
    method: "GET",
  });

export const apiCreateBlog = (data) =>
  axios({
    url: "/blog/",
    method: "POST",
    data,
  });

export const apiAdminGetBlogs = (params) =>
  axios({
    url: "/blog/all",
    method: "GET",
    params,
  });

export const apiAdminUpdateBlog = (data, bid) =>
  axios({
    url: "/blog/" + bid,
    method: "PUT",
    data,
  });

export const apiAdminDeleteBlog = (bid) =>
  axios({
    url: "/blog/" + bid,
    method: "DELETE",
  });

export const apiLikeBlog = (bid) =>
  axios({
    url: "/blog/like/" + bid,
    method: "PUT",
  });

export const apiDislikeBlog = (bid) =>
  axios({
    url: "/blog/dislike/" + bid,
    method: "PUT",
  });
