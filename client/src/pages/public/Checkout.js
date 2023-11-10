import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatVND } from "../../ultils/helpers";
import Payment from "../../components/Payment";
import icons from "../../ultils/icons";
import { Navigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components";
import clsx from "clsx";
import { apiCreateOrder } from "../../apis";
import sweetAlert from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { apiCreateVNpayPayment, apiDataBack } from "../../apis/VNpay";
import { AiOutlineWarning } from "react-icons/ai";
import { toast } from "react-toastify";

const { MdLocationPin } = icons;

const method = [
  { id: 0, text: "Thanh toán khi nhận hàng", value: "cod" },
  { id: 1, text: "Paypal", value: "paypal" },
  { id: 2, text: "VNPAY", value: "VNpay" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { isLogin, currentData, currentCart } = useSelector(
    (state) => state.user
  );
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [params] = useSearchParams();
  const [note, setNote] = useState(null);

  const priceCounting = Math.round(
    +currentCart?.reduce(
      (sum, element) => +element?.price * element?.quantity + sum,
      0
    )
  );

  const profitCounting =
    priceCounting -
    Math.round(
      currentCart.reduce(
        (totalProfit, cartItem) =>
          cartItem.buyInPrice * cartItem.quantity + totalProfit,
        0
      )
    );

  const priceCountingToUSD = Math.round(
    +currentCart?.reduce(
      (sum, element) => +element?.price * element?.quantity + sum,
      0
    ) / 23000
  );

  const handleSelectMethod = async (selectedMethod) => {
    if (!currentData?.address) {
      return;
    }
    setSelectedButton(selectedMethod.id);
    setPaymentMethod(selectedMethod.value);

    //execute vnpay checck
    if (selectedMethod.value === "VNpay") {
      const response = await apiCreateVNpayPayment({ amount: priceCounting });
      if (response.success) {
        localStorage.setItem("note", note);
        window.location.href = response.VNpayUrl;
      }
    }
  };

  const decodeVNpayDataBack = async () => {
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString).toString();
    const response = await apiDataBack(queryParams);

    // Sau khi quay lại trang
    const savedNote = localStorage.getItem("note");

    const data = {
      productList: currentCart,
      totalPrice: priceCounting,
      address: currentData?.address,
      profit: profitCounting,
      note: savedNote,
      method: "VNpay",
    };

    if (response.Message === "Success") {
      const saveOrder = await apiCreateOrder(data);
      if (saveOrder.success) {
        localStorage.removeItem("note"); // Xóa giá trị đã lưu
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
    }
  };

  const handleCheckout = async (payload) => {
    if (!currentData?.address) {
      return;
    }
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
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    if (params.get("vnp_Amount")) {
      decodeVNpayDataBack();
    }
  }, [params]);

  if (!isLogin || !currentData) {
    return <Navigate to={`/`} replace={true} />;
  }

  return (
    <div className="w-[calc(100%-20px)] md:w-main grid grid-rows-1 gap-3 my-8 text-sm md:text-base">
      <div className="grid grid-rows-1 bg-white rounded-b">
        <div class="checkout-header"></div>
        <div className="p-6 ">
          <div className="flex items-center text-[20px] text-main text-base md:text-base">
            <MdLocationPin />
            Địa chỉ nhận hàng
          </div>
          <div className="md:grid grid-cols-8 hidden">
            <span className="col-span-1 text-[#6d6e72]">Tên người nhận:</span>
            <span className="col-span-7 font-semibold">{`${currentData?.firstName} ${currentData?.lastName}`}</span>
          </div>
          <div className="md:grid grid-cols-8 hidden">
            <span className="col-span-1 text-[#6d6e72]">Địa chỉ:</span>
            <span className="col-span-7 font-semibold">
              <span>
                {currentData?.address === "" ? (
                  <span className="flex text-main items-center">
                    Thiếu địa chỉ
                    <AiOutlineWarning />
                  </span>
                ) : (
                  <span>{currentData?.address}</span>
                )}
              </span>
            </span>
          </div>
          <div className="md:grid grid-cols-8 hidden">
            <span className="col-span-1 text-[#6d6e72]">Số điện thoại:</span>
            <span className="col-span-7 font-semibold">
              {currentData?.mobile}
            </span>
          </div>
          <div className="md:hidden grid grid-rows-1 text-sm ">
            <span>{`${currentData?.firstName} ${currentData?.lastName} | ${currentData?.mobile}`}</span>
            <span>{currentData?.address}</span>
          </div>
        </div>
      </div>
      <div className="md:w-main grid grid-rows-1 bg-white rounded p-6 gap-6">
        <div className="hidden md:grid grid-cols-10">
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
        <div className="">
          {currentCart?.map((element) => (
            <div className="grid grid-cols-10 mb-4">
              <div className="md:col-span-1 col-span-2">
                <img
                  src={element.images[0]}
                  alt=""
                  className="w-[68px] h-[68px] md:w-20 md:h-20 border"
                />
              </div>
              <div className="col-span-8 md:hidden text-sm ml-2">
                <div className="grid grid-rows-1">
                  <span className="truncate">{element.title}</span>
                  <span className="text-right">{`x ${element.quantity}`}</span>
                  <span className="text-right">{`${formatVND(
                    element.product.price
                  )}đ`}</span>
                </div>
              </div>
              <div className="hidden md:block md:col-span-3">
                <span className="text-left">{element.title}</span>
              </div>
              <div className="hidden md:block md:flex col-span-2 justify-center">
                <span>{`${formatVND(element.price)}đ`}</span>
              </div>
              <div className="hidden md:block md:flex col-span-2 justify-center">
                <span>{element.quantity}</span>
              </div>
              <div className="hidden md:block md:flex col-span-2 justify-end">
                <span>{`${formatVND(element.price * element.quantity)}đ`}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-10 ">
          <span className="leading-10">Lời nhắn:</span>
          <input
            onChange={(event) => setNote(event.target.value)}
            placeholder="Lưu ý tới cửa hàng..."
            className="border focus:outline-none p-2 w-[320px]"
          />
        </div>
      </div>
      <div className="md:w-main bg-white rounded p-6">
        <div className="grid grid-rows-1 gap-6">
          <div className="hidden md:grid grid-cols-10 pb-4 border-b">
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
                      currentData?.address === "" &&
                        "cursor-not-allowed opacity-50",
                      selectedButton === element.id
                        ? "!border-main text-main"
                        : ""
                    )}
                  >
                    {element.text}{" "}
                  </button>
                ))}
              </div>
              {currentData?.address === "" && (
                <div className="text-red-600 test-sm">
                  Nhập địa chỉ trước khi chọn phương thức thanh toán
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden border-b whitespace-nowrap overflow-x-scroll overflow-y-hidden">
            {method?.map((element) => (
              <button
                onClick={() => handleSelectMethod(element)}
                className={clsx(
                  "border p-2 mr-2 text-[#6d6e72] border-[#6d6e72]",
                  selectedButton === element.id ? "!border-main text-main" : ""
                )}
              >
                {element.text}{" "}
              </button>
            ))}
          </div>

          <div className=" text-right">
            <h1>{`Tổng thanh toán (${currentCart?.length} sản phẩm):`}</h1>
            <span className="text-main text-[24px]">
              {`${formatVND(
                currentCart?.reduce(
                  (sum, element) => +element?.price * element?.quantity + sum,
                  0
                )
              )}`}
              đ
            </span>
          </div>
        </div>

        <div className="mt-6">
          {paymentMethod === "paypal" && (
            <Payment
              payload={{
                productList: currentCart,
                totalPrice: priceCounting,
                address: currentData?.address,
                method: paymentMethod,
                profit: profitCounting,
                note: note,
              }}
              amount={priceCountingToUSD}
            />
          )}
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
                  profit: profitCounting,
                  note: note,
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
  );
};

export default Checkout;
