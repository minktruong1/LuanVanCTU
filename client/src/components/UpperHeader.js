import React, { memo } from "react";
import upperImg from "../assets/upperHeader.jpg";

const UpperHeader = () => {
  return (
    <div className=" h-[55px] w-full justify-center bg-upperHeaderColor hidden md:flex">
      <img alt="" src={upperImg} className="h-full w-full object-cover" />
    </div>
  );
};

export default memo(UpperHeader);
