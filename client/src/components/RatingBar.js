import React, { useRef, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";

const RatingBar = ({ number, numberOfRatingCount, totalOfRating }) => {
  const fillInRef = useRef();

  useEffect(() => {
    const perfectPercent =
      Math.round((numberOfRatingCount * 100) / totalOfRating) || 0;
    fillInRef.current.style.cssText = `right: ${100 - perfectPercent}%`;
  }, [numberOfRatingCount, numberOfRatingCount]);

  return (
    <div className="flex items-center gap-2 min-w-[600px] ">
      <div className="flex w-[10%] items-center gap-1 justify-center text-sm text-[#ff8a00]">
        <span className="text-black">{number}</span>
        <AiFillStar />
      </div>
      <div className="w-[70%]">
        <div className="w-full relative rounded-md h-[10px] bg-[#ececec] ">
          <div
            ref={fillInRef}
            className="absolute inset-0 rounded-md bg-red-400 "
          ></div>
        </div>
      </div>
      <div className="w-[20%] line-clamp-1 text-[14px]">{`${
        numberOfRatingCount || 0
      } đánh giá`}</div>
    </div>
  );
};

export default RatingBar;
