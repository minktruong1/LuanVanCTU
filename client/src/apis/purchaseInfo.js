import axios from "../axios";

export const apiGetAllPurchaseInfo = (params) =>
  axios({
    url: "/purchaseInfo/",
    method: "GET",
    params,
  });

export const apiDetailPurchaseInfo = (purchaseid) =>
  axios({
    url: "/" + purchaseid,
    method: "GET",
  });

export const apiDeleteProductPurchaseInfo = (data) =>
  axios({
    url: "/purchaseInfo/",
    method: "DELETE",
    data,
  });
