import React from "react";
import { formatVND } from "../ultils/helpers";
import { pointToStar } from "../ultils/helpers";
import { Link } from "react-router-dom";

const Product = ({ productData, isNew, isHot }) => {
  return (
    <Link
      to={`/${productData?.category?.toLowerCase()}/${productData?._id}/${
        productData?.title
      }`}
    >
      <div className="items-center mx-2 mb-4 bg-white text-base border p-4">
        <div className=" relative ">
          <div className="overflow-hidden flex justify-center">
            <img
              src={productData?.images[0] || ""}
              alt=""
              className="w-[148px] h-[148px] object-contain hoverEffect"
            />
          </div>
          {isNew && (
            <div className="absolute bg-topSellerSticker bottom-0 left-0 object-cover w-[74px] h-[36px] rounded ">
              <div className="absolute top-1 left-4 justify-center text-lg line-clamp-1 text-red-300">
                New!
              </div>
            </div>
          )}
          {isHot && (
            <div className="absolute bg-topSellerSticker bottom-0 left-0 object-cover w-[74px] h-[36px] rounded ">
              <div className="absolute top-1 left-4 justify-center text-lg line-clamp-1 text-red-300">
                Hot!
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-[12px] items-start w-full">
          <span className="line-clamp-1">{productData?.title}</span>
          <span className="flex items-center text-yellow-500">
            {pointToStar(productData?.reviewPoint)?.map((element, index) => (
              <span key={index}>{element}</span>
            ))}
            <span className="ml-[6px]">
              {productData?.reviewPoint.toFixed(1)}
            </span>
          </span>
          <span>{`${formatVND(productData?.price)} VNĐ`}</span>
        </div>
      </div>
    </Link>
  );
};

export default Product;
