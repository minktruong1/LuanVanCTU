import React, { useEffect, useState } from "react";
import { apiGetAllPurchaseInfo } from "../../apis";
import { ChartLine } from "../../components";

const PurchaseDashboard = () => {
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

  const [spending, setSpending] = useState({
    ...initialOrderMonthData,
  });

  const fetchPurchaseInfo = async () => {
    const response = await apiGetAllPurchaseInfo({ limit: 99999 });
    if (response.success) {
      const purchaseInfoData = response.purchaseInfoData;

      const updatedSpending = { ...initialOrderMonthData };

      purchaseInfoData.forEach((purchaseInfo) => {
        const month = new Date(purchaseInfo.createdAt).getMonth();
        const spendingAmount = purchaseInfo.totalPay || 0;
        const monthName = Object.keys(initialOrderMonthData)[month];
        console.log(month);
        console.log(monthName);
        updatedSpending[monthName] += spendingAmount;
      });

      setSpending(updatedSpending);
    }
  };

  useEffect(() => {
    fetchPurchaseInfo();
  }, []);
  console.log(Object.values(spending));
  return (
    <div className="grid grid-rows-1 md:grid-cols-2 mt-[80px] p-4 overflow-auto">
      <div>
        <ChartLine
          OderDatasets1={Object.values(spending)}
          DataFor={`year`}
          DataType={`spending`}
          name={`Biểu đồ thống kê chi trả trong năm`}
        />
      </div>
    </div>
  );
};

export default PurchaseDashboard;
