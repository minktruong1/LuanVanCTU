import axios from "../axios";

export const apiGenerateRandomRecommend = () =>
  axios({
    url: "/user/recommend/",
    method: "GET",
  });

export const apiGenerateRecommendByCart = () =>
  axios({
    url: "/user/iscart/",
    method: "GET",
  });

export const apiGenerateRecommendForNew = () =>
  axios({
    url: "/user/recommendfornew/",
    method: "GET",
  });
