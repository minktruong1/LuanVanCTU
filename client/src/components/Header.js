import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import icons from "../ultils/icons.js";
import { Link } from "react-router-dom";
import path from "../ultils/path";
import { apiGetCurrentAccount } from "../store/users/asyncActions";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/users/userSlice";

const Header = () => {
  const {
    TfiHeadphoneAlt,
    MdOutlineLocationOn,
    PiNotepadLight,
    BsCart3,
    AiOutlineUser,
    BiSearch,
    MdWavingHand,
    RiBillLine,
    LuUserCog,
    BiLogOut,
  } = icons;

  const dispatch = useDispatch();
  const { isLogin, currentData } = useSelector((state) => state.user);

  useEffect(() => {
    if (isLogin) {
      dispatch(apiGetCurrentAccount());
    }
  }, [dispatch, isLogin]);

  return (
    <>
      <div className="w-full bg-main flex items-center justify-center sticky top-0 z-50">
        <div className="w-main h-[88px] py-[20px] flex justify-between ">
          <Link className="flex" to={`/${path.HOME}`}>
            <img
              src={logo}
              alt="Logo"
              className="w-[150px] object-contain items-center"
            />
          </Link>

          <form className="flex bg-white w-1/3 rounded">
            <div className="flex items-center w-full">
              <input className="w-[85%] m-2 focus:outline-none border:none" />
              <button className="w-[15%] flex items-center justify-center">
                <BiSearch />
              </button>
            </div>
          </form>

          <div className="flex text-[13px] text-white">
            <div className="flex flex-row px-4 items-center">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <TfiHeadphoneAlt />
              </span>
              <span>
                <span className="flex ">Hotline</span>
                <span className="flex ">1800.1166</span>
              </span>
            </div>
            <div className="flex flex-row px-4 items-center">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <MdOutlineLocationOn />
              </span>
              <span>
                <span className="flex ">Địa chỉ</span>
                <span className="flex ">TP.Cần Thơ</span>
              </span>
            </div>
            <div className="flex flex-row px-4 items-center">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <PiNotepadLight />
              </span>
              <span>
                <span className="flex ">Tra cứu</span>
                <span className="flex ">đơn hàng</span>
              </span>
            </div>
            <div className="flex flex-row px-4 items-center">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <BsCart3 />
              </span>
              <span>
                <span className="flex ">Giỏ</span>
                <span className="flex ">hàng</span>
              </span>
            </div>
            {isLogin ? (
              <>
                <div className="account-model_hover bg-darkRed rounded flex flex-row px-4 items-center relative">
                  <div className=" flex flex-row items-center ">
                    <span className="flex gap-4 items-center text-[24px] pr-2">
                      <AiOutlineUser />
                    </span>
                    <span>
                      <span className="flex ">Xin chào,</span>
                      <span className="flex ">{currentData?.lastName}</span>
                    </span>
                    <div className="bg-black top-[48px] right-0 absolute model-top-arrowHolding"></div>
                  </div>
                </div>
                <div className="account-model">
                  <div className="top-[70px] right-[140px] absolute ">
                    <span className="model-top-arrow"></span>
                  </div>
                  <div className="bg-white mt-[20px] w-[260px] absolute top-[68px] right-[150px] shadow-[0px_3px_8px_rgba(0,0,0,0.24)] ">
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
                      <div className="flex items-center h-[34px] justify-start hover:underline cursor-pointer">
                        <LuUserCog className="mr-2 text-[16px]" />
                        <span>Thông tin cá nhân</span>
                      </div>
                      <div
                        onClick={() => dispatch(logout())}
                        className="flex items-center h-[34px] border-t justify-start hover:underline cursor-pointer"
                      >
                        <BiLogOut className="mr-2 text-[16px]" />
                        <span>Đăng xuất</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link to={`/${path.LOGIN}`} className="flex bg-darkRed rounded">
                <div className="flex flex-row px-4 items-center">
                  <span className="flex gap-4 justify-center text-[24px] pr-2">
                    <AiOutlineUser />
                  </span>
                  <span>
                    <span className="flex ">Đăng</span>
                    <span className="flex ">nhập</span>
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
