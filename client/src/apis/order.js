import axios from "../axios";

export const apiGetUserOrders = () =>
  axios({
    url: "/order/",
    method: "GET",
  });

export const apiAdminGetUserOrders = (params) =>
  axios({
    url: "/order/all",
    method: "GET",
    params,
  });

export const apiAdminUpdateOrderStatus = (oid, data) =>
  axios({
    url: "/order/status/" + oid,
    method: "PUT",
    data,
  });
