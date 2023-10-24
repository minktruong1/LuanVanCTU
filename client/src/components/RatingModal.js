import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import icons from "../ultils/icons";
import { showModal } from "../store/app/appSlice";
import { starOptions } from "../ultils/contants";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Button from "./Button";

const { FaTimes } = icons;

const RatingModal = ({ productImage, productName, handleCollectReview }) => {
  const dispatch = useDispatch();
  const [star, setStar] = useState(null);
  const [comment, setComment] = useState("");

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-[1140px] h-[420px] flex fixed top-[19%] left-[13%] "
    >
      <div className="w-[30%] bg-main relative">
        <div className="absolute bg-main right-[-8px] top-1/2 rotate-45 w-[20px] h-[20px]"></div>
        <div className="flex items-center justify-center p-4">
          <img alt="" src={productImage} className="w-[312px] h-[312px] " />
        </div>
      </div>
      <div className="w-[70%]">
        <div className="p-4 flex justify-between border-b">
          <div>
            {`Đánh giá của bạn về: `}
            <span className="text-[16px] font-semibold">{productName}</span>
          </div>
          <div
            onClick={() =>
              dispatch(showModal({ isShowModal: false, modalContent: null }))
            }
            className="cursor-pointer text-[#ccc] text-[20px] hover:text-black"
          >
            <FaTimes className="" />
          </div>
        </div>
        <div className="p-4 flex border-b items-center gap-2">
          <span>Mức độ đánh giá:</span>
          <div className="flex gap-[1px] ">
            {starOptions.map((element) => (
              <div key={element.id} onClick={() => setStar(element.id)}>
                {Number(star) < element.id ? (
                  <AiFillStar
                    className={`text-white text-[22px] cursor-pointer bg-[#ccc] ${
                      element.id === 1
                        ? `rounded-l-md`
                        : element.id === 5
                        ? `rounded-r-md`
                        : ``
                    }`}
                  />
                ) : (
                  <AiFillStar
                    className={`text-white text-[22px] cursor-pointer bg-main ${
                      element.id === 1
                        ? `rounded-l-md`
                        : element.id === 5
                        ? `rounded-r-md`
                        : ``
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2">
          <span>Nội dung đánh giá</span>
          <div className=" h-[20%]">
            <textarea
              maxlength="1000"
              className="form-textarea border resize-none outline-none placeholder:text-sm placeholder:italic w-full h-[120px]"
              placeholder="Ví dụ: Tôi rất thích sản phẩm này"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="p-4 absolute right-0 bottom-0">
          <div>
            <Button
              handleOnClick={() =>
                handleCollectReview({ comment, point: star })
              }
            >
              Gửi đánh giá
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RatingModal);
