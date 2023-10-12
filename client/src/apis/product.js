import axios from "../axios";

export const apiGetProducts = (params) =>
  axios({
    url: "/product/",
    method: "GET",
    params,
  });

export const apiGetProductDetail = (pid) =>
  axios({
    url: "/product/" + pid,
    method: "GET",
  });

export const apiReview = (data) =>
  axios({
    url: "/product/reviews",
    method: "PUT",
    data,
  });

export const apiCreateProduct = (data) =>
  axios({
    url: "/product/",
    method: "POST",
    data,
  });

export const apiUpdateProduct = (data, pid) =>
  axios({
    url: "/product/" + pid,
    method: "PUT",
    data,
  });
export const apiDeleteProduct = (pid) =>
  axios({
    url: "/product/" + pid,
    method: "DELETE",
  });
