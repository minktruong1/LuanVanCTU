import React, { useState } from "react";
import { formatVND } from "../ultils/helpers";
import { pointToStar } from "../ultils/helpers";
import { Link } from "react-router-dom";
import icons from "../ultils/icons";

const { AiOutlineHeart, AiFillHeart } = icons;

const Product = ({ productData, isNew, isHot }) => {
  const [favorite, setFavorite] = useState(false);
  const handleFavorite = () => {
    setFavorite(!favorite);
    console.log("love!!");
  };

  return (
    <div>
      <div className="items-center m-2 bg-white text-base border p-4">
        <Link
          to={`/${productData?.category?.toLowerCase()}/${productData?._id}/${
            productData?.title
          }`}
          className="relative"
        >
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
        </Link>
        <div className="flex flex-col gap-2 mt-[12px] items-start w-full">
          <Link
            to={`/${productData?.category?.toLowerCase()}/${productData?._id}/${
              productData?.title
            }`}
            className="line-clamp-1"
          >
            {productData?.title}
          </Link>
          <span className="flex items-center text-yellow-500">
            {pointToStar(productData?.reviewPoint)?.map((element, index) => (
              <span key={index}>{element}</span>
            ))}
            <span className="ml-[6px]">
              {productData?.reviewPoint.toFixed(1)}
            </span>
          </span>
          <div className="flex w-full justify-between items-center">
            <div>{`${formatVND(productData?.price)}đ`}</div>
            <div
              onClick={() => handleFavorite()}
              className="text-[22px] cursor-pointer text-main"
            >
              <span title="Yêu thích">
                {favorite ? <AiFillHeart /> : <AiOutlineHeart />}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
