import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatVND } from "../../ultils/helpers";
import Payment from "../../components/Payment";
import icons from "../../ultils/icons";
import { Navigate } from "react-router-dom";
import { Button } from "../../components";
import clsx from "clsx";
import { apiCreateOrder } from "../../apis";
import sweetAlert from "sweetalert2";
import { useNavigate } from "react-router-dom";

const { MdLocationPin } = icons;

const method = [
  { id: 1, text: "Thanh toán khi nhận hàng", value: "cod" },
  { id: 2, text: "Paypal", value: "paypal" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { isLogin, currentData, currentCart } = useSelector(
    (state) => state.user
  );
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);

  const priceCounting = Math.round(
    +currentCart?.reduce(
      (sum, element) => +element.product?.price * element?.quantity + sum,
      0
    )
  );

  const priceCountingToUSD = Math.round(
    +currentCart?.reduce(
      (sum, element) => +element.product?.price * element?.quantity + sum,
      0
    ) / 23000
  );

  if (!isLogin || !currentData) {
    return <Navigate to={`/`} replace={true} />;
  }

  const handleSelectMethod = (selectedMethod) => {
    setSelectedButton(selectedMethod.id);
    setPaymentMethod(selectedMethod.value);
  };

  const handleCheckout = async (payload) => {
    const response = await apiCreateOrder({
      ...payload,
      status: "Đang xử lý",
    });
    if (response.success) {
      setTimeout(() => {
        sweetAlert
          .fire({
            icon: "success",
            title: "Thành công",
            text: "Đơn hàng của bạn đang được xử lý!",
            showConfirmButton: false,
            timer: 3000,
          })
          .then((rs) => {
            navigate(`/`);
            window.location.reload();
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 100);
          });
      }, 1500);
    }
  };
  console.log(currentCart);
  return (
    <div className="grid grid-rows-1 gap-3 my-8">
      <div className="w-main grid grid-rows-1 bg-white rounded-b ">
        <div class="checkout-header"></div>
        <div className="p-6">
          <div className="flex items-center text-[20px] text-main">
            <MdLocationPin />
            Địa chỉ nhận hàng
          </div>
          <div className="grid grid-cols-8">
            <span className="col-span-1 text-[#6d6e72]">Tên người nhận:</span>
            <span className="col-span-7 font-semibold">{`${currentData?.firstName} ${currentData?.lastName}`}</span>
          </div>
          <div className="grid grid-cols-8">
            <span className="col-span-1 text-[#6d6e72]">Địa chỉ:</span>
            <span className="col-span-7 font-semibold">
              <span>{currentData?.address}</span>
            </span>
          </div>
          <div className="grid grid-cols-8">
            <span className="col-span-1 text-[#6d6e72]">Số điện thoại:</span>
            <span className="col-span-7 font-semibold">
              {currentData?.mobile}
            </span>
          </div>
        </div>
      </div>
      <div className="w-main bg-white rounded p-6">
        <div className="grid grid-cols-10 mb-8">
          <div className="col-span-4">
            <span>Sản phẩm</span>
          </div>
          <div className="col-span-2 flex justify-center">
            <span>Đơn giá</span>
          </div>
          <div className="col-span-2 flex justify-center">
            <span>Số lượng</span>
          </div>
          <div className="col-span-2 flex justify-end">
            <span>Thành tiền</span>
          </div>
        </div>
        <div className="grid grid-rows-1 gap-6">
          {currentCart?.map((element) => (
            <div className="grid grid-cols-10 ">
              <div className="col-span-4 flex">
                <img
                  src={element.product.images[0]}
                  alt=""
                  className="w-20 h-20 border"
                />
                <span className="ml-4">{element.product.title}</span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span>{`${formatVND(element.product.price)}`}đ</span>
              </div>
              <div className="col-span-2 flex justify-center">
                <span>{element.quantity}</span>
              </div>
              <div className="col-span-2 flex justify-end">
                <span>
                  {`${formatVND(element.product.price * element.quantity)}`}đ
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-main bg-white rounded p-6">
        <div className="grid grid-rows-1 gap-6">
          <div className="grid grid-cols-10 pb-4 border-b">
            <div className="col-span-2 pt-2">
              <span>Phương thức thanh toán:</span>
            </div>
            <div className="col-span-8">
              <div className="">
                {method?.map((element) => (
                  <button
                    onClick={() => handleSelectMethod(element)}
                    className={clsx(
                      "border p-2 mr-2 text-[#6d6e72] border-[#6d6e72]",
                      selectedButton === element.id
                        ? "!border-main text-main"
                        : ""
                    )}
                  >
                    {element.text}{" "}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-10">
            <div className="col-span-5">
              {paymentMethod === "paypal" && (
                <Payment
                  payload={{
                    productList: currentCart,
                    totalPrice: priceCounting,
                    address: currentData?.address,
                    method: paymentMethod,
                  }}
                  amount={priceCountingToUSD}
                />
              )}
            </div>
            <div className="col-span-5 text-right">
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
          </div>

          <div className="grid grid-cols-10 pt-4 border-t">
            <div className="col-span-5 ">
              <span>
                Nhấn "Đặt hàng" đồng nghĩa với việc bạn xác nhận mua hàng
              </span>
            </div>
            <div className="col-span-5 text-right">
              <button
                onClick={() =>
                  handleCheckout({
                    productList: currentCart,
                    totalPrice: priceCounting,
                    address: currentData?.address,
                    method: paymentMethod,
                  })
                }
                className={clsx(
                  "px-[40px] py-2 border bg-main text-white",
                  paymentMethod !== "cod" ? "cursor-not-allowed opacity-50" : ""
                )}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
