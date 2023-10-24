import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import path from "../../ultils/path";
import { useSelector } from "react-redux";
import {
  CustomerSidebar,
  Footer,
  Header,
  Navigation,
  UpperHeader,
  MobileToolbar,
} from "../../components";

const CustomerLayout = () => {
  const { isLogin, currentData } = useSelector((state) => state.user);

  if (!isLogin || !currentData) {
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  }

  return (
    <>
      <div className="w-full flex flex-col items-center ">
        <UpperHeader />
        <Header />
        <Navigation />
        <div className="w-full flex flex-col items-center bg-webBackground py-4">
          <div className="w-[calc(100%-20px)] md:w-main grid grid-rows-1 md:grid-cols-4 mt-6 mb-6 gap-2">
            <div className="w-full">
              <CustomerSidebar />
            </div>
            <div className="md:col-span-3">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
        <MobileToolbar />
      </div>
    </>
  );
};

export default CustomerLayout;
