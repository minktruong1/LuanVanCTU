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

// export const apiGetDetailImgStore = (data) =>
//   axios({
//     url: "/imagestore/getDetail",
//     method: "GET",
//     data,
//   });

export const apiDeleteImgStore = (imgid) =>
  axios({
    url: "/imagestore/" + imgid,
    method: "DELETE",
  });
