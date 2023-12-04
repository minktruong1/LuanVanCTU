import React, { useCallback, useEffect, useState } from "react";
import { apiGetAllPurchaseInfo } from "../../apis";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { Pagination, ReactInputForm } from "../../components";
import clsx from "clsx";
import moment from "moment";
import useDebounce from "../../hooks/useDebounce";
import { formatVND } from "../../ultils/helpers";
import UpdatePurchaseInfo from "./UpdatePurchaseInfo";

const ManagePurchaseInfo = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState(null);
  const [count, setCount] = useState(0);
  const [editTab, setEditTab] = useState(null);
  const [update, setUpdate] = useState(false);

  const queryDebounce = useDebounce(watch("query"), 800);

  const fetchData = async (params) => {
    const response = await apiGetAllPurchaseInfo({
      ...params,
      sort: "-createdAt",
    });
    if (response.success) {
      setData(response.purchaseInfoData);
      setCount(response.counts);
    }
  };

  const render = useCallback(() => {
    setUpdate(!update);
  });

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
  }, [queryDebounce, update]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchData({ ...searchParams });
  }, [params, editTab]);

  console.log(data);

  return (
    <div className="w-full p-4 relative overflow-auto h-full">
      {editTab && (
        <div className="absolute inset-0 min-h-screen bg-webBackground z-20  md:w-full">
          <UpdatePurchaseInfo
            editTab={editTab}
            setEditTab={setEditTab}
            render={render}
          />
        </div>
      )}
      <div className="mt-[60px] w-full flex justify-between items-center text-2xl font-bold px-4 border-b">
        <h1>Quản lý phiếu nhập</h1>
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
      <div className={clsx(" md:w-full", editTab ? "" : "w-[1000px]")}>
        <table className="table-auto w-full">
          <thead className="bg-[#362f4b] text-white ">
            <tr>
              <th className="p-4 rounded-tl-md ">#</th>
              <th className=" w-[400px]">Tên phiếu nhập</th>
              <th>Số lượng sản phẩm</th>
              <th>Tổng số tiền chi trả</th>
              <th>Ngày nhập</th>
              <th className="rounded-tr-md">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-center border-[#362f4b] border ">
            {data?.map((element, index) => (
              <tr
                key={element._id}
                className={clsx("", index % 2 === 1 && "bg-[#fff]")}
              >
                <td>
                  {params.get("page") > 0 &&
                    (params.get("page") - 1) * 10 + index + 1}
                  {!params.get("page") && index + 1}
                </td>
                <td className="text-left">{element.title}</td>
                <td>{element.productCount}</td>
                <td>{`${formatVND(element?.totalPay)}đ`}</td>
                <td>{moment(element?.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                <td>
                  <span
                    onClick={() => setEditTab(element)}
                    className="text-canClick underline cursor-pointer"
                  >
                    Xem chi tiết
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full flex justify-center mt-4">
          <Pagination totalCount={count} />
        </div>
      </div>
    </div>
  );
};

export default ManagePurchaseInfo;
