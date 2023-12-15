import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/product";
import { ChartVertical } from "../../components";

const ProductDashboard = () => {
  const [topSoldOut, setTopSoldOut] = useState({
    labels: [],
    datasets: [],
  });

  const fetchTopSoldOut = async () => {
    const response = await apiGetProducts({ sort: "-sold", limit: 5 });
    if (response.success) {
      console.log(response);
      setTopSoldOut({
        labels: response?.products.map((element) => element.title),
        datasets: response?.products.map((element) => element.sold),
      });
    }
  };

  useEffect(() => {
    fetchTopSoldOut();
  }, []);

  return (
    <>
      <div className="grid grid-rows-1 md:grid-cols-2 mt-[80px] p-4 overflow-auto">
        <div>
          <ChartVertical
            nameProduct={topSoldOut.labels}
            soldProduct={topSoldOut.datasets}
            note="Số lượng đã bán"
            color="rgba(53, 162, 235, 0.5)"
            title="Biểu đồ thống kê Top 5 sản phẩm bán chạy nhất"
          />
        </div>
      </div>
    </>
  );
};

export default ProductDashboard;
