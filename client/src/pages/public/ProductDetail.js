import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetProductDetail } from "../../apis";

const ProductDetail = () => {
  const { pid, title } = useParams();

  const fetchProductData = async () => {
    const response = await apiGetProductDetail(pid);
    console.log(response);
  };

  useEffect(() => {
    if (pid) fetchProductData();
  }, [pid]);

  return (
    <>
      <div className="w-full">
        <h1>{title}</h1>
        <div className="bg-white w-main h-[400px] rounded-md">A</div>
      </div>
    </>
  );
};

export default ProductDetail;
