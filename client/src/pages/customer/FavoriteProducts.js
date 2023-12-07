import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../../apis";
import Masonry from "react-masonry-css";
import { Product } from "../../components";
import { useSelector } from "react-redux";
import emptyCart from "../../assets/empty-cart.png";
import { Helmet } from "react-helmet";

const breakpointColumnsObj = {
  default: 5,
  1100: 4,
  700: 2,
  300: 2,
};

const FavoriteProducts = () => {
  const [products, setProducts] = useState(null);
  const { currentData } = useSelector((state) => state.user);

  const fetchProduct = async () => {
    const favoriteProducts = currentData?.wishList?.map((item) => item.product);
    setProducts(favoriteProducts);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="w-full bg-white rounded">
      <div className="p-[16px] text-[24px] font-medium  ">
        <h1>Các sản phẩm yêu thích</h1>
      </div>
      <div>
        {products?.length === 0 ? (
          <div className="grid gird-cols-1 place-items-center">
            <img alt="" src={emptyCart} />
            <h1 className="text-lg font-medium">
              Bạn chưa yêu thích sản phẩm nào
            </h1>
          </div>
        ) : (
          <div></div>
        )}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid flex mb-[20px]"
          columnClassName="my-masonry-grid_column "
        >
          {products?.map((element) => (
            <Product
              key={element._id}
              pid={element._id}
              productData={element}
            />
          ))}
        </Masonry>
      </div>
      <Helmet>
        <title>Sản phẩm yêu thích</title>
      </Helmet>
    </div>
  );
};

export default FavoriteProducts;
