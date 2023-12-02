import axios from "../axios";

export const apiExportProducts = () =>
  axios({
    url: "/export/products",
    method: "GET",
  });
