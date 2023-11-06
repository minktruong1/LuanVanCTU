import React, { useEffect, useState } from "react";
import { apiUserGetCoupon } from "../../apis/coupon";
import { Breadcrumb } from "../../components";

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
            <>
              <div className="text-lg font-medium">{element.name}</div>
              <div>{`${element.code}: còn lại ${element.quantity} lượt`}</div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponsList;
