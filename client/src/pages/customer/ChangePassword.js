import React from "react";
import { Button } from "../../components";
import { useFormik } from "formik";
import { changePasswordSchema } from "../../hooks/formikSchema";
import { apiChangePassword } from "../../apis";
import { useNavigate } from "react-router-dom";
import sweetAlert from "sweetalert2";
import path from "../../ultils/path";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logout } from "../../store/users/userSlice";
import { Helmet } from "react-helmet";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formValues) => {
    const response = await apiChangePassword({
      oldPassword: formValues.oldPassword,
      newPassword: formValues.newPassword,
    });
    if (response.success) {
      sweetAlert
        .fire({
          title: "Thông báo",
          text: "Mật khẩu đã thay đổi, hãy đăng nhập lại",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        })
        .then((rs) => {
          dispatch(logout());
          navigate(`/${path.LOGIN}`);
        });
    } else {
      toast.error(response.message);
    }
  };

  const { values, handleBlur, errors, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      validationSchema: changePasswordSchema,
      onSubmit,
    });

  return (
    <div className="w-full bg-white rounded p-4">
      <div className="text-[24px] font-medium mb-4">
        <h1>Đổi mật khẩu mới</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-rows-1 gap-4">
        <div className="grid grid-cols-10">
          <span className="col-span-3 text-right leading-10 pr-2">
            Mật khẩu cũ
          </span>
          <div className="col-span-4">
            <div className="grid grid-rows-1">
              <input
                value={values.oldPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                id="oldPassword"
                type="password"
                placeholder="Mật khẩu cũ"
                className="border focus:outline-none p-2 w-full"
              />
              {errors.oldPassword && touched.oldPassword && (
                <p className="text-red-600 ">{errors.oldPassword}</p>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-10">
          <span className="col-span-3 text-right leading-10 pr-2">
            Mật khẩu mới
          </span>
          <div className="col-span-4">
            <div className="grid grid-rows-1">
              <input
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                id="newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
                className="border focus:outline-none p-2 w-full"
              />
              {errors.newPassword && touched.newPassword && (
                <p className="text-red-600 ">{errors.newPassword}</p>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-10">
          <span className="col-span-3 text-right leading-10 pr-2">
            Xác nhận mật khẩu mới
          </span>
          <div className="col-span-4">
            <div className="grid grid-rows-1">
              <input
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                id="confirmPassword"
                type="password"
                placeholder="Xác nhận mật khẩu"
                className="border focus:outline-none p-2 w-full"
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-600 ">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-10">
          <span className="col-span-3 "></span>
          <div className="col-span-4">
            <Button type="submit">Cập nhật</Button>
          </div>
        </div>
      </form>
      <Helmet>
        <title>Đổi mật khẩu</title>
      </Helmet>
    </div>
  );
};

export default ChangePassword;
