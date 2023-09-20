import axios from "../axios";

export const apiGetCategories = () =>
  axios({
    url: "/category/",
    method: "GET",
  });
