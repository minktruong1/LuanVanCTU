import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import path from "../../ultils/path";
import { useSelector } from "react-redux";

const CustomerLayout = () => {
  const { isLogin, currentData } = useSelector((state) => state.user);

  if (!isLogin || !currentData) {
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  }

  return (
    <div>
      CustomerLayout
      <Outlet />
    </div>
  );
};

export default CustomerLayout;
