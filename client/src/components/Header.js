import React from "react";
import logo from "../assets/logo.png";
import icons from "../ultils/icons.js";
import { Link } from "react-router-dom";
import path from "../ultils/path";

const Header = () => {
  const {
    TfiHeadphoneAlt,
    MdOutlineLocationOn,
    PiNotepadLight,
    BsCart3,
    AiOutlineUser,
    BiSearch,
  } = icons;

  return (
    <>
      <div className="w-full bg-main flex items-center justify-center sticky top-0 z-10">
        <div className="w-main h-[80px] py-[20px] flex justify-between ">
          <Link className="flex" to={`/${path.HOME}`}>
            <img
              src={logo}
              alt="Logo"
              className="w-[150px] object-contain items-center"
            />
          </Link>

          <form className="flex bg-white w-1/3 rounded-lg">
            <div className="flex items-center w-full">
              <input className="w-[85%] m-2 focus:outline-none border:none" />
              <button className="w-[15%] flex items-center justify-center">
                <BiSearch />
              </button>
            </div>
          </form>

          <div className="flex text-[13px] text-white">
            <div className="flex flex-row px-4 ">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <TfiHeadphoneAlt />
              </span>
              <span>
                <span className="flex ">Hotline</span>
                <span className="flex ">1800.1166</span>
              </span>
            </div>
            <div className="flex flex-row px-4">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <MdOutlineLocationOn />
              </span>
              <span>
                <span className="flex ">Địa chỉ</span>
                <span className="flex ">TP.Cần Thơ</span>
              </span>
            </div>
            <div className="flex flex-row px-4">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <PiNotepadLight />
              </span>
              <span>
                <span className="flex ">Tra cứu</span>
                <span className="flex ">đơn hàng</span>
              </span>
            </div>
            <div className="flex flex-row px-4">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <BsCart3 />
              </span>
              <span>
                <span className="flex ">Giỏ</span>
                <span className="flex ">hàng</span>
              </span>
            </div>
            <Link
              to={`/${path.LOGIN}`}
              className="flex flex-row px-4 bg-darkRed rounded-lg"
            >
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <AiOutlineUser />
              </span>
              <span>
                <span className="flex ">Đăng</span>
                <span className="flex ">nhập</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
