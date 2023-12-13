import React, { useEffect, useState } from "react";
import { apiAdminGetUserOrders, apiAllOrderForCount } from "../../apis";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import clsx from "clsx";
import moment from "moment";
import { formatVND } from "../../ultils/helpers";
import { Pagination, ReactInputForm } from "../../components";
import { BsFillWalletFill } from "react-icons/bs";
import { TbTruckLoading } from "react-icons/tb";

import { MdOutlineDownloadDone } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import UpdateOrder from "./UpdateOrder";
import { useForm } from "react-hook-form";
import useDebounce from "../../hooks/useDebounce";

const ManageOrders = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const [params] = useSearchParams();
  const [orders, setOrders] = useState(null);
  const [orderCount, setOrderCount] = useState(0);

  const [collect, setCollect] = useState(null);
  const [done, setDone] = useState(null);
  const [process, setProcess] = useState(null);
  const [ship, setShip] = useState(null);
  const [cancel, setCancel] = useState(null);

  const [calculated, setCalculated] = useState(false);
  const [editOrderTab, setEditOrderTab] = useState(null);

  const queryDebounce = useDebounce(watch("query"), 800);

  const fetchOrders = async (params) => {
    const response = await apiAdminGetUserOrders(params);
    if (response.success) {
      setOrders(response?.orders);
      setOrderCount(response?.counts);
    }
  };

  const fetchForOrdersCount = async () => {
    const response = await apiAllOrderForCount();
    if (response.success) {
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
        response?.orders.filter((order) => order?.status === "Đang vận chuyển")
          ?.length
      );
    }
  };

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
    const searchParams = Object.fromEntries([...params]);
    fetchOrders({ ...searchParams, sort: "-createdAt" });
    fetchForOrdersCount();
  }, [params, editOrderTab]);

  return (
    <div className="w-full p-4 relative overflow-auto min-h-screen">
      {editOrderTab && (
        <div className="absolute inset-0 min-h-screen bg-webBackground z-20 w-[1300px] md:w-full">
          <UpdateOrder
            editOrderTab={editOrderTab}
            setEditOrderTab={setEditOrderTab}
          />
        </div>
      )}
      <div className="mt-[60px] w-full flex justify-between items-center text-2xl font-bold px-4 border-b bg-webBackground">
        <h1>Quản lý đơn hàng</h1>
      </div>
      <div className="grid grid-cols-5 my-4 w-[1000px] md:w-full">
        <div
          onClick={() => navigate(`?`)}
          className="grid grid-rows-1 border p-4 rounded bg-white cursor-pointer hover:shadow-2xl"
        >
          <div className="flex justify-between">
            <span className="text-lg">Tổng cộng</span>
            <span className="flex items-center justify-end">
              <span className="p-2 rounded bg-[#362f4b] ">
                <BsFillWalletFill color="white" />
              </span>
            </span>
          </div>
          <span className="text-xl font-medium">{collect}</span>
        </div>
        <div
          onClick={() => navigate(`?status=Đang+xử+lý`)}
          className="grid grid-rows-1 border p-4 rounded bg-white cursor-pointer hover:shadow-2xl"
        >
          <div className="flex justify-between">
            <span className="text-lg">Cần xử lý</span>
            <span className="flex items-center justify-end">
              <span className="p-2 rounded bg-[#362f4b] ">
                <TbTruckLoading color="white" />
              </span>
            </span>
          </div>
          <span className="text-xl font-medium">{process}</span>
        </div>
        <div
          onClick={() => navigate(`?status=Hoàn+thành`)}
          className="grid grid-rows-1 border p-4 rounded bg-white cursor-pointer hover:shadow-2xl"
        >
          <div className="flex justify-between">
            <span className="text-lg">Hoàn thành</span>
            <span className="flex items-center justify-end">
              <span className="p-2 rounded bg-[#362f4b] ">
                <MdOutlineDownloadDone color="white" />
              </span>
            </span>
          </div>
          <span className="text-xl font-medium">{done}</span>
        </div>

        <div
          onClick={() => navigate(`?status=Đang+vận+chuyển`)}
          className="grid grid-rows-1 border p-4 rounded bg-white cursor-pointer hover:shadow-2xl"
        >
          <div className="flex justify-between">
            <span className="text-lg">Vận chuyển</span>
            <span className="flex items-center justify-end">
              <span className="p-2 rounded bg-[#362f4b] ">
                <FaShippingFast color="white" />
              </span>
            </span>
          </div>
          <span className="text-xl font-medium">{ship}</span>
        </div>
        <div
          onClick={() => navigate(`?status=Hủy`)}
          className="grid grid-rows-1 border p-4 rounded bg-white cursor-pointer hover:shadow-2xl"
        >
          <div className="flex justify-between">
            <span className="text-lg">Hủy</span>
            <span className="flex items-center justify-end">
              <span className="p-2 rounded bg-[#362f4b] ">
                <GiCancel color="white" />
              </span>
            </span>
          </div>
          <span className="text-xl font-medium">{cancel}</span>
        </div>
      </div>
      <form className="w-[40%] py-4">
        <ReactInputForm
          id="query"
          register={register}
          errors={errors}
          fullWidth
          placeholder="Tìm kiếm đơn hàng"
        />
      </form>
      <div className="w-[1200px] md:w-full">
        <table className="table-auto w-full">
          <thead className="bg-[#362f4b] text-white ">
            <tr>
              <th className="p-4 rounded-tl-md ">#</th>
              <th>Ngày đặt</th>
              <th>Tên người nhận</th>
              <th>SĐT</th>
              <th>Địa chỉ</th>
              <th>Thanh toán</th>
              <th>Mã giảm giá áp dụng</th>
              <th>Lợi nhuận</th>
              <th>Phương thức thanh toán</th>
              <th>Trạng thái</th>
              <th className="rounded-tr-md">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-center border-[#362f4b] border ">
            {orders?.map((element, index) => (
              <tr
                key={element._id}
                className={clsx("", index % 2 === 1 && "bg-[#fff]")}
              >
                <td className="h-[40px]">
                  {params.get("page") > 0 &&
                    (params.get("page") - 1) * 10 + index + 1}
                  {!params.get("page") && index + 1}
                </td>
                <td>{moment(element?.createdAt).format("DD-MM-YYYY HH:mm")}</td>
                <td>
                  {`${element?.buyer?.firstName} ${element?.buyer?.lastName}`}
                </td>
                <td>{element?.buyer.mobile}</td>
                <td>{element?.address}</td>
                <td>{`${formatVND(element?.lastPrice)}đ`}</td>
                <td>{element?.couponApply?.code}</td>
                <td>{`${formatVND(element?.profit)}đ`}</td>
                <td>{element?.method}</td>
                <td>{element?.status}</td>
                <td>
                  <span
                    onClick={() => setEditOrderTab(element)}
                    className="text-canClick underline cursor-pointer"
                  >
                    Xử lý
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full flex justify-center mt-4">
          <Pagination totalCount={orderCount} />
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
