import React, { useState, useEffect } from "react";
import { Button, Loading } from "../../components";
import { apiRegister, apiRegisterCheck } from "../../apis";
import sweetAlert from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { registerSchema } from "../../hooks/formikSchema";
import clsx from "clsx";
import { MdArrowBackIosNew } from "react-icons/md";
import { showModal } from "../../store/app/appSlice";
import { Helmet } from "react-helmet";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isRegisterConfirm, setIsRegisterConfirm] = useState(false);
  const [registerToken, setRegisterToken] = useState("");

  const onSubmit = async ({ confirmPassword, ...formValues }) => {
    dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
    const responseRegis = await apiRegister(formValues);
    dispatch(showModal({ isShowModal: false, modalContent: null }));
    if (responseRegis.success) {
      sweetAlert
        .fire(
          "Hãy kiểm tra email của bạn để hoàn tất việc tạo tài khoản.",
          responseRegis.message,
          "success"
        )
        .then(() => {
          setIsRegisterConfirm(true);
        });
    } else {
      sweetAlert.fire("Lỗi đăng ký.", responseRegis.message, "error");
    }
  };

  const registerTokenCheck = async () => {
    const responseRegisterTokenCheck = await apiRegisterCheck(registerToken);
    if (responseRegisterTokenCheck.success) {
      sweetAlert
        .fire({
          title: "Thông báo",
          text: "Hoàn thành Đăng ký, bạn sẽ được chuyển tới trang đăng nhập",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        })
        .then((rs) => {
          navigate(`/${path.LOGIN}`);
        });
    } else {
      sweetAlert.fire(
        "Lỗi đăng ký",
        responseRegisterTokenCheck.message,
        "error"
      );
    }
    setRegisterToken("");
  };

  const {
    values,
    handleBlur,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex justify-center w-[calc(100%-20px)] ">
      <div className="flex bg-white w-full md:w-[550px] justify-center p-4 md:p-8 mt-[30px] mb-[30px]">
        <div className="w-full">
          <Link
            to={`/login`}
            className="text-blue-500 cursor-pointer flex w-fit items-center"
          >
            <MdArrowBackIosNew />
            Đăng nhập
          </Link>
          <form onSubmit={handleSubmit} className="grid grid-rows-1">
            <h1 className="flex justify-center uppercase mb-[12px] text-xl font-medium ">
              Đăng ký tài khoản
            </h1>
            <div className="grid grid-cols-2">
              <div>
                <label>Họ </label>
                <input
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="firstName"
                  type="text"
                  placeholder="Email của bạn"
                  className={clsx(
                    "border focus:outline-none p-2",
                    errors.firstName && touched.firstName ? "border-main" : ""
                  )}
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-600 ">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label>Tên</label>
                <input
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="lastName"
                  type="text"
                  placeholder="Email của bạn"
                  className={clsx(
                    "border focus:outline-none p-2",
                    errors.lastName && touched.lastName ? "border-main" : ""
                  )}
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-600 ">{errors.lastName}</p>
                )}
              </div>
            </div>
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
              <label>Số điện thoại</label>
              <input
                value={values.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                id="mobile"
                type="text"
                placeholder="Số điện thoại của bạn"
                className={clsx(
                  "border focus:outline-none p-2",
                  errors.mobile && touched.mobile ? "border-main" : ""
                )}
              />
              {errors.mobile && touched.mobile && (
                <p className="text-red-600 ">{errors.mobile}</p>
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
            <div className="grid grid-rows-1">
              <label>Nhập lại mật khẩu</label>
              <input
                value={values.confirmPassword}
                onChange={handleChange}
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
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
            <div className="place-self-end">
              <Link className="text-canClick underline" to={"/forgot-password"}>
                Quên mật khẩu?
              </Link>
            </div>
            <div className="mt-4">
              <Button type="submit" widthFull>
                Đăng ký
              </Button>
            </div>
            {isRegisterConfirm && (
              <div className="">
                <h4 className="my-2">Nhập mã xác nhận đã được gửi qua email</h4>
                <input
                  type="text"
                  value={registerToken}
                  onChange={(e) => setRegisterToken(e.target.value)}
                  className="p-2 border outline-none"
                />
                <button
                  type="button"
                  className="px-4 py-2 text-white text-semibold bg-main"
                  onClick={registerTokenCheck}
                >
                  Xác thực
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <Helmet>
        <title>Trang đăng ký</title>
      </Helmet>
    </div>
  );
};

export default Register;
