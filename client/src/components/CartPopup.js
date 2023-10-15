import React from "react";
import { useSelector } from "react-redux";
import emptyCart from "../../src/assets/empty-cart.png";
import { formatVND } from "../ultils/helpers";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import path from "../ultils/path";
import { useDispatch } from "react-redux";
import { showCartPopup } from "../store/app/appSlice";

const CartPopup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCart } = useSelector((state) => state.user);

  const handleOnClick = () => {
    dispatch(showCartPopup());
    navigate(`/${path.MAIN_CART}`);
  };
  return (
    <div className="bg-white text-black w-[350px]  drop-shadow-xl z-50">
      <div className="absolute w-[20px] h-[20px] bg-white content-none rotate-45 top-[-10px] right-[40px]"></div>
      <div>
        {!currentCart && (
          <div className="flex flex-col justify-center items-center p-4">
            <img src={emptyCart} alt="emptyCart" />
            <span className="text-[16px] font-medium">Giỏ hàng trống</span>
          </div>
        )}
        {currentCart && (
          <>
            <div className="p-4">
              <span>Sản phẩm mới vừa thêm</span>
            </div>
            <div className="flex flex-col max-h-[250px] overflow-y-scroll">
              {currentCart?.map((element) => (
                <div
                  key={element._id}
                  className="flex hover:bg-webBackground py-2 px-4 "
                >
                  <div className="w-[25%]">
                    <img
                      src={element?.product?.images[0]}
                      alt="productImage"
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                  <div className="w-[50%]">
                    <span className="line-clamp-1">
                      {element?.product?.title}
                    </span>
                    <span className="line-clamp-1 text-[12px] text-[#6d6e72] mt-6">
                      Số lượng: {element?.quantity}
                    </span>
                  </div>
                  <div className="w-[25%] text-right">
                    <span className="text-main">
                      {`${formatVND(element?.product?.price)}đ`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 flex justify-between items-center">
              <span>Đã thêm {currentCart?.length}</span>
              <Button handleOnClick={() => handleOnClick()}>
                Xem giỏ hàng
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPopup;
