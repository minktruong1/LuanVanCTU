import axios from "../axios";

export const apiGetCoupon = (params) =>
  axios({
    url: "/coupon/",
    method: "GET",
    params,
  });

export const apiUserGetCoupon = () =>
  axios({
    url: "/coupon/user-get",
    method: "GET",
  });

export const apiUpdateCoupon = (data, cid) =>
  axios({
    url: "/coupon/" + cid,
    method: "PUT",
    data,
  });

export const apiDeleteCoupon = (cid) =>
  axios({
    url: "/coupon/" + cid,
    method: "DELETE",
  });

export const apiCreateCoupon = (data) =>
  axios({
    url: "/coupon/",
    method: "POST",
    data,
  });
