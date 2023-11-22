import React, { useEffect, useState } from "react";
import { apiAdminGetUserOrders } from "../../apis";
import { ChartLine, ChartPie } from "../../components";

const ProfitDashboard = () => {
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

  const [profit, setProfit] = useState({
    ...initialOrderMonthData,
  });

  const [quarterlyProfit, setQuarterlyProfit] = useState({
    ...initialOrderQuarterData,
  });

  const fetchOrders = async () => {
    const response = await apiAdminGetUserOrders({ limit: 99999 });
    if (response.success) {
      const orders = response.orders;

      const updatedProfit = { ...initialOrderMonthData };
      const updatedQuarterlyProfit = { ...initialOrderQuarterData };

      orders.forEach((order) => {
        const month = new Date(order.createdAt).getMonth();
        const quarter = Math.floor(month / 3) + 1;
        const orderProfit = order.profit || 0;
        const monthName = Object.keys(initialOrderMonthData)[month];
        const quarterName = `Q${quarter}`;

        if (order.status === "Hoàn thành") {
          updatedProfit[monthName] += orderProfit;
          updatedQuarterlyProfit[quarterName] += orderProfit;
        }
      });

      setProfit(updatedProfit);
      setQuarterlyProfit(updatedQuarterlyProfit);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="grid grid-rows-1 md:grid-cols-2 mt-[80px] p-4 overflow-auto">
      <div>
        <ChartLine
          OderDatasets1={Object.values(profit)}
          DataFor={`year`}
          DataType={`profit`}
          label={`yearProfit`}
        />
      </div>
      <div>
        <ChartLine
          OderDatasets1={Object.values(quarterlyProfit)}
          DataFor={`quarter`}
          DataType={`profit`}
          label={`quarterProfit`}
        />
      </div>
    </div>
  );
};

export default ProfitDashboard;
