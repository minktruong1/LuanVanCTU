import clsx from "clsx";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { formatVND } from "../../ultils/helpers";
import { apiDeleteProductPurchaseInfo } from "../../apis";
import { toast } from "react-toastify";
import sweetAlert from "sweetalert2";
import { useDispatch } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import { Loading } from "../../components";

const UpdatePurchaseInfo = ({ editTab, setEditTab, render }) => {
  const dispatch = useDispatch();

  const [params] = useSearchParams();

  const handleDelete = async (purid, pid) => {
    console.log(purid);
    console.log(pid);
    sweetAlert
      .fire({
        title: "Xác nhận",
        text: "Bạn muốn xóa sản phẩm này?",
        showCancelButton: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
          const response = await apiDeleteProductPurchaseInfo({
            purchaseInfoId: purid,
            productId: pid,
          });
          dispatch(showModal({ isShowModal: false, modalContent: null }));

          if (response.success) {
            render();
            setEditTab(null);
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        }
      });
  };

  return (
    <div className="w-full p-4">
      <div className="mt-[60px] text-lg">
        <span
          onClick={() => setEditTab(null)}
          className="underline text-canClick flex items-center cursor-pointer"
        >
          <MdArrowBackIosNew />
          Trở về
        </span>
      </div>
      <div className="md:p-4">
        <div className={clsx(" md:w-full", editTab ? "" : "w-[1000px]")}>
          <table className="table-auto w-full">
            <thead className="bg-[#362f4b] text-white ">
              <tr>
                <th className="p-4 rounded-tl-md ">#</th>
                <th className=" w-[400px]">Danh sách sản phẩm</th>
                <th>Loại</th>
                <th>Hãng</th>
                <th>Số lượng</th>
                <th>Giá nhập</th>
                <th className="rounded-tr-md">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-center border-[#362f4b] border ">
              {editTab?.productList?.map((element, index) => (
                <tr
                  key={element._id}
                  className={clsx("", index % 2 === 1 && "bg-[#fff]")}
                >
                  <td>
                    {params.get("page") > 0 &&
                      (params.get("page") - 1) * 10 + index + 1}
                    {!params.get("page") && index + 1}
                  </td>
                  <td className="text-left flex items-center">
                    <img
                      src={element.images[0]}
                      alt=""
                      className="w-[80px] h-[80px] border"
                    />
                    {element.title}
                  </td>
                  <td>{element.category}</td>
                  <td>{element.brand}</td>
                  <td>{element.quantity}</td>
                  <td>{`${formatVND(element.buyInPrice)}đ`}</td>
                  <td>
                    <span
                      onClick={() => handleDelete(editTab._id, element.product)}
                      className="text-canClick underline cursor-pointer"
                    >
                      Xóa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpdatePurchaseInfo;
