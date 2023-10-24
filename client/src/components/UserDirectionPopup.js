import React from "react";
import icons from "../ultils/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import path from "../ultils/path";
import { logout } from "../store/users/userSlice";

const { MdWavingHand, RiBillLine, LuUserCog, BiLogOut, AiOutlineControl } =
  icons;

const UserDirectionPopup = () => {
  const dispatch = useDispatch();

  const { currentData } = useSelector((state) => state.user);

  return (
    <div className="bg-white mt-[20px] w-[260px] shadow-[0px_3px_8px_rgba(0,0,0,0.24)] ">
      <div className="absolute w-[20px] h-[20px] bg-white content-none rotate-45 top-[10px] right-[40px]"></div>

      <div className="flex flex-col text-black pr-2 pl-2">
        <div className="flex items-center h-[44px] border-b justify-start ">
          <MdWavingHand className="mr-2 text-[20px]" />
          <span className="text-[14px] font-medium">
            Xin chào, {currentData?.lastName}
          </span>
        </div>
        <div className="flex items-center h-[34px] justify-start hover:underline cursor-pointer">
          <RiBillLine className="mr-2 text-[16px]" />
          <span>Đơn hàng của tôi</span>
        </div>
        <Link
          to={`/${path.CUSTOMER}/${path.PROFILE}`}
          className="flex items-center h-[34px] justify-start hover:underline cursor-pointer"
        >
          <LuUserCog className="mr-2 text-[16px]" />
          <span>Thông tin cá nhân</span>
        </Link>
        {currentData.role === "admin" && (
          <Link
            to={`/${path.ADMIN}/${path.DASHBOARD}`}
            className="flex items-center h-[34px] justify-start hover:underline cursor-pointer"
          >
            <AiOutlineControl className="mr-2 text-[16px]" />
            <span>Admin panel</span>
          </Link>
        )}
        <div
          onClick={() => dispatch(logout())}
          className="flex items-center h-[34px] border-t justify-start hover:underline cursor-pointer"
        >
          <BiLogOut className="mr-2 text-[16px]" />
          <span>Đăng xuất</span>
        </div>
      </div>
    </div>
  );
};

export default UserDirectionPopup;
