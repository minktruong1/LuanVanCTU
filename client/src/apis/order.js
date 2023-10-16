import axios from "../axios";

export const apiGetOrders = () =>
  axios({
    url: "/order/",
    method: "GET",
  });
