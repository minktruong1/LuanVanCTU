import React, { useEffect, useState, memo } from "react";
import icons from "../../ultils/icons";
import { Link, createSearchParams } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Breadcrumb, Button, CartItem } from "../../components";
import { useLocation } from "react-router-dom";
import emptyCart from "../../assets/empty-cart.png";
import { formatVND } from "../../ultils/helpers";
import { useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import sweetAlert from "sweetalert2";
import { Helmet } from "react-helmet";

const { MdArrowBackIosNew } = icons;

const MainCart = () => {
  const navigate = useNavigate();
  const { isLogin, currentCart } = useSelector((state) => state.user);
  const location = useLocation();
  const [shipPrice, setShipPrice] = useState(40000);

  const priceCounting = Math.round(
    +currentCart?.reduce(
      (sum, element) => +element?.price * element?.quantity + sum,
      0
    )
  );

  const lastPriceCounting = priceCounting + shipPrice;

  const handleCheckout = () => {
    if (isLogin) {
      const insufficientQuantity = currentCart.some(
        (item) => item.product.quantity < item.quantity
      );

      if (insufficientQuantity) {
        return sweetAlert.fire({
          title: "Thông báo",
          text: "Số lượng hàng trong giỏ hàng vượt quá số lượng có sẵn trong kho",
          icon: "warning",
        });
      } else {
        navigate(`/${path.CHECKOUT}`);
      }
    } else {
      return sweetAlert
        .fire({
          title: "Lỗi",
          text: "Hãy đăng nhập",
          icon: "info",
          cancelButtonAriaLabel: "Hủy",
          showCancelButton: true,
          confirmButtonText: "Tới trang đăng nhập",
        })
        .then((rs) => {
          if (rs.isConfirmed) {
            navigate({
              pathname: `/${path.LOGIN}`,
              search: createSearchParams({
                redirect: location.pathname,
              }).toString(),
            });
          }
        });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (priceCounting > 500000) {
      setShipPrice(0);
    } else {
      setShipPrice(40000);
    }
  }, [priceCounting]);

  return (
    <div className="w-[calc(100%-20px)] md:w-main">
      <div className="">
        <Breadcrumb />
      </div>

      <div className=" flex justify-center items-center mb-6">
        <div className="flex flex-col">
          <div className="bg-white md:w-[600px] rounded">
            <div className="p-4">
              <Link
                to={`/categories/all-products`}
                className="text-canClick cursor-pointer flex items-center"
              >
                <MdArrowBackIosNew />
                <span className="ml-1">Xem thêm sản phẩm khác</span>
              </Link>
            </div>
            <div className="flex p-6 ">
              {currentCart?.length === 0 || !isLogin ? (
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
                      element={element}
                      key={element._id}
                      firstQuantity={element.quantity}
                    />
                  ))}
                  <div className="border-t font-medium">
                    <div className="flex justify-between mt-2 mb-2 text-[16px]">
                      <span>Phí vận chuyển:</span>
                      <span>{`${formatVND(shipPrice)}đ`}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 text-[18px]">
                      <span>Tổng tiền</span>
                      <span className="text-main text-lg md:text-2xl">
                        {`${formatVND(lastPriceCounting)}đ`}
                      </span>
                    </div>
                    <Button handleOnClick={() => handleCheckout()} widthFull>
                      Đặt hàng ngay
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Helmet>
        <title>Giỏ hàng cá nhân</title>
      </Helmet>
    </div>
  );
};

export default memo(MainCart);
