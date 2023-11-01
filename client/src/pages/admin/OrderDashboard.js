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

  const [profit, setProfit] = useState({
    ...initialOrderMonthData,
  });

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
    const response = await apiAdminGetUserOrders();
    if (response.success) {
      console.log(response);
      const orders = response.orders;

      const updatedProfit = { ...profit };
      const counts = {
        "Hoàn thành": 0,
        "Đang xử lý": 0,
        "Đang vận chuyển": 0,
        Hủy: 0,
      };

      orders.forEach((order) => {
        const month = new Date(order.createdAt).getMonth();
        const orderProfit = order.profit || 0;
        const monthName = Object.keys(profit)[month];

        if (order.status === "Hoàn thành") {
          updatedProfit[monthName] += orderProfit;
        }

        counts[order.status]++;
        updateMonthlyCounts(order, Object.keys(initialOrderMonthData)[month]);
      });

      setProfit(updatedProfit);
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
    <div className="grid grid-cols-2 mt-[80px] p-4 ">
      <div>
        <ChartLine
          OderDatasets1={Object.values(failOrder)}
          OderDatasets2={Object.values(successOrder)}
          OderDatasets3={Object.values(totalOrder)}
        />
      </div>
      <div>
        <ChartLine OderDatasets1={Object.values(profit)} DataFor={`profit`} />
      </div>
      <div>
        <ChartPie OderDatasets={Object.values(orderCounts)} />
      </div>
    </div>
  );
};

export default OrderDashboard;
