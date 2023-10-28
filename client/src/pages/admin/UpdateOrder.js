import React, { useEffect } from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { formatVND } from "../../ultils/helpers";
import { AdminSelector, Button, ReactInputForm } from "../../components";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiAdminUpdateOrderStatus } from "../../apis";

const status = [
  { id: 1, text: "Đang xử lý", value: "Process" },
  { id: 2, text: "Vận chuyển", value: "Shipping" },
  { id: 3, text: "Hủy", value: "Cancelled" },
  { id: 4, text: "Hoàn thành", value: "Done" },
];

const UpdateOrder = ({ editOrderTab, setEditOrderTab, render }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const handleUpdateOrder = async (data) => {
    const response = await apiAdminUpdateOrderStatus(editOrderTab?._id, {
      status: data.status,
    });
    if (response.success) {
      toast.success(response.message);
      console.log("yesh");
      render();
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    reset({
      status: editOrderTab?.status || "",
    });
  }, []);

  return (
    <div className="w-full p-4">
      <div className="mt-[60px] text-lg">
        <span
          onClick={() => setEditOrderTab(null)}
          className="underline text-canClick flex items-center cursor-pointer"
        >
          <MdArrowBackIosNew />
          Trở về
        </span>
      </div>
      <div className="w-full bg-white rounded p-4">
        <div className="grid grid-rows-1">
          <h1 className="text-xl font-medium">
            Chi tiết đơn hàng {editOrderTab._id}
          </h1>
          <div className="grid grid-cols-8">
            <span className="col-span-1 text-[#6d6e72]">Tên người nhận:</span>
            <span className="col-span-7 font-semibold">{`${editOrderTab.buyer.firstName} ${editOrderTab.buyer?.lastName}`}</span>
          </div>
          <div className="grid grid-cols-8">
            <span className="col-span-1 text-[#6d6e72]">Địa chỉ:</span>
            <span className="col-span-7 font-semibold">
              <span>{editOrderTab?.address}</span>
            </span>
          </div>
          <div className="grid grid-cols-8">
            <span className="col-span-1 text-[#6d6e72]">Số điện thoại:</span>
            <span className="col-span-7 font-semibold">
              {editOrderTab.buyer?.mobile}
            </span>
          </div>

          <div className="grid grid-rows-1">
            <div className="grid grid-cols-10 my-6 font-semibold">
              <div className="col-span-4">
                <span>Sản phẩm</span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span>Đơn giá</span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span>Số lượng</span>
              </div>
              <div className="col-span-2 flex justify-end">
                <span>Thành tiền</span>
              </div>
            </div>

            {editOrderTab?.productList?.map((element) => (
              <div className="grid grid-cols-10">
                <div className="col-span-4 flex ">
                  <span>{element.title}</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span>{`${formatVND(element.price)}`}đ</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span>{element.quantity}</span>
                </div>
                <div className="col-span-2 flex justify-end">
                  <span>
                    {`${formatVND(element.price * element.quantity)}đ`}
                  </span>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-10 my-6 font-semibold">
              <div className="col-span-4">
                <span></span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span></span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span></span>
              </div>
              <div className="col-span-2 flex justify-end">
                <span>
                  Tổng tiền:
                  {`${formatVND(editOrderTab?.totalPrice)}đ`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white rounded mt-4">
        <div className="grid grid-rows-1">
          <form onSubmit={handleSubmit(handleUpdateOrder)}>
            <AdminSelector
              label="Cập nhật trạng thái"
              options={status?.map((element) => ({
                text: element.text,
                value: element.value,
              }))}
              register={register}
              id="status"
              validate={{ required: "Vui lòng nhập" }}
              errors={errors}
            />
            <div className="mt-8">
              <Button type="submit">Lưu</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
