import React, { useEffect } from "react";
import { Button } from "../../components";
import { apiResetPassword } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { resetPasswordSchema } from "../../hooks/formikSchema";
import clsx from "clsx";
import path from "../../ultils/path";
import { Helmet } from "react-helmet";
import sweetAlert from "sweetalert2";

const RsPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const onSubmit = async ({ confirmPassword, password }) => {
    const response = await apiResetPassword({ password, token });

    if (response.success) {
      sweetAlert
        .fire({
          title: "Thông báo",
          text: "Hoàn thành việc đặt lại mật khẩu, bạn sẽ được chuyển tới trang đăng nhập",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        })
        .then((rs) => {
          navigate(`/${path.LOGIN}`);
        });
    } else {
      sweetAlert.fire("Lỗi đăng ký", response.message, "error");
    }
    navigate(`/${path.LOGIN}`);
  };

  const { values, handleBlur, errors, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        password: "",
        confirmPassword: "",
      },
      validationSchema: resetPasswordSchema,
      onSubmit,
    });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex justify-center w-[calc(100%-20px)] ">
      <div className="flex bg-white w-full md:w-[550px] justify-center p-4 md:p-8 mt-[30px] mb-[30px]">
        <div className="w-full">
          <form onSubmit={handleSubmit} className="grid grid-rows-1">
            <h1 className="flex justify-center uppercase mb-[12px] text-xl font-medium ">
              Đặt lại mật khẩu mới
            </h1>
            <div className="grid grid-rows-1">
              <label>Mật khẩu</label>
              <input
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                id="password"
                type="password"
                placeholder="Email của bạn"
                className={clsx(
                  "border focus:outline-none p-2",
                  errors.password && touched.password ? "border-main" : ""
                )}
              />
              {errors.password && touched.password && (
                <p className="text-red-600 ">{errors.password}</p>
              )}
            </div>
            <div className="grid grid-rows-1">
              <label>Nhập lại mật khẩu</label>
              <input
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                id="confirmPassword"
                type="password"
                placeholder="Email của bạn"
                className={clsx(
                  "border focus:outline-none p-2",
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-main"
                    : ""
                )}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-600 ">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="mt-4">
              <Button type="submit" widthFull>
                Xác nhận
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Helmet>
        <title>Đặt lại mật khẩu</title>
      </Helmet>
    </div>
  );
};

export default RsPassword;
