import React, { memo } from "react";
import upperImg from "../assets/upperHeader.jpg";

const UpperHeader = () => {
  return (
    <div className="max-h-[55px] w-full flex justify-center bg-upperHeaderColor">
      <img alt="" src={upperImg} className="h-full w-full object-cover" />
    </div>
  );
};

export default memo(UpperHeader);
