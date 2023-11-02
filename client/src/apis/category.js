import axios from "../axios";

export const apiUpdateCategory = (data, cateid) =>
  axios({
    url: "/category/" + cateid,
    method: "PUT",
    data,
  });

export const apiCreateCategory = (data) =>
  axios({
    url: "/category/",
    method: "POST",
    data,
  });

export const apiDeleteCategory = (cateid) =>
  axios({
    url: "/category/" + cateid,
    method: "DELETE",
  });
