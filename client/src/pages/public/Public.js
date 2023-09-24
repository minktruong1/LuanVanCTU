import React from "react";
import { Outlet } from "react-router-dom";
import {
  Footer,
  Header,
  Navigation,
  UpperHeader,
} from "../../components/index.js";

const Public = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center">
        <UpperHeader />
        <Header />
        <Navigation />
        <div className="w-full flex flex-col items-center bg-webBackground">
          <div className="w-main">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Public;
