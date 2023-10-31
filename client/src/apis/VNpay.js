import axios from "../axios";

export const apiCreateVNpayPayment = (data) =>
  axios({
    url: "/vnpay/",
    method: "POST",
    data,
  });

export const apiDataBack = (data) =>
  axios({
    url: `/vnpay/data?${data}`,
    method: "GET",
  });
