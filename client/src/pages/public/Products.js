import React, { useCallback, useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import {
  Breadcrumb,
  Button,
  InputSelector,
  Pagination,
  Product,
  SearchItem,
} from "../../components";
import { apiGetProducts } from "../../apis";
import Masonry from "react-masonry-css";
import { sorts } from "../../ultils/contants";
import { Helmet } from "react-helmet";
import emptyImg from "../../assets/no-data.png";

const breakpointColumnsObj = {
  default: 5,
  1100: 4,
  700: 2,
  300: 2,
};

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [activeBox, setActiveBox] = useState(null);
  const [sort, setSort] = useState("");
  const [params] = useSearchParams();
  const { category } = useParams();

  const fetchProductByCate = async (queries) => {
    if (category === "all-products") {
      const response = await apiGetProducts({ ...queries });
      if (response.success) {
        setProducts(response);
      }
    } else {
      const response = await apiGetProducts({ ...queries, category });
      if (response.success) {
        setProducts(response);
      }
    }
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    let priceFilterQuery = {};
    if (queries.from && queries.to) {
      priceFilterQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      };
      delete queries.price;
    } else {
      if (queries.from) {
        queries.price = { gte: queries.from };
      }
      if (queries.to) {
        queries.price = { lte: queries.to };
      }
    }

    delete queries.from;
    delete queries.to;

    fetchProductByCate({ ...priceFilterQuery, ...queries });
  }, [params]);

  const changeActiveBox = useCallback(
    (name) => {
      if (activeBox === name) {
        setActiveBox(null);
      } else {
        setActiveBox(name);
      }
    },
    [activeBox]
  );

  const changeSortValue = useCallback(
    (value) => {
      setSort(value);

      if (value === "") {
        const params = new URLSearchParams(window.location.search);
        params.delete("sort");
        navigate({
          pathname: `/categories/${category}`,
          search: params.toString(),
        });
      } else {
        navigate({
          pathname: `/categories/${category}`,
          search: createSearchParams({ sort: value }).toString(),
        });
      }
    },
    [sort]
  );

  useEffect(() => {
    if (sort) {
      navigate({
        pathname: `/categories/${category}`,
        search: createSearchParams({ sort }).toString(),
      });
    }
  }, [sort]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  console.log(category);
  return (
    <div className="w-[calc(100%-20px)] xl:w-main">
      <Breadcrumb category={category} />
      <div className="bg-white w-full rounded mb-[14px]">
        <div className="p-[24px] flex-auto flex items-center gap-4">
          <SearchItem
            name="Giá"
            onChoice={activeBox}
            changeActiveBox={changeActiveBox}
            type="input"
          />
          {category === "all-products" && (
            <SearchItem
              name="Loại"
              onChoice={activeBox}
              changeActiveBox={changeActiveBox}
            />
          )}
        </div>
        <div className="p-[24px] pt-0 flex flex-col">
          <div className="flex justify-end">
            <div>
              <InputSelector
                changeValue={changeSortValue}
                value={sort}
                options={sorts}
              />
            </div>
          </div>
        </div>
        <div>
          {products?.counts === 0 ? (
            <div className="flex justify-center bg-white p-4">
              <div className="grid grid-rows-1">
                <img alt="" src={emptyImg} />
                <div className="flex justify-center">
                  <span>Chưa có sản phẩm.</span>
                </div>
                <div className="flex justify-center">
                  <Button handleOnClick={() => navigate(`/`)}>
                    Trở về trang chủ
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid flex mb-[20px]"
              columnClassName="my-masonry-grid_column "
            >
              {products?.products?.map((element) => (
                <Product
                  key={element._id}
                  pid={element._id}
                  productData={element}
                />
              ))}
            </Masonry>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <Pagination totalCount={products?.counts} />
      </div>
      <Helmet>
        <title>Tất cả sản phẩm</title>
      </Helmet>
    </div>
  );
};

export default Products;
