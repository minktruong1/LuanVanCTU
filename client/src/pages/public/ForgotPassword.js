import React, { useState, useCallback, useEffect } from "react";
import { Button, Loading } from "../../components";
import { apiForgotPassword, apiLogin } from "../../apis";
import sweetAlert from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { forgotPasswordSchema } from "../../hooks/formikSchema";
import clsx from "clsx";
import { toast } from "react-toastify";
import { showModal } from "../../store/app/appSlice";

const ForgotPassword = () => {
  window.scrollTo(0, 0);
  const dispatch = useDispatch();

  const onSubmit = async (email) => {
    dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
    const response = await apiForgotPassword(email);
    dispatch(showModal({ isShowModal: false, modalContent: null }));
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.info(response.message);
    }
  };

  const { values, handleBlur, errors, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: forgotPasswordSchema,
      onSubmit,
    });

  return (
    <div className="flex justify-center w-[calc(100%-20px)] ">
      <div className="flex bg-white w-full md:w-[550px] justify-center p-4 md:p-8 mt-[30px] mb-[30px]">
        <div className="w-full">
          <form onSubmit={handleSubmit} className="grid grid-rows-1">
            <h1 className="flex justify-center uppercase mb-[12px] text-xl font-medium ">
              Đặt lại mật khẩu
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

            <div className="mt-4">
              <Button type="submit" widthFull>
                Gửi yêu cầu
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
