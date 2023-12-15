import React, { memo, useState } from "react";
import { useDispatch } from "react-redux";
import icons from "../ultils/icons";
import { showModal } from "../store/app/appSlice";
import { starOptions } from "../ultils/contants";
import { AiFillStar } from "react-icons/ai";
import Button from "./Button";

const { FaTimes } = icons;

const RatingModal = ({
  productImage,
  productName,
  handleCollectReview,
  pid,
  oid,
  oIid,
}) => {
  const dispatch = useDispatch();
  const [star, setStar] = useState(null);
  const [comment, setComment] = useState("");

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-min-[240px] sm:w-min-[640px] md:w-min-[1240px] flex fixed top-[50%] left-[50%] flex-col sm:flex-row transform translate-x-[-50%] translate-y-[-56%] sm:translate-y-[-50%]"
    >
      <div className="sm:w-[40%] bg-main relative flex justify-center items-center">
        <div className="hidden absolute bg-main right-[-8px] top-1/2 rotate-45 w-[20px] h-[20px]"></div>
        <div className="flex items-center justify-center p-4">
          <img alt="" src={productImage} className="w-[312px] aspect-square " />
        </div>
      </div>
      <div className="sm:w-[60%]">
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
        <div className="p-4 flex flex-col gap-2 bg-white">
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
          <div className="self-end">
            <div>
              <Button
                handleOnClick={() =>
                  handleCollectReview({ comment, point: star, pid, oid, oIid })
                }
              >
                Gửi đánh giá
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RatingModal);
