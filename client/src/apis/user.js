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
