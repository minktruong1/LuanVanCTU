import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Navigation } from "../../components/index.js";

const Public = () => {
  return (
    <>
      <div className="bg-main flex flex-col items-center">
        <Header className="w-main" />
      </div>
      <div className="w-full border-y flex flex-col items-center">
        <Navigation />
      </div>
      <div className="w-full flex flex-col items-center bg-webBackground">
        <div className="w-main">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Public;
