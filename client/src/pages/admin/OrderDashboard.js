import React, { useEffect, useState } from "react";
import { apiAdminGetUserOrders } from "../../apis";
import { ChartLine, ChartPie } from "../../components";

const OrderDashboard = () => {
  const [orderCounts, setOrderCounts] = useState({
    "Hoàn thành": 0,
    "Đang xử lý": 0,
    "Đang vận chuyển": 0,
    Hủy: 0,
  });

  const initialOrderMonthData = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  const [failOrder, setFailOrder] = useState({
    ...initialOrderMonthData,
  });
  const [successOrder, setSuccessOrder] = useState({
    ...initialOrderMonthData,
  });
  const [totalOrder, setTotalOrder] = useState({ ...initialOrderMonthData });

  const updateMonthlyCounts = (order, month) => {
    if (order.status === "Hủy") {
      failOrder[month]++;
    } else if (order.status === "Hoàn thành") {
      successOrder[month]++;
    }
    totalOrder[month]++;
  };

  const fetchOrders = async () => {
    const response = await apiAdminGetUserOrders({ limit: 99999 });
    if (response.success) {
      const orders = response.orders;

      const counts = {
        "Hoàn thành": 0,
        "Đang xử lý": 0,
        "Đang vận chuyển": 0,
        Hủy: 0,
      };

      orders.forEach((order) => {
        const month = new Date(order.createdAt).getMonth();

        counts[order.status]++;
        updateMonthlyCounts(order, Object.keys(initialOrderMonthData)[month]);
      });

      setOrderCounts(counts);
      setFailOrder({ ...failOrder });
      setSuccessOrder({ ...successOrder });
      setTotalOrder({ ...totalOrder });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="grid grid-rows-1 md:grid-cols-2 mt-[80px] p-4 overflow-auto">
      <div>
        <ChartLine
          OderDatasets1={Object.values(failOrder)}
          OderDatasets2={Object.values(successOrder)}
          OderDatasets3={Object.values(totalOrder)}
        />
      </div>
      <div>
        <ChartPie OderDatasets={Object.values(orderCounts)} />
      </div>
    </div>
  );
};

export default OrderDashboard;
