import React, { useState, useEffect } from "react";
import { apiGetProducts } from "../apis/product.js";
import { CountDown, CustomSlider } from "./index.js";
import moment from "moment";
import { timeExchange } from "../ultils/helpers.js";

import { useDispatch, useSelector } from "react-redux";

let idInterval;
const tabs = [
  { id: 1, name: "Daily Deal" },
  { id: 2, name: "Bán chạy" },
  { id: 3, name: "Sản phẩm mới" },
];

const SpecialOffer = () => {
  const [targetTab, setTargetTab] = useState(1);
  const [products, setProducts] = useState(null);

  //Set timer
  const [hours, setHours] = useState(0);
  const [minutes, setminutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [expireTime, setExpireTime] = useState(false);

  //Set product in tab
  const [topSeller, setTopSeller] = useState(null);
  const [dailyDeal, setDailyDeal] = useState(null);

  const dispatch = useDispatch();
  const { justOnSellProducts } = useSelector((state) => state.products);

  //fetch normal offer
  const fetchProduct = async () => {
    const response = await apiGetProducts({ sort: "-sold" });

    if (response.success) {
      setTopSeller(response.products);
      setProducts(response.products);
    }
  };

  //fetch daily deal offer
  const fetchDailyDeal = async () => {
    const response = await apiGetProducts({
      limit: 3,
      page: Math.round(Math.random() * 3),
    });
    if (response.success) {
      setDailyDeal(response.products);

      const today = `${moment().format("MM/DD/YYYY")} 00:00:00`;
      const secs =
        new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000;
      const number = timeExchange(secs);

      setHours(number.h);
      setminutes(number.m);
      setSeconds(number.s);
    } else {
      setHours(0);
      setminutes(59);
      setSeconds(59);
    }
  };

  useEffect(() => {
    idInterval && clearInterval(idInterval);
    fetchDailyDeal();
  }, [expireTime]);

  useEffect(() => {
    idInterval = setInterval(() => {
      if (seconds > 0) setSeconds((prev) => prev - 1);
      else {
        if (minutes > 0) {
          setminutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          if (hours > 0) {
            setHours((prev) => prev - 1);
            setminutes(59);
            setSeconds(59);
          } else {
            setExpireTime(!expireTime);
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(idInterval);
    };
  }, [seconds, minutes, hours, expireTime]);

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (targetTab === 1) setProducts(dailyDeal);
    if (targetTab === 2) setProducts(topSeller);
    if (targetTab === 3) setProducts(justOnSellProducts);
  }, [targetTab, dailyDeal]);

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
            <div className="w-[296px] flex justify-center items-center ">
              <CountDown unit="Giờ" number={hours} />
              <CountDown unit="Phút" number={minutes} />
              <CountDown unit="Giây" number={seconds} />
            </div>
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
