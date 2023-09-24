import React, { memo } from "react";
import upperImg from "../assets/upperHeader.jpg";

const UpperHeader = () => {
  return (
    <div className="h-[55px] w-full flex justify-center bg-upperHeaderColor">
      <div className="">
        <img alt="" src={upperImg} className="h-full w-full object-cover" />
      </div>
    </div>
  );
};

export default memo(UpperHeader);
