import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../../apis";
import Masonry from "react-masonry-css";
import { Breadcrumb, Pagination, Product } from "../../components";
import { useParams, useSearchParams } from "react-router-dom";

const breakpointColumnsObj = {
  default: 5,
  1100: 4,
  700: 2,
  300: 2,
};

const SearchProduct = () => {
  window.scrollTo(0, 0);

  const [products, setProducts] = useState(null);
  const [params] = useSearchParams();
  const [keyword, setKeyword] = useState(null);

  const fetchProductByKeyword = async (query) => {
    const response = await apiGetProducts({ ...query, limit: 999 });
    if (response.success) {
      setProducts(response.products);
    }
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    const title = params.get("title");
    setKeyword(title);
    fetchProductByKeyword({ ...queries });
  }, [params]);
  return (
    <div className="w-[calc(100%-20px)] md:w-main ">
      <Breadcrumb />

      <div className="bg-white rounded">
        <h2 className="text-center text-xl py-3">
          Kết quả tìm kiếm cho từ khoá{" "}
          <strong className="text-main">{keyword}</strong>{" "}
        </h2>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid flex mb-[20px]"
          columnClassName="my-masonry-grid_column "
        >
          {products?.map((product) => (
            <Product key={product._id} pid={product.id} productData={product} />
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default SearchProduct;
