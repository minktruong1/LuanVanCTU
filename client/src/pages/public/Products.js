import React, { useCallback, useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import {
  Breadcrumb,
  InputSelector,
  Product,
  SearchItem,
} from "../../components";
import { apiGetProducts } from "../../apis";
import Masonry from "react-masonry-css";
import { sorts } from "../../ultils/contants";

const breakpointColumnsObj = {
  default: 5,
  1100: 3,
  700: 2,
  500: 1,
};

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [activeBox, setActiveBox] = useState(null);
  const [sort, setSort] = useState("");
  const [params] = useSearchParams();

  const fetchProductByCate = async (queries) => {
    const response = await apiGetProducts(queries);
    if (response.success) {
      setProducts(response.products);
    }
  };

  const { category } = useParams();

  useEffect(() => {
    let newParam = [];
    for (let i of params.entries()) {
      newParam.push(i);
    }
    const queries = {};
    for (let i of params) {
      queries[i[0]] = i[1];
    }

    let priceFilterQuery = {};
    if (queries.from && queries.to) {
      priceFilterQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      };
      delete queries.price;
    }

    if (queries.from) {
      queries.price = { gte: queries.from };
    }
    if (queries.to) {
      queries.price = { lte: queries.to };
    }
    delete queries.from;
    delete queries.to;

    console.log(queries);
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
    },
    [sort]
  );

  useEffect(() => {
    navigate({
      pathname: `/${category}`,
      search: createSearchParams({ sort }).toString(),
    });
  }, [sort]);

  return (
    <div className="w-full">
      <div className="pt-[18px] pb-[18px]">
        <Breadcrumb category={category} />
      </div>
      <div className="bg-white w-main rounded mb-[14px]">
        <div className="p-[24px] flex-auto flex items-center gap-4">
          <SearchItem
            name="Giá"
            onChoice={activeBox}
            changeActiveBox={changeActiveBox}
            type="input"
          />
          <SearchItem
            name="Loại"
            onChoice={activeBox}
            changeActiveBox={changeActiveBox}
          />
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
        <div className="">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid flex mb-[20px]"
            columnClassName="my-masonry-grid_column "
          >
            {products?.map((element) => (
              <Product
                key={element._id}
                pid={element.id}
                productData={element}
              />
            ))}
          </Masonry>
        </div>
      </div>
    </div>
  );
};

export default Products;
