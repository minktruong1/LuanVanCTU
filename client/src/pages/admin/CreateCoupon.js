import React from "react";
import { Button, ReactInputForm } from "../../components";
import { useForm } from "react-hook-form";
import { apiCreateCoupon } from "../../apis/coupon";
import { toast } from "react-toastify";

const CreateCoupon = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const handleCreateCoupon = async (data) => {
    const response = await apiCreateCoupon(data);
    if (response.success) {
      toast.success(response.message);
      reset();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="w-full">
      <div className="p-4 mt-[60px]">
        <form onSubmit={handleSubmit(handleCreateCoupon)}>
          <div className="grid grid-rows-1 gap-[50px]">
            <div className="w-full grid grid-cols-2 gap-4">
              <ReactInputForm
                label="Tên mã giảm giá"
                register={register}
                errors={errors}
                id="name"
                validate={{
                  required: "Vui lòng nhập",
                }}
                fullWidth
                placeholder="Tên của mã giảm giá"
              />
              <ReactInputForm
                label="Code"
                register={register}
                errors={errors}
                id="code"
                validate={{
                  required: "Vui lòng nhập",
                }}
                fullWidth
                placeholder="Code của mã giảm giá"
              />
            </div>
            <div className="w-full grid grid-cols-2 gap-4">
              <ReactInputForm
                label="Số lượng"
                register={register}
                errors={errors}
                id="quantity"
                validate={{
                  required: "Vui lòng nhập",
                }}
                fullWidth
                placeholder="Số lượng mã giảm giá"
              />
              <ReactInputForm
                label="Ngày sử dụng"
                register={register}
                errors={errors}
                id="expire"
                validate={{
                  required: "Vui lòng nhập",
                }}
                fullWidth
                placeholder="Số ngày dùng"
              />
            </div>
            <div className="w-full grid grid-cols-2 gap-4">
              <ReactInputForm
                label="Giảm trực tiếp"
                register={register}
                errors={errors}
                id="directDiscount"
                validate={{
                  required: "Vui lòng nhập",
                }}
                fullWidth
                placeholder="Số tiền trừ trực tiếp"
              />
              <ReactInputForm
                label="Giảm trực phần trăm"
                register={register}
                errors={errors}
                id="percentDiscount"
                validate={{
                  required: "Vui lòng nhập",
                }}
                fullWidth
                placeholder="Số % trừ "
              />
            </div>
          </div>

          <div className="mt-[50px]">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoupon;
