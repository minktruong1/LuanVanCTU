import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import icons from "../ultils/icons.js";
import { Link, useNavigate } from "react-router-dom";
import path from "../ultils/path";
import { apiGetCurrentAccount } from "../store/users/asyncActions";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../store/users/userSlice";
import sweetAlert from "sweetalert2";
import CartPopup from "./CartPopup";
import {
  showCartPopup,
  showModal,
  showUserDirection,
} from "../store/app/appSlice";
import { Badge } from "antd";
import UserDirectionPopup from "./UserDirectionPopup";
import { AiOutlineMenu } from "react-icons/ai";
import { MobileSidebar } from "../components";
import { apiSearchProduct } from "../apis";

const {
  TfiHeadphoneAlt,
  MdOutlineLocationOn,
  PiNotepadLight,
  BsCart3,
  AiOutlineUser,
  BiSearch,
} = icons;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin, currentData, currentCart, message } = useSelector(
    (state) => state.user
  );
  const { isShowCartPopup } = useSelector((state) => state.appReducer);
  const { isShowUserDirection } = useSelector((state) => state.appReducer);

  const [search, setSearch] = useState(null);
  const [productSearch, setProductSearch] = useState(null);

  const handleSearch = async () => {
    if (search) {
      const data = {
        searchProduct: search,
      };
      const response = await apiSearchProduct(data);
      if (response.success) {
        setProductSearch(response);
      }
    }
  };

  useEffect(() => {
    const setTimeoutGetCurrent = setTimeout(() => {
      if (isLogin) {
        dispatch(apiGetCurrentAccount());
      }
    }, 300);

    return () => {
      clearTimeout(setTimeoutGetCurrent);
    };
  }, [dispatch, isLogin]);

  useEffect(() => {
    if (message) {
      sweetAlert.fire("Chú ý", message, "info").then(() => {
        dispatch(clearMessage());
        navigate(`/${path.LOGIN}`);
      });
    }
  }, [message]);

  return (
    <>
      <div className="w-full bg-main flex items-center justify-center sticky top-0 z-40">
        <div className="w-main h-[88px] py-[20px] flex justify-between items-center">
          <Link className="hidden md:flex" to={`/${path.HOME}`}>
            <span className="text-4xl font-extrabold text-white">TMĐT</span>
          </Link>
          <div
            onClick={() =>
              dispatch(
                showModal({
                  isShowModal: true,
                  modalContent: <MobileSidebar />,
                })
              )
            }
            className="flex items-center ml-4 md:hidden"
          >
            <span>
              <AiOutlineMenu color="white" size={24} />
            </span>
          </div>

          <div className="flex bg-white items-center w-1/2  md:w-1/3 rounded">
            <div className="flex relative w-full">
              <input
                onChange={(event) => setSearch(event.target.value)}
                className="w-[85%] m-2 focus:outline-none border-none"
              />
              <button
                onClick={handleSearch}
                className="w-[15%] flex justify-center absolute right-0 top-[12px]"
              >
                <BiSearch />
              </button>
            </div>
          </div>

          <div className="flex text-[13px] text-white ">
            <div className="hidden  md:flex  md:flex-row  md:px-4  md:items-center ">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <TfiHeadphoneAlt />
              </span>
              <span>
                <span className="flex ">Hotline</span>
                <span className="flex ">1800.1166</span>
              </span>
            </div>
            <div className="hidden  md:flex  md:flex-row  md:px-4  md:items-center  ">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <MdOutlineLocationOn />
              </span>
              <span className="">
                <span className="flex ">Địa chỉ</span>
                <span className="flex ">TP.Cần Thơ</span>
              </span>
            </div>
            <div className="hidden  md:flex  md:flex-row  md:px-4  md:items-center ">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <PiNotepadLight />
              </span>
              <span className="">
                <span className="flex ">Tra cứu</span>
                <span className="flex ">đơn hàng</span>
              </span>
            </div>
            <div
              onMouseEnter={() => dispatch(showCartPopup())}
              onMouseLeave={() => dispatch(showCartPopup())}
              className="flex flex-row  md:px-4 items-center relative"
            >
              <Link
                to={`/${path.MAIN_CART}`}
                className="flex flex-row px-4 items-center "
              >
                <Badge
                  offset={[-12, 2]}
                  count={currentCart?.length}
                  size="small"
                  showZero
                  className="flex gap-4 items-center text-[24px] pr-2"
                >
                  <BsCart3 color="white" />
                </Badge>
                <span className="hidden  md:block">
                  <span className="flex ">Giỏ</span>
                  <span className="flex ">hàng</span>
                </span>
                <div className="bg-black top-[38px] w-[90px] right-[20px] absolute h-[30px] opacity-0"></div>
              </Link>
              {isShowCartPopup && (
                <div className="absolute top-[68px] right-[8px] cursor-default hidden  md:block">
                  <CartPopup />
                </div>
              )}
            </div>
            <div className="hidden  md:flex  md:flex-row  md:px-2  md:items-center">
              {isLogin && currentData ? (
                <div
                  onMouseEnter={() => dispatch(showUserDirection())}
                  onMouseLeave={() => dispatch(showUserDirection())}
                  className="account-model_hover bg-darkRed rounded items-center relative p-2"
                >
                  <div className=" flex flex-row items-center ">
                    <span className="flex gap-4 items-center text-[24px] pr-2">
                      <AiOutlineUser />
                    </span>
                    <span>
                      <span className="flex ">Xin chào,</span>
                      <span className="flex ">{currentData?.lastName}</span>
                    </span>
                    <div className="bg-black top-[38px] right-0 absolute w-[120px] h-[32px] opacity-0"></div>
                  </div>
                  {isShowUserDirection && (
                    <div className="absolute top-[52px] right-0 ">
                      <UserDirectionPopup />
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={`/${path.LOGIN}`}
                  className="flex bg-darkRed rounded "
                >
                  <div className="flex px-2 py-1 items-center">
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
      </div>
    </>
  );
};

export default Header;
