import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../../apis";
import Masonry from "react-masonry-css";
import { Breadcrumb, Pagination, Product } from "../../components";

const breakpointColumnsObj = {
  default: 5,
  1100: 4,
  700: 2,
  300: 2,
};

const SearchProduct = ({ search }) => {
  window.scrollTo(0, 0);

  const [keysearch, setkeysearch] = useState(
    sessionStorage.getItem("keysearch")
  );
  const [products, setProducts] = useState([]);
  const fetchProduct = async () => {
    const res = await fetch(
      `http://localhost:5000/api/search/searchproduct/${keysearch}`
    );
    const data = await res.json();
    console.log(data);
    setProducts(data);
  };

  console.log(products);

  useEffect(() => {
    fetchProduct();
    console.log("keysearch changed:", keysearch);
  }, [keysearch]);

  return (
    <div className="w-[calc(100%-20px)] md:w-main ">
      <Breadcrumb />

      <div className="bg-white rounded">
        <h2 className="text-center text-xl py-3">
          Kết quả tìm kiếm cho từ khoá{" "}
          <strong className="text-main">{keysearch}</strong>{" "}
        </h2>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid flex mb-[20px]"
          columnClassName="my-masonry-grid_column "
        >
          {products.map((product) => (
            <Product key={product._id} pid={product.id} productData={product} />
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default SearchProduct;
