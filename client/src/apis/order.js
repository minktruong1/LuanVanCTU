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
