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

  const initialOrderQuarterData = {
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
  };

  const [failOrder, setFailOrder] = useState({
    ...initialOrderMonthData,
  });
  const [successOrder, setSuccessOrder] = useState({
    ...initialOrderMonthData,
  });
  const [totalOrder, setTotalOrder] = useState({ ...initialOrderMonthData });

  const [failOrderQuarter, setFailOrderQuarter] = useState({
    ...initialOrderQuarterData,
  });
  const [successOrderQuarter, setSuccessOrderQuarter] = useState({
    ...initialOrderQuarterData,
  });
  const [totalOrderQuarter, setTotalOrderQuarter] = useState({
    ...initialOrderQuarterData,
  });

  const updateMonthlyCounts = (order, month) => {
    if (order.status === "Hủy") {
      failOrder[month]++;
    } else if (order.status === "Hoàn thành") {
      successOrder[month]++;
    }
    totalOrder[month]++;
  };

  const updateQuarterlyCounts = (order, quarter) => {
    if (order.status === "Hủy") {
      failOrderQuarter[quarter]++;
    } else if (order.status === "Hoàn thành") {
      successOrderQuarter[quarter]++;
    }
    totalOrderQuarter[quarter]++;
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
        const quarter = Math.floor(month / 3) + 1;

        counts[order.status]++;
        updateMonthlyCounts(order, Object.keys(initialOrderMonthData)[month]);
        updateQuarterlyCounts(order, `Q${quarter}`);
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
          DataFor={`year`}
          DataType={`order`}
          label={`yearOrder`}
        />
      </div>
      <div>
        <ChartLine
          OderDatasets1={Object.values(failOrderQuarter)}
          OderDatasets2={Object.values(successOrderQuarter)}
          OderDatasets3={Object.values(totalOrderQuarter)}
          DataFor={`quarter`}
          DataType={`order`}
          label={`quarterOrder`}
        />
      </div>
      <div>
        <ChartPie OderDatasets={Object.values(orderCounts)} />
      </div>
    </div>
  );
};

export default OrderDashboard;
