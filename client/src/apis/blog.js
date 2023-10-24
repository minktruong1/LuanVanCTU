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
