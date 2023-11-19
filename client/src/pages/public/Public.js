import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header, MobileToolbar, Navigation } from "../../components";
import { useNavigate } from "react-router-dom";

const Public = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center pt-[88px]">
        <Header />
        <Navigation />
        <div className="w-full flex flex-col items-center bg-webBackground pb-6">
          <Outlet />
        </div>
        <Footer />
        <MobileToolbar />
      </div>
    </>
  );
};

export default Public;
