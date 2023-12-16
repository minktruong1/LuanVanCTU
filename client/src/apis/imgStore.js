import axios from "../axios";

export const apiUpdateImgStore = (data, imgid) =>
  axios({
    url: "/imagestore/" + imgid,
    method: "PUT",
    data,
  });

export const apiCreateImgStore = (data) =>
  axios({
    url: "/imagestore/",
    method: "POST",
    data,
  });

export const apiGetAllImgStore = () =>
  axios({
    url: "/imagestore/",
    method: "GET",
  });

export const apiGetDetailImgStore = (title) =>
  axios({
    url: "/imagestore/getDetail/" + title,
    method: "GET",
  });

export const apiDeleteImgStore = (imgid) =>
  axios({
    url: "/imagestore/" + imgid,
    method: "DELETE",
  });
