import React, { useState } from "react";
import icons from "../../ultils/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Breadcrumb, Button, CartItem } from "../../components";
import { useLocation } from "react-router-dom";
import emptyCart from "../../assets/empty-cart.png";
import { formatVND } from "../../ultils/helpers";
import path from "../../ultils/path";

const { MdArrowBackIosNew } = icons;

const MainCart = () => {
  const { currentCart } = useSelector((state) => state.user);
  const location = useLocation();
  // const handleChangeQuantity = (pid, quantity) => {
  //   // console.log({ pid, quantity });
  // };

  // console.log(currentCart);
  return (
    <>
      <div className="pt-[18px] pb-[18px] w-main">
        <Breadcrumb
          category={location?.pathname?.slice(1)?.split("-")?.join(" ")}
        />
      </div>

      <div className="w-main flex justify-center items-center mb-6">
        <div className="flex flex-col">
          <div className="bg-white w-[600px] rounded">
            <div className="p-4">
              <Link
                to={`/all-products`}
                className="text-canClick cursor-pointer flex items-center"
              >
                <MdArrowBackIosNew />
                <span className="ml-1">Xem thêm sản phẩm khác</span>
              </Link>
            </div>
            <div className="flex p-6 ">
              {currentCart.length === 0 ? (
                <div className="flex flex-col justify-center items-center p-4">
                  <img src={emptyCart} alt="emptyCart" />
                  <span className="text-[16px] font-medium">
                    Giỏ hàng của bạn trống
                  </span>
                </div>
              ) : (
                <div className="w-full">
                  {currentCart?.map((element) => (
                    <CartItem
                      // handleChangeQuantity={handleChangeQuantity}
                      element={element}
                      key={element._id}
                      firstQuantity={element.quantity}
                    />
                  ))}
                  <div className="border-t font-medium">
                    <div className="flex justify-between mt-2 mb-2 text-[16px]">
                      <span>Phí vận chuyển:</span>
                      <span>Miễn phí</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 text-[18px]">
                      <span>Tổng tiền</span>
                      <span className="text-main text-[24px]">
                        {`${formatVND(
                          currentCart?.reduce(
                            (sum, element) =>
                              +element.product?.price * element?.quantity + sum,
                            0
                          )
                        )}`}
                        đ
                      </span>
                    </div>
                    <Link
                      className="flex justify-center w-full bg-main p-2 text-white text-[18px]"
                      to={`/${path.CHECKOUT}`}
                    >
                      Đặt hàng ngay
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainCart;
