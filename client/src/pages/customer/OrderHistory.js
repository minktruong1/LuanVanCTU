import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetOrders } from "../../apis";

const OrderHistory = () => {
  console.log();
  const fetchOrderList = async () => {
    const response = await apiGetOrders();
    if (response.success) {
      console.log(response);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  return (
    <div className="w-full bg-white rounded">
      <div className="p-[16px] text-[24px] font-medium  ">
        <h1>Các đơn hàng</h1>
      </div>
      <div>
        <span></span>
      </div>
    </div>
  );
};

export default OrderHistory;
