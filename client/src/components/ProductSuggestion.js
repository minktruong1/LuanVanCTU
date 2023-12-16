import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  apiGenerateRandomRecommend,
  apiGenerateRecommendByCart,
  apiGenerateRecommendForNew,
} from "../apis/productRecommend";
import Masonry from "react-masonry-css";
import Product from "./Product";

const breakpointColumnsObj = {
  default: 5,
  1100: 4,
  700: 2,
  300: 2,
};

const ProductSuggestion = () => {
  const [products, setProducts] = useState(null);
  const { currentData, currentCart } = useSelector((state) => state.user);

  const fetchRandomForNew = async () => {
    const response = await apiGenerateRecommendForNew();
    if (response.success) {
      setProducts(response.recommendProduct);
    }
  };

  const fetchRecommend = async () => {
    const response = await apiGenerateRandomRecommend();
    if (response.success) {
      setProducts(response.recommendProduct);
    }
  };

  const fetchRecommendByCart = async () => {
    const response = await apiGenerateRecommendByCart();
    if (response.success) {
      setProducts(response.recommendProduct);
    }
  };

  useEffect(() => {
    if (currentData) {
      if (currentCart?.length > 0) {
        fetchRecommendByCart();
      } else {
        fetchRecommend();
      }
    } else {
      fetchRandomForNew();
    }
  }, [currentData]);

  return (
    <div className="bg-white w-[calc(100%-20px)] md:w-full my-2 p-2">
      <h1 className="p-2 text-xl">Gợi ý sản phẩm</h1>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid flex mb-[20px]"
        columnClassName="my-masonry-grid_column "
      >
        {products?.map((product) => (
          <Product
            key={product._id}
            pid={product.product}
            productData={product}
          />
        ))}
      </Masonry>
    </div>
  );
};

export default ProductSuggestion;
