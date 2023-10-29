import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../../apis";
import Masonry from "react-masonry-css";
import { Pagination, Product } from "../../components";

const breakpointColumnsObj = {
  default: 5,
  1100: 4,
  700: 2,
  300: 2,
};

const SearchProduct = ({ productSearch }) => {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    // Tại đây, bạn có thể sử dụng giá trị productSearch để thực hiện tác vụ tìm kiếm sản phẩm hoặc hiển thị dữ liệu.
    console.log(productSearch);
    // if (productSearch) {
    //   const foundProducts = productSearch.products; // Giả sử productSearch chứa danh sách sản phẩm tìm kiếm.
    //   setProducts(foundProducts);
    // }
  }, [productSearch]);

  return (
    <div className="w-[calc(100%-20px)] md:w-main bg-white rounded">
      {/* <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid flex mb-[20px]"
        columnClassName="my-masonry-grid_column "
      >
        {products?.products?.map((element) => (
          <Product key={element._id} pid={element.id} productData={element} />
        ))}
      </Masonry> */}
    </div>
  );
};

export default SearchProduct;
