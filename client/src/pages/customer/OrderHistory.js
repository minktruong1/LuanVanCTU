import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetUserOrders } from "../../apis";
import clsx from "clsx";
import { BiSearch } from "react-icons/bi";
import emptyImg from "../../assets/no-data.png";
import { Button } from "../../components";

const tabs = [
  { id: 1, name: "Tất cả" },
  { id: 2, name: "Đang xử lý" },
  { id: 3, name: "Đang vận chuyển" },
  { id: 4, name: "Hoàn thành" },
  { id: 5, name: "Hủy" },
];

const OrderHistory = () => {
  const [targetTab, setTargetTab] = useState(1);
  const [orders, setOrders] = useState(null);

  //Set order by type
  const [process, setProcess] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [cancel, setCancel] = useState(null);
  const [done, setDone] = useState(null);

  const { isLogin, currentData } = useSelector((state) => state.user);

  const fetchOrderList = async () => {
    const response = await apiGetUserOrders();
    if (response.success) {
      setOrders(response.userOrder);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  useEffect(() => {
    if (targetTab === 1) setOrders(orders);
    if (targetTab === 2) setOrders(process);
    if (targetTab === 3) setOrders(shipping);
    if (targetTab === 4) setOrders(cancel);
    if (targetTab === 5) setOrders(done);
  }, [targetTab]);

  console.log(orders);

  return (
    <div className="w-full bg-white rounded min-h-[500px]">
      <h1 className="text-[24px] p-4">Quản lý đơn hàng</h1>
      <div className="grid grid-cols-5  ">
        {tabs.map((element) => (
          <div
            key={element.id}
            className={`pb-2 flex  justify-center cursor-pointer font-medium ${
              targetTab === element.id ? "border-b-2 border-main" : ""
            }`}
            onClick={() => setTargetTab(element.id)}
          >
            {element.name}
          </div>
        ))}
      </div>

      <div className="py-4 bg-webBackground ">
        <form className="flex h-[40px] relative w-full">
          <span className="absolute top-0 left-[12px] py-[10px]">
            <BiSearch size={20} />
          </span>
          <input
            maxLength={40}
            className="pl-[42px] focus:outline-none h-[40px] w-full"
          />
          <button className="px-4 bg-white border-l">
            <span className="w-auto  whitespace-nowrap text-canClick">
              Tìm đơn hàng
            </span>
          </button>
        </form>
      </div>

      {orders?.length === 0 ? (
        <div className="flex justify-center p-4">
          <div className="grid grid-rows-1">
            <img alt="" src={emptyImg} />
            <div className="flex justify-center">
              <span>Quý khách chưa có đơn hàng nào.</span>
            </div>
            <div className="flex justify-center">
              <Button>Tiếp tục mua hàng</Button>
            </div>
          </div>
        </div>
      ) : (
        <div>order</div>
      )}
    </div>
  );
};

export default OrderHistory;
