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
      <div className="w-full max-h-screen overflow-y-auto flex flex-col items-center ">
        <UpperHeader />
        <Header />
        <Navigation />
        <div className="w-full flex flex-col items-center bg-webBackground">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Public;
