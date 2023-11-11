import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import path from "../../ultils/path";
import { useSelector } from "react-redux";
import { AdminHeader, AdminSidebar } from "../../components";
import clsx from "clsx";

const AdminLayout = () => {
  const { isLogin, currentData } = useSelector((state) => state.user);

  const { isShowAdminSidebar } = useSelector((state) => state.appReducer);

  if (!isLogin || !currentData || currentData.role !== "admin") {
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  }

  return (
    <div className="flex w-full bg-webBackground min-h-screen relative text-white">
      <AdminSidebar />

      <div
        className={clsx(
          "w-full flex-auto text-black duration-300",
          isShowAdminSidebar ? "ml-[284px]" : "ml-0"
        )}
      >
        <AdminHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
