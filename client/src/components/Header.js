import React, { useEffect, useRef, useState } from "react";
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
import useDebounce from "../hooks/useDebounce.js";
import { formatVND } from "../ultils/helpers.js";

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
  const { isShowCartPopup, isShowUserDirection } = useSelector(
    (state) => state.appReducer
  );

  const inputRef = useRef(null);
  const searchResultRef = useRef(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const [search, setSearch] = useState("");

  const queryDebounce = useDebounce(search, 500);

  const navigateAndReload = () => {
    navigate(`/${path.HOME}`, { replace: true });
    window.location.reload();
  };

  const clearSearchData = async () => {
    setSearchResult(null);
    setSearch("");
  };

  const fetchProduct = async () => {
    const response = await fetch(
      `http://localhost:5000/api/search/searchproduct/${search}`
    );
    const data = await response.json();
    setSearchResult(data);
  };

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate({
        pathname: `/search`,
        search: `?title=${search}`,
      });
      clearSearchData();
    }
  };

  const handleClickOutside = (event) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target) &&
      searchResultRef.current &&
      !searchResultRef.current.contains(event.target)
    ) {
      setIsInputFocused(false);
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

  useEffect(() => {
    if (search !== "") {
      fetchProduct();
    } else {
      clearSearchData();
    }
  }, [queryDebounce]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="w-screen bg-main flex items-center justify-center fixed top-0 z-40 px-2">
        <div
          className="h-[88px] py-[20px] flex justify-between items-center "
          style={{
            width: "1200px",
          }}>
          <span
            onClick={navigateAndReload}
            className="hidden lg:flex cursor-pointer">
            <span className="text-4xl font-extrabold text-white">TMĐT</span>
          </span>
          <div
            onClick={() =>
              dispatch(
                showModal({
                  isShowModal: true,
                  modalContent: <MobileSidebar />,
                })
              )
            }
            className="flex items-center ml-4 lg:hidden">
            <span>
              <AiOutlineMenu color="white" size={24} />
            </span>
          </div>

          <div className="flex bg-white items-center w-1/2  md:w-1/3 rounded">
            <div className="flex relative w-full">
              <input
                value={search}
                ref={inputRef}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => setIsInputFocused(true)}
                className="w-[85%] m-2 focus:outline-none border-none"
              />
              <button
                onClick={() => handleSearch()}
                className="w-[15%] flex justify-center absolute right-0 top-[12px]">
                <BiSearch />
              </button>
              {isInputFocused && searchResult?.length > 0 && (
                <div
                  ref={searchResultRef}
                  className="bg-white absolute top-[104%] rounded shadow w-[100%] max-h-[300px] p-3 text-[13px] overflow-x-auto">
                  <div className="grid grid-rows-1 gap-2 ">
                    {searchResult?.map((element) => (
                      <div
                        key={element._id}
                        className="grid grid-cols-10 pb-2 border-b">
                        <div className="col-span-7">
                          <div className="grid grid-rows-1">
                            <Link
                              onClick={() => clearSearchData()}
                              to={`/${element?.category?.toLowerCase()}/${
                                element?._id
                              }/${element?.title}`}
                              className="cursor-pointer hover:text-main duration-500">
                              {element.title}
                            </Link>
                            <span className="text-main">{`${formatVND(
                              element.price
                            )}đ`}</span>
                          </div>
                        </div>
                        <Link
                          onClick={() => clearSearchData()}
                          to={`/${element?.category?.toLowerCase()}/${
                            element?._id
                          }/${element?.title}`}
                          className="col-span-3 place-self-end">
                          <img
                            className="w-12 h-12 border cursor-pointer"
                            src={element.images[0]}
                            alt={element.title}
                          />
                        </Link>
                      </div>
                    ))}
                    <div
                      onClick={() => handleSearch()}
                      className="place-self-center hover:text-main cursor-pointer duration-300">
                      Xem tất cả
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex text-[13px] text-white ">
            <div className="hidden  lg:flex  md:flex-row  md:px-4  md:items-center ">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <TfiHeadphoneAlt />
              </span>
              <span>
                <span className="flex ">Hotline</span>
                <span className="flex ">1800.1166</span>
              </span>
            </div>
            <div className="hidden  lg:flex  md:flex-row  md:px-4  md:items-center  ">
              <span className="flex gap-4 items-center text-[24px] pr-2">
                <MdOutlineLocationOn />
              </span>
              <span className="">
                <span className="flex ">Địa chỉ</span>
                <span className="flex ">TP.Cần Thơ</span>
              </span>
            </div>
            <div className="hidden  lg:flex  md:flex-row  md:px-4  md:items-center ">
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
              className="flex flex-row md:px-4 items-center relative">
              <Link
                to={`/${path.MAIN_CART}`}
                className="flex flex-row px-4 items-center ">
                <Badge
                  offset={[-12, 2]}
                  count={currentCart?.length}
                  size="small"
                  showZero
                  className="flex gap-4 items-center text-[24px] pr-2">
                  <BsCart3 color="white" />
                </Badge>
                <span className="hidden  lg:block">
                  <span className="flex ">Giỏ</span>
                  <span className="flex ">hàng</span>
                </span>
                <div className="hidden md:block top-[38px] w-[90px] right-[20px] absolute h-[30px] opacity-0"></div>
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
                  className="account-model_hover bg-darkRed rounded items-center relative p-2">
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
                  className="flex bg-darkRed rounded ">
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
