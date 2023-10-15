import axios from "../axios";

export const apiRegister = (data) =>
  axios({
    url: "/user/register",
    method: "POST",
    data: data,
    withCredentials: true,
  });

export const apiRegisterCheck = (token) =>
  axios({
    url: "/user/register-confirm/" + token,
    method: "PUT",
  });

export const apiLogin = (data) =>
  axios({
    url: "/user/login",
    method: "POST",
    data: data,
  });

export const apiForgotPassword = (data) =>
  axios({
    url: "/user/forgotpassword",
    method: "POST",
    data: data,
  });

export const apiResetPassword = (data) =>
  axios({
    url: "/user/resetPassword",
    method: "PUT",
    data: data,
  });

export const apiGetCurrentUser = () =>
  axios({
    url: "/user/current",
    method: "GET",
  });

export const apiGetUserList = (params) =>
  axios({
    url: "/user/",
    method: "GET",
    params,
  });

export const apiUpdateUser = (data, uid) =>
  axios({
    url: "/user/" + uid,
    method: "PUT",
    data,
  });

export const apiDeleteUser = (uid) =>
  axios({
    url: "/user/" + uid,
    method: "DELETE",
  });

export const apiUpdateUserByUser = (data) =>
  axios({
    url: "/user/current",
    method: "PUT",
    data,
  });

export const apiUpdateCart = (data) =>
  axios({
    url: "/user/cart",
    method: "PUT",
    data,
  });

export const apiRemoveProductFromCart = (pid) =>
  axios({
    url: "/user/remove-product/" + pid,
    method: "DELETE",
  });
