import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetUserOrders } from "../../apis";
import clsx from "clsx";
import { BiSearch } from "react-icons/bi";
import emptyImg from "../../assets/no-data.png";
import { Button } from "../../components";
import { formatVND } from "../../ultils/helpers";

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
  const [all, setAll] = useState(null);
  const [process, setProcess] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [cancel, setCancel] = useState(null);
  const [done, setDone] = useState(null);

  const { isLogin, currentData } = useSelector((state) => state.user);

  const fetchOrderList = async () => {
    const response = await apiGetUserOrders();
    if (response.success) {
      setOrders(response.userOrder);
      setAll(response.userOrder);
      // setProcess();
      // setShipping();
      // setCancel();
      // setDone();
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  useEffect(() => {
    if (targetTab === 1) setOrders(all);
    if (targetTab === 2) setOrders(process);
    if (targetTab === 3) setOrders(shipping);
    if (targetTab === 4) setOrders(cancel);
    if (targetTab === 5) setOrders(done);
  }, [targetTab]);

  return (
    <div className="w-full bg-white rounded min-h-[500px]">
      <h1 className="text-[24px] p-4">Quản lý đơn hàng</h1>
      <div className="grid grid-cols-5  ">
        {tabs?.map((element) => (
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
      <div className="p-4">
        {orders?.length === 0 ? (
          <div className="flex justify-center ">
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
          <>
            {orders?.map((order) => (
              <div key={order._id} className="mb-[24px]">
                <div className="flex justify-between border-b mb-4">
                  <div>
                    <span>{`Đơn hàng mã số: ${order?._id}`}</span>
                  </div>
                  <div>
                    <span>{`Tình trạng: ${order?.status}`}</span>
                  </div>
                </div>
                <div key={order._id} className="grid grid-rows-1 ">
                  {order?.productList?.map((productItem) => (
                    <div
                      key={productItem?._id}
                      className="grid grid-cols-10 border-b py-2"
                    >
                      <div className="col-span-1">
                        <img
                          alt=""
                          src={productItem?.product?.images[0]}
                          className="w-[84px] border"
                        />
                      </div>
                      <div className="col-span-8">
                        <div className="grid grid-rows-1">
                          <span>{productItem?.product?.title}</span>
                          <span>x{productItem?.quantity}</span>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <span className="text-main">{`${formatVND(
                          productItem?.price
                        )}đ`}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <div></div>
                  <div className="flex items-center">
                    <span className="mr-1">Tổng cộng: </span>
                    <span className="text-2xl text-main">
                      {`${formatVND(order?.totalPrice * 23000)}đ`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
