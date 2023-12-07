import React, { useState, useEffect } from "react";
import { apiGetProducts } from "../apis/product.js";
import { CountDown, CustomSlider } from "./index.js";
import moment from "moment";
import { timeExchange } from "../ultils/helpers.js";

import { useDispatch, useSelector } from "react-redux";

const tabs = [
  { id: 1, name: "Bán chạy" },
  { id: 2, name: "Sản phẩm mới" },
];

const SpecialOffer = () => {
  const [targetTab, setTargetTab] = useState(1);
  const [products, setProducts] = useState(null);

  //Set product in tab
  const [topSeller, setTopSeller] = useState(null);

  const { justOnSellProducts } = useSelector((state) => state.products);

  //fetch normal offer
  const fetchProduct = async () => {
    const response = await apiGetProducts({ sort: "-sold" });

    if (response.success) {
      setTopSeller(response.products);
      setProducts(response.products);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (targetTab === 1) setProducts(topSeller);
    if (targetTab === 2) setProducts(justOnSellProducts);
  }, [targetTab]);

  return (
    <>
      <div className="flex text-[20px] gap-8 pt-8 pb-8 h-[440px]">
        <div className="bg-hotDealImg w-full bg-cover ">
          <div className="flex flex-row place-content-around">
            {tabs.map((element) => (
              <span
                key={element.id}
                className={`w-full py-4 flex justify-center items-center cursor-pointer font-medium text-xl bg-white ${
                  targetTab === element.id ? "bg-opacity-0 text-white" : ""
                }`}
                onClick={() => setTargetTab(element.id)}
              >
                {element.name}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-row w-full">
            <div className="w-[296px] flex justify-center items-center "></div>
            <div className="flex-1 w-min-[500px] w-[200px]">
              <CustomSlider products={products} targetTab={targetTab} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialOffer;
