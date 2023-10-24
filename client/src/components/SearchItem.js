import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import icons from "../ultils/icons";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import path from "../ultils/path";
import { apiGetProducts, apiGetBrandFromCate } from "../apis";
import useDebounce from "../hooks/useDebounce";

const { BiSolidDownArrow } = icons;

const SearchItem = ({ name, onChoice, changeActiveBox, type = "checkbox" }) => {
  const navigate = useNavigate();

  // Must match with path
  const { category } = useParams();
  const [params] = useSearchParams();

  const [selected, setSelected] = useState([]);

  const [highestPrice, setHighestPrice] = useState();
  const [price, setPrice] = useState({
    from: "",
    to: "",
  });

  const { categories } = useSelector((state) => state.appReducer);

  const handleSelect = (e) => {
    const alreadySelected = selected.find(
      (element) => element === e.target.value
    );
    if (alreadySelected) {
      setSelected((previous) =>
        previous.filter((value) => value !== e.target.value)
      );
    } else {
      setSelected((previous) => [...previous, e.target.value]);
    }
    // changeActiveBox(null);
  };

  const handleReset = () => {
    setSelected([]);

    // Đặt checked của tất cả các input checkbox về false
    setTimeout(() => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }, 10);
  };

  const fetchHighestPrice = async () => {
    const response = await apiGetProducts({ sort: "-price", limit: 1 });
    if (response.success) {
      setHighestPrice(response.products[0].price);
    }
  };

  useEffect(() => {
    let newParam = [];
    for (let i of params.entries()) {
      newParam.push(i);
    }

    const queries = {};
    for (let i of newParam) {
      queries[i[0]] = i[1];
    }

    if (selected.length > 0) {
      queries.category = selected.join(",");
      queries.page = 1;
    } else {
      delete queries.category;
    }
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  }, [selected]);

  useEffect(() => {
    if (type === "input") {
      fetchHighestPrice();
    }
  }, [type]);

  useEffect(() => {
    if (price.from && price.to && price.from > price.to) {
      alert("Nhập lại giá trị");
    }
  }, [price]);

  const debouncePriceFrom = useDebounce(price.from, 1000);
  const debouncePriceTo = useDebounce(price.to, 1000);

  useEffect(() => {
    let newParam = [];
    for (let i of params.entries()) {
      newParam.push(i);
    }
    const queries = {};
    for (let i of newParam) {
      queries[i[0]] = i[1];
    }

    // queries.page = 1;
    if (Number(price.from) > 0) {
      queries.from = price.from;
    } else delete queries.from;
    if (Number(price.to) > 0) {
      queries.to = price.to;
    } else delete queries.to;

    queries.page = 1;
    navigate({
      pathname: `/${category}`,
      search: createSearchParams(queries).toString(),
    });
  }, [debouncePriceFrom, debouncePriceTo]);

  return (
    <div
      className="p-2 border border-[#cfcfcf] flex justify-between items-center relative rounded cursor-pointer"
      onClick={() => changeActiveBox(name)}
    >
      <span className="capitalize">{name}</span>
      <span className="text-[11px] ml-[10px]">
        <BiSolidDownArrow />
      </span>
      {onChoice === name && (
        <>
          <div className="transparent-bg z-10"></div>
          <div className="filter-modal absolute top-[calc(100%+10px)] left-0 p-4 bg-white rounded drop-shadow-4xl z-20 w-[240px] md:w-[450px]">
            {name === "Loại" && (
              <div onClick={(e) => e.stopPropagation()} className="p-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  {categories?.map((element, index) => (
                    <>
                      <input
                        type="checkbox"
                        id={element._id}
                        key={index}
                        value={element?.title}
                        className="hidden"
                        onChange={handleSelect}
                        checked={selected.includes(element?.title)}
                      />
                      <label
                        htmlFor={element._id}
                        className="text-center cursor-pointer p-2 rounded capitalize"
                      >
                        {element?.title}
                      </label>
                    </>
                  ))}
                </div>
                <div className=" items-center flex justify-between mt-[18px]">
                  <span className="whitespace-nowrap">{`${selected.length} đã chọn`}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="text-canClick"
                  >
                    Reset
                  </span>
                </div>
              </div>
            )}
            {type === "input" && (
              <div onClick={(e) => e.stopPropagation()}>
                <div className="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-2 p-2 ">
                  <div className="flex items-center">
                    <label htmlFor="from" className="w-[20%]">
                      Từ
                    </label>
                    <input
                      type="number"
                      id="from"
                      className="form-input w-[80%] md:w-[140px]"
                      value={price.from}
                      onChange={(e) =>
                        setPrice((prev) => ({ ...prev, from: e.target.value }))
                      }
                    ></input>
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="to" className="w-[20%]">
                      Đến
                    </label>
                    <input
                      type="number"
                      id="to"
                      className="form-input w-[80%] md:w-[140px] "
                      value={price.to}
                      onChange={(e) =>
                        setPrice((prev) => ({ ...prev, to: e.target.value }))
                      }
                    ></input>
                  </div>
                </div>
                <div className="grid grid-rows-1 md:grid-cols-2 justify-between mt-[18px]">
                  <span className="whitespace-nowrap">
                    Giá cao nhất: {Number(highestPrice).toLocaleString()}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrice({ from: "", to: "" });
                    }}
                    className="text-canClick text-right"
                  >
                    Đặt lại
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(SearchItem);
