import React, { useEffect, useState } from "react";
import { apiUserGetCoupon } from "../../apis/coupon";
import { Breadcrumb } from "../../components";
import clsx from "clsx";
import moment from "moment";
import { formatVND } from "../../ultils/helpers";

const CouponsList = () => {
  const [couponsList, setCouponsList] = useState(null);

  const fetchCoupon = async () => {
    const response = await apiUserGetCoupon();
    if (response.success) {
      setCouponsList(response.coupons);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, []);

  return (
    <div className="w-[calc(100%-20px)] md:w-main ">
      <Breadcrumb />
      <div className="bg-white rounded p-6">
        <div className="flex justify-center text-2xl mb-4">
          Tổng hợp mã giảm giá
        </div>
        <div>
          {couponsList?.map((element) => (
            <div className="mb-4">
              <div className="text-lg font-medium">
                {`${element?.name}: ${
                  element?.directDiscount
                    ? `giảm giá trực tiếp: ${formatVND(
                        element?.directDiscount
                      )}đ`
                    : element?.percentDiscount
                    ? `giảm giá ${element?.percentDiscount}%`
                    : "không có giảm giá"
                }`}
              </div>
              <div>
                <span
                  className={clsx(
                    "",
                    element?.quantity === 0 && "line-through"
                  )}
                >{`${element?.code}: còn lại ${
                  element?.quantity
                } lượt, hạn cuối sử dụng ${moment(element?.expire).format(
                  "DD-MM-YYYY HH:mm"
                )}`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponsList;
