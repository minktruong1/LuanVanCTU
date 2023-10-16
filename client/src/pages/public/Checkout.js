import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatVND } from "../../ultils/helpers";
import Payment from "../../components/Payment";
import icons from "../../ultils/icons";

const { MdLocationPin } = icons;

const Checkout = () => {
  const { currentData, currentCart } = useSelector((state) => state.user);

  const priceCounting = Math.round(
    +currentCart?.reduce(
      (sum, element) => +element.product?.price * element?.quantity + sum,
      0
    ) / 23000
  );

  return (
    <div className="flex flex-col gap-3 my-8">
      <div className="w-main bg-white rounded-b ">
        <div class="checkout-header"></div>
        <div className="p-6">
          <div className="flex items-center text-[20px] text-main">
            <MdLocationPin />
            Địa chỉ nhận hàng
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col text-[#6d6e72]">
              <span>Tên người nhận:</span>
              <span>Số điện thoại:</span>
              <span>Địa chỉ:</span>
            </div>
            <div className="flex flex-col font-semibold">
              <span>{`${currentData?.firstName} ${currentData?.lastName}`}</span>
              <span>{currentData?.mobile}</span>
              <span>{currentData?.address}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-main bg-white rounded ">
        <div className="p-6">
          <div className="flex mb-8">
            <div className="w-[50%]">
              <span>Sản phẩm</span>
            </div>
            <div className="w-[15%] flex justify-center">
              <span>Đơn giá</span>
            </div>
            <div className="w-[15%] flex justify-center">
              <span>Số lượng</span>
            </div>
            <div className="w-[20%] flex justify-end">
              <span>Thành tiền</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {currentCart?.map((element) => (
              <div className="flex ">
                <div className="w-[50%] flex">
                  <img
                    src={element.product.images[0]}
                    alt=""
                    className="w-20 h-20 border"
                  />
                  <span className="ml-4">{element.product.title}</span>
                </div>
                <div className="w-[15%] flex justify-center">
                  <span>{`${formatVND(element.product.price)}`}đ</span>
                </div>
                <div className="w-[15%] flex justify-center">
                  <span>{element.quantity}</span>
                </div>
                <div className="w-[20%] flex justify-end">
                  <span>
                    {`${formatVND(element.product.price * element.quantity)}`}đ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex gap-3">
        <div className="w-[40%] bg-white rounded p-6 max-h-[200px]">
          <h1>{`Tổng thanh toán (${currentCart?.length} sản phẩm):`}</h1>
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
        <div className="w-[60%]">
          <Payment
            payload={{
              productList: currentCart,
              totalPrice: priceCounting,
              address: currentData?.address,
            }}
            amount={priceCounting}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
