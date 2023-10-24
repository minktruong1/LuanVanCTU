import axios from "../axios";

export const apiGetBrandFromCate = () =>
  axios({
    url: "/category/brand/",
    method: "GET",
  });
