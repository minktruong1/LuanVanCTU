import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetUserOrders, apiUpdateOrderStatus } from "../../apis";
import clsx from "clsx";
import { BiSearch } from "react-icons/bi";
import emptyImg from "../../assets/no-data.png";
import { Button, ReactInputForm } from "../../components";
import { formatVND } from "../../ultils/helpers";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import sweetAlert from "sweetalert2";
import { useForm } from "react-hook-form";
import useDebounce from "../../hooks/useDebounce";

const tabs = [
  { id: 1, name: "Tất cả" },
  { id: 2, name: "Đang xử lý", param: "Đang xử lý" },
  { id: 3, name: "Đang vận chuyển", param: "Đang vận chuyển" },
  { id: 4, name: "Hoàn thành", param: "Hoàn thành" },
  { id: 5, name: "Hủy", param: "Hủy" },
];

const OrderHistory = () => {
  const {
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();

  const [orders, setOrders] = useState(null);

  const [targetTab, setTargetTab] = useState(1);
  const [collect, setCollect] = useState(null);
  const [done, setDone] = useState(null);
  const [process, setProcess] = useState(null);
  const [ship, setShip] = useState(null);
  const [cancel, setCancel] = useState(null);
  const [calculated, setCalculated] = useState(false);
  const [update, setUpdate] = useState(false);

  const reRender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const fetchOrderList = async (params) => {
    const response = await apiGetUserOrders(params);
    if (response.success) {
      setOrders(response.orders);
      if (!calculated) {
        setCollect(response?.counts);
        setCancel(
          response?.orders?.filter((order) => order?.status === "Hủy").length
        );
        setDone(
          response?.orders?.filter((order) => order?.status === "Hoàn thành")
            ?.length
        );
        setProcess(
          response?.orders?.filter((order) => order?.status === "Đang xử lý")
            ?.length
        );
        setShip(
          response?.orders.filter(
            (order) => order?.status === "Đang vận chuyển"
          )?.length
        );
        setCalculated(true);
      }
    }
  };

  const handleChangeTab = (element) => {
    setTargetTab(element.id);
    if (element.id === 1) {
      navigate(`?`);
    } else {
      navigate(`?status=${element.param}`);
    }
  };

  const handleCancel = async (order) => {
    return sweetAlert
      .fire({
        title: "Xác nhận",
        text: "Bạn chắc chắn muốn xóa?",
        icon: "info",
        cancelButtonText: "Trở lại",
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
      })
      .then(async (rs) => {
        if (rs.isConfirmed) {
          const response = await apiUpdateOrderStatus(order._id, {
            status: "Hủy",
          });
          if (response.success) {
            toast.success(response.message);
            reRender();
          } else {
            toast.error(response.message);
          }
        }
      });
  };

  const handleConfirm = async (order) => {
    return sweetAlert
      .fire({
        title: "Xác nhận",
        text: "Bạn đã nhận được sản phẩm?",
        icon: "info",
        cancelButtonText: "Trở lại",
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
      })
      .then(async (rs) => {
        if (rs.isConfirmed) {
          const response = await apiUpdateOrderStatus(order._id, {
            status: "Hoàn thành",
          });
          if (response.success) {
            toast.success(response.message);
            reRender();
          } else {
            toast.error(response.message);
          }
        }
      });
  };
  const queryDebounce = useDebounce(watch("query"), 800);

  useEffect(() => {
    if (queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ query: queryDebounce }).toString(),
      });
    } else {
      navigate({
        pathname: location.pathname,
      });
    }
  }, [queryDebounce]);

  useEffect(() => {
    if (params.get("status")) {
      reset({
        query: "",
      });
    }
    if (params.get("query")) {
      setTargetTab(1);
    }
    const searchParams = Object.fromEntries([...params]);
    fetchOrderList({ ...searchParams });
  }, [params, update]);

  return (
    <>
      <div className="w-full bg-white rounded">
        <h1 className="text-[24px] p-4">Quản lý đơn hàng</h1>
        <div className="md:grid grid-cols-5 hidden">
          {tabs?.map((element) => (
            <div
              onClick={() => handleChangeTab(element)}
              key={element.id}
              className={clsx(
                "pb-2 flex  justify-center cursor-pointer font-medium",
                targetTab === element.id ? "border-b-2 border-main" : ""
              )}
            >
              {element.name}
            </div>
          ))}
        </div>

        <div className="md:hidden flex border-b whitespace-nowrap overflow-x-scroll overflow-y-hidden">
          {tabs?.map((element) => (
            <div
              onClick={() => handleChangeTab(element)}
              key={element.id}
              className={clsx(
                "pb-2 flex justify-center cursor-pointer font-medium px-4",
                targetTab === element.id ? "border-b-2 border-main" : ""
              )}
            >
              {element.name}
            </div>
          ))}
        </div>

        <div className="py-4 bg-webBackground ">
          <form className="flex h-[40px] w-full">
            <ReactInputForm
              id="query"
              register={register}
              errors={errors}
              fullWidth
              placeholder="Tìm kiếm đơn hàng"
            />
            <button className="px-4 bg-white border-l">
              <span className="w-auto  whitespace-nowrap text-canClick">
                Tìm đơn hàng
              </span>
            </button>
          </form>
        </div>
      </div>
      <div className=" ">
        {orders?.length === 0 ? (
          <div className="flex justify-center bg-white p-4">
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
              <div key={order._id} className="mb-[24px] bg-white p-4">
                <div className="grid grid-cols-2">
                  <div className="">
                    <span>{`Mã số: ${order?._id}`}</span>
                  </div>
                  <div className="text-right">
                    <span>{order?.status}</span>
                  </div>
                </div>
                <div key={order._id} className="grid grid-rows-1 ">
                  {order?.productList?.map((productItem) => (
                    <div
                      key={productItem?._id}
                      className="grid grid-cols-10 py-2"
                    >
                      <div className="col-span-2 md:col-span-1">
                        <img
                          alt=""
                          src={productItem?.images[0]}
                          className="w-[84px] border"
                        />
                      </div>
                      <div className="col-span-6 md:col-span-8">
                        <div className="grid grid-rows-1">
                          <span className="truncate">{productItem?.title}</span>
                          <span>x{productItem?.quantity}</span>
                        </div>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <span className="text-main">{`${formatVND(
                          productItem?.price
                        )}đ`}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <div>
                    {order?.status === "Đang xử lý" && (
                      <div
                        onClick={() => handleCancel(order)}
                        className="text-canClick underline cursor-pointer px-3"
                      >
                        Hủy
                      </div>
                    )}
                    {order?.status === "Đang vận chuyển" && (
                      <div
                        onClick={() => handleConfirm(order)}
                        className="bg-main text-white cursor-pointer px-2 py-2"
                      >
                        Đã nhận được hàng
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">Tổng cộng: </span>
                    <span className="text-base md:text-2xl text-main">
                      {`${formatVND(order?.totalPrice)}đ`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
