import React, { useEffect, useState } from "react";
import { Button, ReactInputForm } from "../../components";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { apiUpdateUserByUser } from "../../apis";
import { apiGetCurrentAccount } from "../../store/users/asyncActions";
import { toast } from "react-toastify";

const Profile = () => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const { currentData } = useSelector((state) => state.user);

  const [updateUserAddress, setUpdateUserAddress] = useState(false);

  useEffect(() => {
    reset({
      firstName: currentData?.firstName,
      lastName: currentData?.lastName,
      email: currentData?.email,
      mobile: currentData?.mobile,
      avatar: currentData?.avatar,
      address: currentData?.address,
    });
  }, [currentData]);

  const handleUpdateProfile = async (data) => {
    setUpdateUserAddress(false);
    const formData = new FormData();
    if (data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }
    delete data.avatar;
    for (let i of Object.entries(data)) formData.append(i[0], i[1]);

    const response = await apiUpdateUserByUser(formData);
    if (response.success) {
      dispatch(apiGetCurrentAccount());
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleUpdateAddress = () => {
    setUpdateUserAddress(!updateUserAddress);
    if (updateUserAddress === true) {
      reset({
        address: currentData?.address,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpdateProfile)}
      className="w-full bg-white rounded"
    >
      <div className="p-[16px] text-[24px] font-medium flex justify-between">
        <h1>Thông tin tài khoản</h1>
        <div className="flex">
          <label
            htmlFor="file"
            className="text-canClick text-sm cursor-pointer"
          >
            Đổi ảnh đại diện
          </label>
          <input type="file" id="file" hidden {...register("avatar")} />
        </div>
      </div>
      <div className="p-[16px] flex flex-col max-w-[580px]">
        <div className="flex items-center mb-4">
          <label className="flex-3 text-right">Họ</label>
          <div className="flex-7 ml-8">
            <ReactInputForm
              register={register}
              errors={errors}
              id="firstName"
              validate={{
                required: "Vui lòng nhập",
              }}
              fullWidth
              placeholder="Họ người dùng"
            />
          </div>
        </div>
        <div className="flex items-center mb-4">
          <label className="flex-3 text-right">Tên</label>
          <div className="flex-7 ml-8">
            <ReactInputForm
              register={register}
              errors={errors}
              id="lastName"
              validate={{
                required: "Vui lòng nhập",
              }}
              fullWidth
              placeholder="Tên người dùng"
            />
          </div>
        </div>
        <div className="flex items-center mb-4">
          <label className="flex-3 text-right">Email</label>
          <div className="flex-7 ml-8">
            <ReactInputForm
              register={register}
              errors={errors}
              id="email"
              validate={{
                required: "Vui lòng nhập",
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Vui lòng kiểm tra lại email",
                },
              }}
              fullWidth
              placeholder="Email người dùng"
            />
          </div>
        </div>
        <div className="flex items-center mb-4">
          <label className="flex-3 text-right">Số điện thoại</label>
          <div className="flex-7 ml-8">
            <ReactInputForm
              register={register}
              errors={errors}
              id="mobile"
              validate={{
                required: "Vui lòng nhập",
                pattern: {
                  value:
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/gm,
                  message: "Vui lòng nhập đúng số điện thoại",
                },
              }}
              fullWidth
              placeholder="Số điện thoại người dùng"
            />
          </div>
        </div>
        <div className="flex items-center mb-4 relative">
          <label className="flex-3 text-right">Địa chỉ</label>
          {updateUserAddress ? (
            <div className="flex-7 ml-8">
              <ReactInputForm
                register={register}
                errors={errors}
                id="address"
                fullWidth
                placeholder="Địa chỉ người dùng"
              />
            </div>
          ) : (
            <div className="flex-7 ml-8">
              <span>{currentData?.address}</span>
            </div>
          )}
          <div
            onClick={() => handleUpdateAddress()}
            className=" absolute right-[-80px] text-canClick underline cursor-pointer"
          >
            <span>{updateUserAddress ? "Hủy" : "Thay đổi"}</span>
          </div>
        </div>
        <div className="w-full flex justify-center mt-4">
          <Button disabled={!isDirty} type="submit">
            Lưu & thay đổi
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Profile;
