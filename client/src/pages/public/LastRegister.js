import React, { useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import sweetAlert from "sweetalert2";

const LastRegister = () => {
  const { status } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "fail") {
      sweetAlert.fire("Fail!", "Đăng ký thất bại", "error").then(() => {
        navigate(`/${path.LOGIN}`);
      });
    }
    if (status === "success") {
      sweetAlert.fire("Success", "Đăng ký thành công", "success").then(() => {
        navigate(`/${path.LOGIN}`);
      });
    }
  }, []);
  return (
    <>
      <div className="h-screen w-screen bg-gray-300"></div>
    </>
  );
};

export default LastRegister;
