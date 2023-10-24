import axios from "../axios";

export const apiGetUserOrders = () =>
  axios({
    url: "/order/",
    method: "GET",
  });
