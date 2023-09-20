import React, { memo } from "react";

const CountDown = ({ unit, number }) => {
  return (
    <div className="w-[30%] h-[60px] border flex justify-center items-center bg-countDownBg text-white font-semibold">
      <span>{number}</span>
      <span>{unit}</span>
    </div>
  );
};

export default memo(CountDown);
