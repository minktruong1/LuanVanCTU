import axios from "../axios";

export const apiGetUserOrders = (params) =>
  axios({
    url: "/order/",
    method: "GET",
    params,
  });

export const apiAdminGetUserOrders = (params) =>
  axios({
    url: "/order/all/",
    method: "GET",
    params,
  });

export const apiUpdateOrderStatus = (oid, data) =>
  axios({
    url: "/order/status/" + oid,
    method: "PUT",
    data,
  });

export const apiAllOrderForCount = () =>
  axios({
    url: "/order/all-count/",
    method: "GET",
  });

export const apiUpdateReviewProductStatus = (data) =>
  axios({
    url: "/order/review/",
    method: "PUT",
    data,
  });
