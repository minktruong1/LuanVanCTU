import React, { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { LuBadgePercent } from "react-icons/lu";
import { RiFileList2Line } from "react-icons/ri";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../store/app/appSlice";
import { MobileSidebar } from "../components";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import path from "../ultils/path";

const toolbarItem = [
  { id: 1, text: "Trang chủ", icon: <AiOutlineHome size={24} /> },
  { id: 2, text: "Danh mục", icon: <RiFileList2Line size={24} /> },
  { id: 3, text: "Giảm giá", icon: <LuBadgePercent size={24} /> },
  { id: 4, text: "Tư vấn", icon: <TfiHeadphoneAlt size={24} /> },
  { id: 5, text: "Tài khoản", icon: <AiOutlineUser size={24} /> },
];

const MobileToolbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { isLogin } = useSelector((state) => state.user);

  const handleOnclick = (signal) => {
    switch (signal) {
      case 1:
        dispatch(showModal({ isShowModal: false, modalContent: null }));
        navigate(`/`);
        break;
      case 2:
        dispatch(
          showModal({ isShowModal: true, modalContent: <MobileSidebar /> })
        );
        break;
      case 3:
        dispatch(showModal({ isShowModal: false, modalContent: null }));

        navigate(`/${path.COUPONS}`);
        break;
      case 4:
        console.log(signal);
        break;
      case 5:
        if (isLogin) {
          dispatch(showModal({ isShowModal: false, modalContent: null }));
          navigate(`/${path.CUSTOMER}/${path.PROFILE}`);
        } else {
          dispatch(showModal({ isShowModal: false, modalContent: null }));
          navigate(`/${path.LOGIN}`);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white  bottom-0 fixed left-0 right-0 border-[2px] border-t-main text-[10px] z-50 block md:hidden">
      <ul className="flex justify-center items-center">
        {toolbarItem?.map((element) => (
          <li
            key={element.id}
            className={clsx("flex flex-col justify-center w-[20%]")}
          >
            <div
              onClick={() => handleOnclick(element.id)}
              className="px-[5px] py-[8px]"
            >
              <span className="flex justify-center pb-[2px]">
                {element.icon}
              </span>
              <span className="flex justify-center">{element.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileToolbar;
