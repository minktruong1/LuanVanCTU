import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatVND } from "../../ultils/helpers";
import Payment from "../../components/Payment";
import icons from "../../ultils/icons";
import { Navigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { apiCreateOrder, apiGetDetailCoupon } from "../../apis";
import sweetAlert from "sweetalert2";
import { showModal } from "../../store/app/appSlice";

import { useNavigate } from "react-router-dom";
import { apiCreateVNpayPayment, apiDataBack } from "../../apis/VNpay";
import { AiOutlineWarning } from "react-icons/ai";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import { Loading } from "../../components";
import { Helmet } from "react-helmet";

const { MdLocationPin } = icons;

const method = [
  { id: 0, text: "Thanh toán khi nhận hàng", value: "cod" },
  { id: 1, text: "Paypal", value: "paypal" },
  { id: 2, text: "VNPAY", value: "VNpay" },
];

const Checkout = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { isLogin, currentData, currentCart } = useSelector(
    (state) => state.user
  );
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [params] = useSearchParams();
  const [note, setNote] = useState(null);

  const [shipPrice, setShipPrice] = useState(40000);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);

  const priceCounting = Math.round(
    +currentCart?.reduce(
      (sum, element) => +element?.price * element?.quantity + sum,
      0
    )
  );

  // Kiểm tra nếu có dữ liệu về giảm giá trực tiếp
  const directDiscount = couponData?.directDiscount || 0;

  // Kiểm tra nếu có dữ liệu về giảm giá theo phần trăm
  const percentDiscount = couponData?.percentDiscount || 0;

  // Tính giảm giá theo phần trăm
  const percentDiscountAmount = (priceCounting * percentDiscount) / 100;

  // Tính tổng giảm giá
  const totalDiscount = directDiscount + percentDiscountAmount;

  // Tính lastPriceCounting
  const lastPriceCounting = Math.max(
    priceCounting - totalDiscount + +shipPrice,
    0
  );

  const profitCounting = Math.max(
    lastPriceCounting -
      +shipPrice -
      Math.round(
        currentCart.reduce(
          (totalProfit, cartItem) =>
            cartItem.buyInPrice * cartItem.quantity + totalProfit,
          0
        )
      ),
    0
  );

  const priceCountingToUSD =
    Math.round((lastPriceCounting / 23000) * 100) / 100;

  const queryDebounce = useDebounce(couponCode, 800);

  const handleSelectMethod = async (selectedMethod) => {
    if (!currentData?.address) {
      return;
    }
    setSelectedButton(selectedMethod.id);
    setPaymentMethod(selectedMethod.value);

    //execute vnpay checck
    if (selectedMethod.value === "VNpay") {
      const response = await apiCreateVNpayPayment({
        amount: lastPriceCounting,
      });
      if (response.success) {
        localStorage.setItem("noteLocal", note);
        localStorage.setItem("couponCodeLocal", couponCode);
        localStorage.setItem("shipPriceLocal", shipPrice);
        localStorage.setItem("lastPriceLocal", lastPriceCounting);
        localStorage.setItem("profitLocal", profitCounting);
        window.location.href = response.VNpayUrl;
      }
    }
  };

  const fetchCoupon = async (code) => {
    const response = await apiGetDetailCoupon({ code });
    if (response.success) {
      setCouponData(response.coupon);
    } else {
      setCouponData(response);
    }
  };

  const decodeVNpayDataBack = async () => {
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString).toString();
    const response = await apiDataBack(queryParams);

    // Sau khi quay lại trang
    const savedNote = localStorage.getItem("noteLocal");
    const savedCouponCode = localStorage.getItem("couponCodeLocal");
    const savedShipPrice = localStorage.getItem("shipPriceLocal");
    const savedLastPrice = localStorage.getItem("lastPriceLocal");
    const savedProfit = localStorage.getItem("profitLocal");

    const data = {
      productList: currentCart,
      couponCode: savedCouponCode,
      shipPrice: savedShipPrice,
      totalPrice: priceCounting,
      lastPrice: savedLastPrice,
      address: currentData?.address,
      profit: savedProfit,
      note: savedNote,
      method: "VNpay",
    };

    if (response.Message === "Success") {
      const saveOrder = await apiCreateOrder(data);
      if (saveOrder.success) {
        localStorage.removeItem("noteLocal"); // Xóa giá trị đã lưu
        localStorage.removeItem("couponCodeLocal"); // Xóa giá trị đã lưu
        localStorage.removeItem("lastPriceLocal"); // Xóa giá trị đã lưu
        localStorage.removeItem("profitLocal"); // Xóa giá trị đã lưu
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

    dispatch(showModal({ isShowModal: true, modalContent: <Loading /> }));
    const response = await apiCreateOrder({
      ...payload,
      status: "Đang xử lý",
    });
    dispatch(showModal({ isShowModal: false, modalContent: null }));

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

  useEffect(() => {
    if (couponCode !== "") {
      fetchCoupon(couponCode);
    } else {
      setCouponData(null);
    }
  }, [queryDebounce]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const calculateShipPrice = () => {
      if (priceCounting > 500000) {
        setShipPrice(0);
      } else {
        setShipPrice(40000);
      }
    };

    calculateShipPrice();
  }, [totalDiscount]);

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
                    element.price
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
        <div className="grid grid-cols-10">
          <span className="col-span-3 md:col-span-1 leading-10">Lời nhắn:</span>
          <div className="col-span-6 md:col-span-3">
            <input
              onChange={(event) => setNote(event.target.value)}
              placeholder="Lưu ý tới cửa hàng..."
              className="border focus:outline-none p-2 w-full"
            />
          </div>
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

          <div className=" place-self-end">
            <div className="">
              <input
                className="border border-black p-2"
                type="text"
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Nhập mã giảm giá"
              />
            </div>
            {couponCode !== "" &&
              (couponData?.name || couponData?.message || couponData?.coupon)}
          </div>

          <div className="md:hidden whitespace-nowrap overflow-x-scroll overflow-y-hidden">
            {method?.map((element) => (
              <button
                onClick={() => handleSelectMethod(element)}
                className={clsx(
                  "border p-2 mr-2 text-[#6d6e72] border-[#6d6e72]",
                  selectedButton === element.id ? "!border-main text-main" : ""
                )}
              >
                {element.text}
              </button>
            ))}
          </div>

          <div className="border-t pt-4 text-right">
            <h1>Phí vận chuyển:</h1>
            <span className="text-[18px] text-main">{`${formatVND(
              shipPrice
            )}đ`}</span>
            <h1>Áp dụng mã giảm giá:</h1>
            <span className="text-[18px] text-main">
              {couponData?.directDiscount || couponData?.percentDiscount ? (
                couponData.directDiscount === 0 ? (
                  <span>{`Giá gốc: ${formatVND(priceCounting)}đ - ${
                    couponData.percentDiscount
                  }%`}</span>
                ) : (
                  <span>{`Giá gốc: ${formatVND(priceCounting)}đ - ${formatVND(
                    couponData.directDiscount
                  )}đ`}</span>
                )
              ) : (
                <span>0đ</span>
              )}
            </span>
            <h1>{`Tổng thanh toán (${currentCart?.length} sản phẩm):`}</h1>
            <span className="text-main text-[24px]">
              {`${formatVND(lastPriceCounting)}đ`}
            </span>
          </div>
        </div>

        <div className="mt-6">
          {paymentMethod === "paypal" && (
            <Payment
              payload={{
                productList: currentCart,
                couponCode: couponCode,
                shipPrice: shipPrice,
                totalPrice: priceCounting,
                lastPrice: lastPriceCounting,
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
                  couponCode: couponCode,
                  shipPrice: shipPrice,
                  totalPrice: priceCounting,
                  lastPrice: lastPriceCounting,
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
      <Helmet>
        <title>Thanh toán đơn hàng</title>
      </Helmet>
    </div>
  );
};

export default Checkout;
