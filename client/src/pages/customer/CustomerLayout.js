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
        <div className="w-full flex flex-col items-center bg-webBackground">
          <div className="w-main flex mt-6 mb-6 gap-2">
            <div className="flex flex-col w-[25%]">
              <CustomerSidebar />
            </div>
            <div className="flex flex-col w-[75%]">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CustomerLayout;
