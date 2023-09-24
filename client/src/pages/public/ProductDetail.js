import React from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { pid, title } = useParams();
  console.log({ pid, title });

  return <div>ProductDetail</div>;
};

export default ProductDetail;
