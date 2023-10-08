import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import path from "../../ultils/path";
import { useSelector } from "react-redux";
import { AdminSidebar } from "../../components";

const AdminLayout = () => {
  const { isLogin, currentData } = useSelector((state) => state.user);

  if (!isLogin || !currentData || currentData.role !== "admin") {
    return <Navigate to={`/${path.LOGIN}/${path.DASHBOARD}`} replace={true} />;
  }

  return (
    <div className="flex w-full bg-webBackground min-h-screen relative text-white">
      <div className="w-[300px]  fixed top-0 bottom-0 left-0">
        <AdminSidebar />
      </div>
      <div className="w-[380px]"></div>
      <div className="w-full flex-auto text-black">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
