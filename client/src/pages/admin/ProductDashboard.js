import React, { memo, useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/product";
import { ChartPie, ChartVertical } from "../../components";
import { apiAdminGetUserOrders } from "../../apis";

const ProductDashboard = () => {
  const [topSoldOut, setTopSoldOut] = useState({
    labels: [],
    datasets: [],
  });

  const [orderCounts, setOrderCounts] = useState({
    "Hoàn thành": 0,
    "Đang xử lý": 0,
    "Đang vận chuyển": 0,
    Hủy: 0,
  });

  const fetchOrders = async () => {
    const response = await apiAdminGetUserOrders();
    if (response.success) {
      const orders = response.orders;

      // Đếm số lượng theo từng trạng thái
      const counts = {
        "Hoàn thành": 0,
        "Đang xử lý": 0,
        "Đang vận chuyển": 0,
        Hủy: 0,
      };

      orders.forEach((order) => {
        counts[order.status]++;
      });

      setOrderCounts(counts);
    }
  };

  const fetchTopSoldOut = async () => {
    const response = await apiGetProducts({ sort: "-sold", limit: 5 });
    if (response.success) {
      setTopSoldOut({
        labels: response?.products.map((element) => element.title),
        datasets: response?.products.map((element) => element.sold),
      });
    }
  };

  useEffect(() => {
    fetchTopSoldOut();
    fetchOrders();
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 mt-[80px] p-4 ">
        <div>
          <ChartVertical
            nameProduct={topSoldOut.labels}
            soldProduct={topSoldOut.datasets}
            note="Số lượng đã bán"
            color="rgba(53, 162, 235, 0.5)"
            title="Biểu đồ thống kê Top 5 sản phẩm bán chạy nhất"
          />
        </div>
        <div>
          <ChartPie OderDatasets={Object.values(orderCounts)} />
        </div>
      </div>
    </>
  );
};

export default ProductDashboard;
