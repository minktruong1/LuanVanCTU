import React, { useCallback, useEffect, useState } from "react";
import {
  apiDeleteCoupon,
  apiGetCoupon,
  apiUpdateCoupon,
} from "../../apis/coupon";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import clsx from "clsx";
import moment from "moment";
import { Button, Pagination, ReactInputForm } from "../../components";
import { formatVND } from "../../ultils/helpers";
import sweetAlert from "sweetalert2";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";

const ManageCoupon = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    name: "",
    code: "",
    quantity: "",
    percentDiscount: "",
    directDiscount: "",
    expire: "",
  });
  const [params] = useSearchParams();
  const [coupons, setCoupons] = useState(null);
  const [couponCount, setCouponCount] = useState(0);
  const [update, setUpdate] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCoupons = async (params) => {
    const response = await apiGetCoupon(params);
    if (response.success) {
      setCoupons(response?.coupons);
      setCouponCount(response?.counts);
    }
  };

  const queryDebounce = useDebounce(watch("query"), 800);

  const reRender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const handleUpdate = async (data) => {
    const response = await apiUpdateCoupon(data, editCoupon._id);
    if (response.success) {
      setEditCoupon(null);
      reRender();
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleDelete = (cid) => {
    sweetAlert
      .fire({
        title: "Xác nhận",
        text: "Bạn chắc chắn muốn xóa mã giảm giá này?",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        confirmButtonText: "Đồng ý",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const response = await apiDeleteCoupon(cid);
          if (response.success) {
            reRender();
            toast.success(response.message);
          } else toast.error(response.message);
        }
      });
  };

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchCoupons({ ...searchParams });
  }, [params, update]);

  useEffect(() => {
    if (editCoupon)
      reset({
        name: editCoupon.name,
        code: editCoupon.code,
        quantity: editCoupon.quantity,
        percentDiscount: editCoupon.percentDiscount,
        directDiscount: editCoupon.directDiscount,
        expire: "",
      });
  }, [editCoupon]);

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

  return (
    <div className="w-full p-4 relative">
      <div className="mt-[60px] w-full flex justify-between items-center text-2xl font-bold px-4 border-b">
        <h1>Quản lý mã giảm giá</h1>
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
      <form onSubmit={handleSubmit(handleUpdate)}>
        <table className="table-auto w-full">
          <thead className="bg-[#362f4b] text-white ">
            <tr>
              <th className="p-4 rounded-tl-md ">#</th>
              <th className="w-[200px]">Tên mã giảm giá</th>
              <th>Code</th>
              <th>Số lượng</th>
              <th>Giảm tiền</th>
              <th>Giảm %</th>
              <th>Ngày tạo</th>
              <th>Ngày hết hạn</th>
              <th className="rounded-tr-md">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-center border-[#362f4b] border ">
            {coupons?.map((element, index) => (
              <>
                <tr
                  key={element._id}
                  className={clsx("", index % 2 === 1 && "bg-[#fff]")}
                >
                  <td className="py-2 px-2">
                    {params.get("page") > 0 &&
                      (params.get("page") - 1) * 10 + index + 1}
                    {!params.get("page") && index + 1}
                  </td>
                  <td className="text-left">{element.name}</td>
                  <td>{element.code}</td>
                  <td>{element.quantity}</td>
                  <td>{`${formatVND(element.directDiscount)}đ`}</td>
                  <td>{`${element.percentDiscount}%`}</td>
                  <td>
                    {moment(element?.createdAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td>{moment(element?.expire).format("YYYY-MM-DD HH:mm")}</td>
                  <td>
                    <span
                      onClick={() => setEditCoupon(element)}
                      className="underline cursor-pointer mr-2 text-canClick"
                    >
                      Sửa
                    </span>
                    <span
                      onClick={() => handleDelete(element._id)}
                      className="underline cursor-pointer text-canClick"
                    >
                      Xóa
                    </span>
                  </td>
                </tr>
                {editCoupon?._id === element?._id && (
                  <>
                    <tr key={element._id}>
                      <td className="py-2 px-2"></td>
                      <td className="py-2 px-2">
                        <span>
                          <ReactInputForm
                            register={register}
                            errors={errors}
                            id={"name"}
                            validate={{
                              required: "Vui lòng nhập",
                            }}
                            defaultValue={editCoupon?.name}
                            fullWidth
                          />
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span>
                          <ReactInputForm
                            register={register}
                            errors={errors}
                            id={"code"}
                            validate={{ required: "Vui lòng nhập" }}
                            defaultValue={editCoupon?.code}
                            fullWidth
                          />
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span>
                          <ReactInputForm
                            register={register}
                            errors={errors}
                            id={"quantity"}
                            validate={{ required: "Vui lòng nhập" }}
                            defaultValue={editCoupon?.quantity}
                            fullWidth
                          />
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span>
                          <ReactInputForm
                            register={register}
                            errors={errors}
                            id={"directDiscount"}
                            defaultValue={editCoupon?.directDiscount}
                            fullWidth
                          />
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span>
                          <ReactInputForm
                            register={register}
                            errors={errors}
                            id={"percentDiscount"}
                            defaultValue={editCoupon?.percentDiscount}
                            fullWidth
                          />
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        {moment(element.createdAt).format("DD/MM/YYYY")}
                      </td>
                      <td className="py-2 px-2">
                        <span>
                          <ReactInputForm
                            register={register}
                            errors={errors}
                            id={"expire"}
                            fullWidth
                          />
                        </span>
                      </td>
                    </tr>
                    <tr className="border">
                      <td></td>
                      <td className="">
                        <span
                          onClick={() => setEditCoupon(null)}
                          className="mr-[16px] underline text-canClick cursor-pointer"
                        >
                          Trở về
                        </span>
                        {editCoupon && <Button type="submit">Cập nhật</Button>}
                      </td>
                    </tr>
                  </>
                )}
              </>
            ))}
          </tbody>
        </table>
        <div className="w-full flex justify-center mt-4">
          <Pagination totalCount={couponCount} />
        </div>
      </form>
    </div>
  );
};

export default ManageCoupon;
