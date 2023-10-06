import React from "react";
import avatar from "../assets/userAvatar.jpg";
import moment from "moment";
import { pointToStar } from "../ultils/helpers";

const Comment = ({
  image = avatar,
  name = "Người dùng ẩn danh",
  comment,
  updatedAt,
  star,
}) => {
  return (
    <div className="flex">
      <div className="p-2 flex-none">
        <img
          src={image}
          alt="avatar"
          className="w-[40px] h-[40px] object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col flex-auto ">
        <div className="flex items-center">
          <span className="text-[13px]">{name}</span>
        </div>
        <div className="flex flex-col mt-[4px] mb-[4px]">
          <span className="flex items-center gap-1 ">
            {pointToStar(star)?.map((element, index) => (
              <span key={index}>{element}</span>
            ))}
          </span>
          <span className="text-[13px] text-[#767676]">
            {moment(updatedAt)?.fromNow()}
          </span>
        </div>
        <span className="">
          <span className="flex items-center gap-1 ">{comment}</span>
        </span>
      </div>
    </div>
  );
};

export default Comment;
