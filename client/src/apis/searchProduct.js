import axios from "../axios";

export const apiSearchProductHeader = (searchProduct) =>
  axios({
    url: "/search/searchproduct/" + searchProduct,
    method: "GET",
  });
