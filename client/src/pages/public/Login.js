import React, { useState, useCallback, useEffect } from "react";
import { Button } from "../../components";
import icons from "../../ultils/icons";
import { apiLogin } from "../../apis";
import sweetAlert from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import { login } from "../../store/users/userSlice";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { loginSchema } from "../../hooks/formikSchema";
import clsx from "clsx";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const onSubmit = async (values) => {
    const responseLogin = await apiLogin(values);
    if (responseLogin.success) {
      dispatch(
        login({
          isLogin: true,
          token: responseLogin.loginToken,
          userData: responseLogin.userData,
        })
      );
      searchParams.get("redirect")
        ? navigate(searchParams.get("redirect"))
        : navigate(`/${path.HOME}`);
    } else {
      sweetAlert.fire("Lỗi đăng nhập", responseLogin.message, "error");
    }
  };

  const { values, handleBlur, errors, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit,
    });

  return (
    <div className="flex justify-center w-[calc(100%-20px)] ">
      <div className="flex bg-white w-full md:w-[550px] justify-center p-4 md:p-8 mt-[30px] mb-[30px]">
        <div className="w-full">
          <form onSubmit={handleSubmit} className="grid grid-rows-1">
            <h1 className="flex justify-center uppercase mb-[12px] text-xl font-medium ">
              Đăng nhập
            </h1>
            <div className="grid grid-rows-1">
              <label>Email</label>
              <input
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                id="email"
                type="email"
                placeholder="Email của bạn"
                className={clsx(
                  "border focus:outline-none p-2",
                  errors.email && touched.email ? "border-main" : ""
                )}
              />
              {errors.email && touched.email && (
                <p className="text-red-600 ">{errors.email}</p>
              )}
            </div>
            <div className="grid grid-rows-1">
              <label>Mật khẩu</label>
              <input
                value={values.password}
                onChange={handleChange}
                id="password"
                type="password"
                placeholder="Mật khẩu của bạn"
                className={clsx(
                  "border focus:outline-none p-2",
                  errors.password && touched.password ? "border-main" : ""
                )}
              />
              {errors.password && touched.password && (
                <p className="text-red-600 ">{errors.password}</p>
              )}
            </div>
            <div className="place-self-end">
              <Link className="text-canClick underline" to={"/forgot-password"}>
                Quên mật khẩu?
              </Link>
            </div>
            <div>
              <span>
                Bạn chưa có tài khoản?{` `}
                <Link className="text-canClick underline" to={"/register"}>
                  Đăng ký ngay
                </Link>
              </span>
            </div>
            <div className="mt-4">
              <Button type="submit" widthFull>
                Đăng nhập
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
