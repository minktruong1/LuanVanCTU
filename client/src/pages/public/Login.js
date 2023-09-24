import React, { useState, useCallback } from "react";
import { InputField, Button } from "../../components";
import icons from "../../ultils/icons";
import { apiRegister, apiLogin, apiForgotPassword } from "../../apis";
import sweetAlert from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import { register } from "../../store/users/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const { MdArrowBackIosNew } = icons;
const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobile: "",
  });

  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      mobile: "",
    });
  };

  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.info(response.message);
    }
  };

  const handleSubmit = useCallback(async () => {
    const { firstName, lastName, mobile, ...formData } = payload;
    if (isRegister) {
      const responseRegis = await apiRegister(payload);
      console.log(responseRegis);
      if (responseRegis.success) {
        sweetAlert
          .fire(
            "Đăng ký thành công, hãy kiểm tra email của bạn đề hoàn tất việc tạo tài khoản.",
            responseRegis.mes,
            "success"
          )
          .then(() => {
            setIsRegister(false);
            resetPayload();
          });
      } else {
        sweetAlert.fire("Lỗi đăng ký", responseRegis.mes, "error");
      }
    } else {
      const responseLogin = await apiLogin(formData);
      if (responseLogin.success) {
        dispatch(
          register({
            isLogin: true,
            token: responseLogin.loginToken,
            userData: responseLogin.userData,
          })
        );
        navigate(`/${path.HOME}`);
      } else {
        sweetAlert.fire("Lỗi đăng nhập", responseLogin.mes, "error");
      }
      console.log(responseLogin);
    }
  }, [payload, isRegister]);

  return (
    <div className="flex justify-center ">
      <div className="flex bg-white justify-center p-8 min-w-[544px] w-1/2 mt-[30px] mb-[30px]">
        <div className="w-[80%] ">
          <h1 className="uppercase mb-[12px] text-xl font-medium flex justify-center">
            {isResetPassword
              ? "đặt lại mật khẩu"
              : isRegister
              ? "đăng ký"
              : "đăng nhập"}
          </h1>
          {isRegister && (
            <div className="flex items-center gap-2">
              <InputField
                value={payload.lastName}
                setValue={setPayload}
                nameKey="lastName"
                placeholder="Họ"
              />
              <InputField
                value={payload.firstName}
                setValue={setPayload}
                nameKey="firstName"
                placeholder="Tên"
              />
            </div>
          )}
          {!isResetPassword && (
            <InputField
              value={payload.email}
              setValue={setPayload}
              nameKey="email"
              placeholder=""
            />
          )}
          {isRegister && (
            <InputField
              value={payload.mobile}
              setValue={setPayload}
              nameKey="mobile"
              placeholder="Số điện thoại"
            />
          )}
          {!isResetPassword && (
            <InputField
              value={payload.password}
              setValue={setPayload}
              nameKey="password"
              type="password"
              placeholder=""
            />
          )}

          {isResetPassword && (
            <div className="flex flex-col gap-4">
              <label htmlFor="email">Hãy nhập email của bạn:</label>
              <input
                type="text"
                className="px-4 py-2 border w-full my-2 outline-none"
                placeholder="email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex items-center justify-center w-full">
                <Button
                  name="Gửi yêu cầu"
                  handleOnClick={handleForgotPassword}
                  wFull
                />
              </div>
            </div>
          )}

          <div className="flex w-full justify-between mb-[40px]">
            <span></span>
            {!isRegister && !isResetPassword && (
              <span
                className="text-blue-500 underline italic cursor-pointer"
                onClick={() => {
                  setIsResetPassword(true);
                }}
              >
                Quên mật khẩu?
              </span>
            )}
          </div>

          {!isResetPassword && (
            <Button
              name={isRegister ? "Đăng ký" : "Đăng nhập"}
              handleOnClick={handleSubmit}
              wFull
            />
          )}

          {isResetPassword ? (
            <div className="flex w-full justify-between mt-[20px]">
              <span>
                <span
                  className="text-blue-500 cursor-pointer flex items-center justify-center"
                  onClick={() => setIsResetPassword(false)}
                >
                  <MdArrowBackIosNew />
                  Trở lại
                </span>
              </span>
              <span></span>
            </div>
          ) : (
            <div className="flex w-full justify-between mt-[20px]">
              <span>
                {isRegister ? (
                  <span
                    className="text-blue-500 cursor-pointer flex items-center justify-center"
                    onClick={() => setIsRegister(false)}
                  >
                    <MdArrowBackIosNew />
                    Trở lại
                  </span>
                ) : (
                  <>
                    Bạn chưa có tài khoản?{` `}
                    <span
                      className="text-blue-500 cursor-pointer"
                      onClick={() => setIsRegister(true)}
                    >
                      Đăng ký ngay
                    </span>
                  </>
                )}
              </span>
              <span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
